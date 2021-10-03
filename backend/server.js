const { instrument }= require('@socket.io/admin-ui');
const express = require('express');
const cors = require('cors');
const fs = require("fs");


require('dotenv').config();

const app=express();
//process.env.port chooses whatever port 
//the server you are deploying it on, chooses
const port = process.env.PORT||5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

var wordList;
var server=app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);

    //Getting dictionary and turning it into an array with
    //the words with more than 4 characters
    const text = fs.readFileSync("./scrabbleWordsWithDefinitions.txt").toString('utf-8');
    wordList = text.split("\n").filter((word)=>{
        let found=word.match(/^[A-Za-z]*\s/i);

        if(found[0].trim().length>3){
            return word;
        }
    })
    
})

app.get('/',(req,res)=>{
    res.send('The server is up and running');
})




app.get('/isstem/:word', async function (req, res) {

    console.log("in is stem");
    console.log(req.params.word);
    
    const search=new RegExp('^'+req.params.word+'[A-Za-z]*\\s','i');

    res.json(wordList.some(e => search.test(e)));
        
});

app.get('/isword/:word', async function (req, res) {

    let status1=false;
    let definition1="";

    console.log("in is word");
    console.log(req.params.word);
    
    const search=new RegExp('^'+req.params.word+'\\s','i');

    let i=0;
    if(wordList.some(e => {
        i++;//to get index of definition
        return search.test(e)
    })){
        status1=true;
        definition1=wordList[i-1].replace(/[A-Z]*/g,"").replace(/\(.*\)/g,"").replace(/\[.*\]/g,"").replace(/,\salso/g,"");
        definition1=definition1.slice(1,(definition1.length-2)).trim().concat('.');
    }
    
    res.json({status:status1,
            definition:definition1});
        
});




let roomsAvailable=[];

let userCreatedRooms=[];

const io = require('socket.io')(server,{
    cors:{
        origin:["https://ghostwordgameapp.netlify.app","https://admin.socket.io"],
    }
})

io.on('connection', socket=>{

    socket.on('check-room',(source,gameName,availability)=>{
        console.log("source"+source);
        console.log(userCreatedRooms);
        console.log(userCreatedRooms.includes(gameName));

        //if game name not entered
        if(source==="create-game"&&gameName.length<=0){
            availability({available:false, message:"Enter a game name."});
        }
        //if trying to create a game but name already taken
        if(source==="create-game"&&userCreatedRooms.includes(gameName)){
            console.log("if trying to create a game but name already taken");
            availability({available:false, message:"Name already taken."});
        }
        //If trying to create game and name not taken
        if(source==="create-game"&&!userCreatedRooms.includes(gameName)&&gameName.length>0){
            console.log("If trying to create game and name not taken");
            //Game name being pushed twice for some reason?
            userCreatedRooms.push(gameName);
            availability({available:true, message:""});
        }
        //if trying to join a game but doesn't exist
        if(source==="join-game"&&!userCreatedRooms.includes(gameName)){
            console.log("if trying to join a game but doesn't exist");
            availability({available:false, message:"Game doesn't exist."});
        }
        
        //if trying to join a game, but it's already full
        if(source==="join-game"&&userCreatedRooms.includes(gameName)){
            if(io.sockets.adapter.rooms.get(gameName).size===2){
                console.log("if trying to join a game, but it's already full");
                availability({available:false, message:"Game is full."});
            }else{
                console.log("if trying to join a game, and not full");
                availability({available:true, message:""});
            }
        }

    })

    //When joining room with friend
    socket.on('join-friend-room',(gameID,friendRoomInfo)=>{
        socket.join(gameID);
        if(io.sockets.adapter.rooms.get(gameID).size===1){
            userCreatedRooms.push(gameID);
            friendRoomInfo({yourTurn:true, room:gameID});
        }else{
            friendRoomInfo({yourTurn:false, room:gameID});
        }
    })



    socket.on("player-amount",(room, amount)=>{
        console.log("clients:"+io.sockets.adapter.rooms.get(room).size);
        socket.to(room).emit("receive-player-amount",io.sockets.adapter.rooms.get(room).size);
        amount(io.sockets.adapter.rooms.get(room).size);
    })

    //When there is user input from one player, send it to the opposing player
    socket.on('userinput',(letter, room)=>{
        console.log(letter);
        console.log(room);
        socket.to(room).emit("receive-letter",letter);
        
    })

    socket.on('username',(username, room, playerID)=>{
        console.log(username);
        console.log(playerID);
        socket.to(room).emit("opponent-name",username,playerID);
    })


    socket.on('request-rematch',(room,playerID)=>{
        socket.to(room).emit("rematch-requested", playerID);
    })

    socket.on('accept-rematch',(room,id,result)=>{
        socket.to(room).emit("rematch-accepted",id,result);
    })

    

    
})

//Eventually set auth to some username and password
instrument(io,{auth:false})


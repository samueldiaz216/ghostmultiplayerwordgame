import React,{useState,useEffect,useRef,useContext} from 'react';

import axios from 'axios';
import {io} from "socket.io-client";
import {gsap} from "gsap";
import "./Game.css";
import Header from "./Header";
import LoadingPage from './LoadingPage';
import {GameContext} from "./App";




function Game({history}) {
  const socket=io('https://ghostwordgameapp.herokuapp.com/');

  const gameInfo=useContext(GameContext);

  const [opponentName, setOpponentName]=useState('');

  const [numberOfPlayers, setNumberOfPlayers]=useState(0);


  //Keeps state of string being created by the users
  const [word,setWord]=useState("");

  //Keeps state of your score
  const [yourScore,setYourScore]=useState("");

  //Keeps state of opponent's score
  const [opponentScore,setOpponentScore]=useState("");

  //Keeps track of your turn
  const [yourTurn,setYourTurn]=useState();

  //Keeps track of what room you are in
  const [room, setRoom]=useState();

  const [result, setResult]=useState("");

  //we will use pressable to make sure the user can only press 
  //a valid key once, when it is their turn
  const [pressable, setPressable]=useState();

  const [requested,setRequested]=useState(false);

  const [countDown, setCountDown]=useState(0);


  const playHead=useRef();

  const secondPlayHead=useRef();


  //refs for ghost animations
  //your ghosts
  const uG1=useRef();
  const uG2=useRef();
  const uG3=useRef();
  const uG4=useRef();
  const uG5=useRef();
  //opponent ghosts
  const oG1=useRef();
  const oG2=useRef();
  const oG3=useRef();
  const oG4=useRef();
  const oG5=useRef();

  //Modal
  const modal=useRef();
  const overlay=useRef();
  const helpModal=useRef();

  const playAgain=useRef();
  const request=useRef();
  const timer=useRef();

  const gameString=useRef();

  const definitionPopUp=useRef();

  


  //Users pull a leter from here if they lose a round
  const array=['G','H','O','S','T'];  

  useEffect(()=>{
    //Set up floating ghost lives animation
    
    gsap.fromTo(uG1.current,{y:0},{y:10,duration:1,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(uG1.current,{opacity:1},{opacity:.5,duration:2,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(uG2.current,{y:0},{y:15,duration:3,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(uG2.current,{opacity:1},{opacity:.5,duration:1,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(uG3.current,{y:0},{y:10,duration:2,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(uG3.current,{opacity:1},{opacity:.5,duration:3,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(uG4.current,{y:0},{y:10,duration:2,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(uG4.current,{opacity:1},{opacity:.5,duration:3,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(uG5.current,{y:0},{y:10,duration:1,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(uG5.current,{opacity:1},{opacity:.5,duration:4,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});

    gsap.fromTo(oG1.current,{y:0},{y:20,duration:3,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(oG1.current,{opacity:1},{opacity:.5,duration:3,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(oG2.current,{y:0},{y:10,duration:1,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(oG2.current,{opacity:1},{opacity:.5,duration:1,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(oG3.current,{y:0},{y:10,duration:2,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(oG3.current,{opacity:1},{opacity:.5,duration:5,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(oG4.current,{y:0},{y:10,duration:2,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(oG4.current,{opacity:1},{opacity:.5,duration:4,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(oG5.current,{y:0},{y:10,duration:1,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
    gsap.fromTo(oG5.current,{opacity:1},{opacity:.5,duration:3,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});

    gameInfo.setPlayed();

    socket.emit("join-friend-room",gameInfo.gameID,friendRoomInfo=>{
      setRoom(friendRoomInfo.room);
      setYourTurn(friendRoomInfo.yourTurn);
      setPressable(friendRoomInfo.yourTurn);
      socket.emit("player-amount",friendRoomInfo.room,amount=>{
        console.log("Player Amount: "+amount);
        setNumberOfPlayers(amount);
      })
    })
    

    socket.on("receive-player-amount",amount=>{
      console.log("Player Amount: "+amount);
      setNumberOfPlayers(amount);
    })


    socket.on("opponent-name",(oppName,id)=>{
      
      if(id!==gameInfo.playerID){
        if(oppName.length===0||oppName===/\s*/){
          setOpponentName('Opponent');
        }else{
          setOpponentName(oppName);
        }
        
      }
      
    })

    //Receiving a letter from the opponent 
    socket.on("receive-letter",letter=>{
            
      console.log("got letter");
      setPressable((prev)=>!prev);
      setWord((prev) => prev + letter);

    })

    socket.on("rematch-requested",id=>{
      console.log("rematch requested");
      timer.current.classList.remove("hide");
      setCountDown(30);
      if(id!==gameInfo.playerID){
        request.current.classList.remove("inactive");
        setRequested(true);
      }
    })

    socket.on("rematch-accepted",(id,outcome)=>{
      
      //All of the following code restarts the game
      if(id===gameInfo.playerID && outcome==="You Lose"){
        setYourTurn(false);
      }

      if(id===gameInfo.playerID && outcome==="You Win!"){
        setYourTurn(true);
      }

      if(id!==gameInfo.playerID && outcome==="You Lose"){
        setYourTurn(true);
      }

      if(id!==gameInfo.playerID && outcome==="You Win!"){
        setYourTurn(false);
      }

      setYourScore("");
      setOpponentScore("");
      setRequested(false);
  
      overlay.current.classList.remove('active');
      modal.current.classList.remove('active');
      timer.current.classList.add("hide");
      request.current.classList.add("inactive");
      playAgain.current.disabled=false;
      setCountDown(30);
  
      //Make ghosts reappear
      uG1.current.classList.remove('inactive');
      uG2.current.classList.remove('inactive');
      uG3.current.classList.remove('inactive');
      uG4.current.classList.remove('inactive');
      uG5.current.classList.remove('inactive');
  
      oG1.current.classList.remove('inactive');
      oG2.current.classList.remove('inactive');
      oG3.current.classList.remove('inactive');
      oG4.current.classList.remove('inactive');
      oG5.current.classList.remove('inactive');
    })  
     
        
  },[])

  async function check(){

    //First check if word exists and is greater than length 3
    axios.get('https://ghostwordgameapp.herokuapp.com/isword/'+word).then(res=>{
      console.log("word:"+res.data);
      if(res.data.status && word.length>3){
      //if so, then the player to put the letter down, loses the round
      //Add a letter to the losing player
        console.log(yourTurn);
        if(yourTurn){
          console.log("in losing");
          setYourScore((prev)=>prev+array[prev.length]);
          setYourTurn(false);  
        
        }else{
          setOpponentScore((prev)=>prev+array[prev.length]);
          setYourTurn(true);
          
        }
        document.querySelector(".popup h2").innerText=word.toLowerCase();
        document.querySelector(".popup p").innerText=res.data.definition;

        gsap.fromTo(definitionPopUp.current,{opacity:0},{opacity:0.7, duration:2, ease:"none"});
        
        setTimeout(function(){
          gsap.fromTo(definitionPopUp.current,{opacity:0.7},{opacity:0, duration:2, ease:"none"});
        },7000)

        setWord("");
      }else{
        axios.get('https://ghostwordgameapp.herokuapp.com/isstem/'+word).then(res=>{
        console.log("stem:"+res.data);
        if(!res.data){
          
          if(yourTurn){
            
            setYourScore((prev)=>prev+array[prev.length]);
            setYourTurn(false);
          
          }else{
            setOpponentScore((prev)=>prev+array[prev.length]);
            setYourTurn(true);
            
          }

          document.querySelector(".popup h2").innerText=word.toLowerCase();
          document.querySelector(".popup p").innerText="is not the beginning of an actual word.";

          gsap.fromTo(definitionPopUp.current,{opacity:0},{opacity:0.7, duration:2, ease:"none"});
          setTimeout(function(){
            gsap.fromTo(definitionPopUp.current,{opacity:0.7},{opacity:0, duration:2, ease:"none"});
          },7000)

          setWord("");
        }else{
          setYourTurn((prev)=>!prev);
  
        }
      })
      }
    })
    
   

  }

  async function keypress(e){

   
    if(pressable && yourTurn){
      console.log(room);
      socket.emit('userinput', e.target.innerText, room);

    }else{
      console.log("you must enter a letter or wait your turn.");
    }   
    console.log(e.target.innerText);
  }



  useEffect(()=>{
    if(word.length>0){

      //Resizing logic so word doesn't get bigger than screen
      //Gets position of right edge of word in relation to window
      let rect=gameString.current.getBoundingClientRect();

      //Gets distance of word from edge of window
      let distanceFromWindow=(window.innerWidth-rect.right);
      console.log(distanceFromWindow);

      //If the distance is less than 36 pixels, then resize the word
      if(distanceFromWindow<36){
        let gameStringFontSize=parseFloat(window.getComputedStyle(gameString.current, null).getPropertyValue('font-size'));
        console.log("font size: "+gameStringFontSize);
        gsap.to(gameString.current,{duration:1,fontSize:((gameStringFontSize/4)*3)})//reduces font size by 25%
      }

      //Checks if word is valid stem or word
      check();
    }

  },[word])

  useEffect(()=>{
    if(yourScore==="G"){
      gsap.to(uG1.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ uG1.current.classList.add('inactive'); }, 2500);
    }
    if(yourScore==="GH"){
      gsap.to(uG2.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ uG2.current.classList.add('inactive'); }, 2500);
    }
    if(yourScore==="GHO"){
      gsap.to(uG3.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ uG3.current.classList.add('inactive'); }, 2500);
    }
    if(yourScore==="GHOS"){
      gsap.to(uG4.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ uG4.current.classList.add('inactive'); }, 2500);
    }
    if(yourScore==="GHOST"){
      gsap.to(uG5.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ uG5.current.classList.add('inactive'); }, 2500);
      setResult("You Lose")
      overlay.current.classList.add('active');
      modal.current.classList.add('active');
    }

    

  },[yourScore])

  useEffect(()=>{
    if(opponentScore==="G"){
      gsap.to(oG1.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ oG1.current.classList.add('inactive'); }, 2500);
    }
    if(opponentScore==="GH"){
      gsap.to(oG2.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ oG2.current.classList.add('inactive'); }, 2500);
    }
    if(opponentScore==="GHO"){
      gsap.to(oG3.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ oG3.current.classList.add('inactive'); }, 2500);
    }
    if(opponentScore==="GHOS"){
      gsap.to(oG4.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ oG4.current.classList.add('inactive'); }, 2500);
    }
    if(opponentScore==="GHOST"){
      gsap.to(oG5.current, {y:-window.innerHeight,duration:3,opacity: 0, ease:"sine"});
      setTimeout(function(){ oG5.current.classList.add('inactive'); }, 2500);
      setResult("You Win!")
      overlay.current.classList.add('active');
      modal.current.classList.add('active');
    }
   

  },[opponentScore])

  useEffect(()=>{
    console.log("in playhead moves");
    console.log("useEffect yourTurn:"+yourTurn);
    //check if both players are in the game before moving the playheads to their respective positions
    if(numberOfPlayers>=2){
      if(yourTurn){
        gsap.fromTo(playHead.current,{x:0},{x:(secondPlayHead.current.offsetLeft-playHead.current.offsetLeft), runBackwards:true, duration:2});
        
      }else{
        gsap.fromTo(playHead.current,{x:0},{x:(secondPlayHead.current.offsetLeft-playHead.current.offsetLeft), duration:2});
        
      }
    }

  },[yourTurn,numberOfPlayers])

  useEffect(()=>{
    if(numberOfPlayers>=2){
      socket.emit("username", gameInfo.name, room, gameInfo.playerID);
    }
  },[numberOfPlayers])

  function requestRematch(){
    
    if(requested){
      console.log(result);
      socket.emit("accept-rematch",room, gameInfo.playerID, result);
    }else{
      console.log(result);
      playAgain.current.disabled=true;
      socket.emit("request-rematch",room, gameInfo.playerID);
      //Start the timer for both
      
    } 
  }

  

  useEffect(()=>{
  
  
    if(countDown>0){
      setTimeout(() => setCountDown((prev)=>prev-1), 1000);
    }

    if(requested&&countDown<=0){
      playAgain.current.disabled=true;
    }
    
    
    
  },[countDown])



  




  return (
    <div>
    <div className={(numberOfPlayers<2)?"":"hide"} >
      <LoadingPage
      roomID={room} />
    </div>    
    <div className={(numberOfPlayers<2)?"hide":"main"}>

      <Header/>
      <div className="score-board">
        <div className="score">
          <img ref={playHead} className="playhead" src="images/triangular-arrowhead-.png"/>
          <h2 className={yourTurn?"active-player-color":""}>{gameInfo.name}</h2>
          <div className="ghost-score">
            <img ref={uG1} className="ghost-image" src="images/flyingghost.png"/>
            <img ref={uG2} className="ghost-image" src="images/flyingghost.png"/>
            <img ref={uG3} className="ghost-image" src="images/flyingghost.png"/>
            <img ref={uG4} className="ghost-image" src="images/flyingghost.png"/>
            <img ref={uG5} className="ghost-image" src="images/flyingghost.png"/>
          </div>
        </div>
        <div className="score">
          <img ref={secondPlayHead} className="playhead playhead-two" src="images/triangular-arrowhead-.png"/>
          <h2 className={yourTurn?"":"active-player-color"}>{opponentName}</h2>
          <div className="ghost-score">
            <img ref={oG1} className="ghost-image" src="images/flyingghost.png"/>
            <img ref={oG2} className="ghost-image" src="images/flyingghost.png"/>
            <img ref={oG3} className="ghost-image" src="images/flyingghost.png"/>
            <img ref={oG4} className="ghost-image" src="images/flyingghost.png"/>
            <img ref={oG5} className="ghost-image" src="images/flyingghost.png"/>
          </div>
        </div>
        
       
      </div>
      
      <div class="word">
        <h1 ref={gameString}>{word}</h1>
      </div>

      <div className="virtual-keypad">
        <div>
          <button name="q" value="q" onClick={keypress}><span>q</span></button>
          <button name="w" value="w" onClick={keypress}><span>w</span></button>
          <button name="e" value="e" onClick={keypress}><span>e</span></button>
          <button name="r" value="r" onClick={keypress}><span>r</span></button>
          <button name="t" value="t" onClick={keypress}><span>t</span></button>
          <button name="y" value="y" onClick={keypress}><span>y</span></button>
          <button name="u" value="u" onClick={keypress}><span>u</span></button>
          <button name="i" value="i" onClick={keypress}><span>i</span></button>
          <button name="o" value="o" onClick={keypress}><span>o</span></button>
          <button name="p" value="p" onClick={keypress}><span>p</span></button>
        </div>
        <div>
          <button name="a" value="a" onClick={keypress}><span>a</span></button>
          <button name="s" value="s" onClick={keypress}><span>s</span></button>
          <button name="d" value="d" onClick={keypress}><span>d</span></button>
          <button name="f" value="f" onClick={keypress}><span>f</span></button>
          <button name="g" value="g" onClick={keypress}><span>g</span></button>
          <button name="h" value="h" onClick={keypress}><span>h</span></button>
          <button name="j" value="j" onClick={keypress}><span>j</span></button>
          <button name="k" value="k" onClick={keypress}><span>k</span></button>
          <button name="l" value="l" onClick={keypress}><span>l</span></button>
        </div>
        <div>
          <button name="z" value="z" onClick={keypress}><span>z</span></button>
          <button name="x" value="x" onClick={keypress}><span>x</span></button>
          <button name="c" value="c" onClick={keypress}><span>c</span></button>
          <button name="v" value="v" onClick={keypress}><span>v</span></button>
          <button name="b" value="b" onClick={keypress}><span>b</span></button>
          <button name="n" value="n" onClick={keypress}><span>n</span></button>
          <button name="m" value="m" onClick={keypress}><span>m</span></button>
        </div>
      </div>
      
      
    

    </div>
    <div ref={modal} className="end-game-modal">
      <div className="end-game-modal-header">
        <h2>{result}</h2>
      </div>
      <div className="end-game-modal-buttons">
        <p ref={request} className="inactive">{opponentName} wants to play again.</p>
        <div>
          <button ref={playAgain} onClick={requestRematch}>Play Again</button>
          <h3 ref={timer} className="hide">:{countDown}</h3>
        </div>        
        
        <button onClick={()=>{
          gameInfo.clearGameID();
          history.push('/');
        }}>Back to Login</button>
      </div>   
    </div>
    <div ref={overlay} className="overlay">
        
    </div>
    <div ref={definitionPopUp} className="popup">
      <h2></h2>
      <p></p>
    </div>
    
    <div ref={helpModal} className="rules-modal">
      <div className="rules-modal-header">
          <h3>Rules</h3>
          <img onClick={()=>{
              overlay.current.classList.remove('active');
              helpModal.current.classList.remove('active');
          }} src="images/icon-close.svg"/>
      </div>

      <div className="rules-info">
          <p>-Ghost is a word game in which 
          players take turns adding letters to a growing 
          word fragment, trying not to be the one to 
          complete a valid word. </p>

          <p>-The player who completes a word loses the round 
          and loses a life.</p>

          <p>-In order for a word to count, it must be at least
          4 letters long.</p>

          <p>-Each fragment must be the beginning of 
          an actual word. otherwise, the player
          that makes the invalid word fragment loses a life.</p>

          <p>-Each player has 5 lives. The first player
          to lose all their 5 lives, loses the game.</p>

          <p>-To create a new game, just click on the new
          game button. Enter the name for your new game and send that 
          name to a friend so they can join. </p>

          <p>-To join a game, just click the join game button
          and enter the name of the game you want to join.</p>

      </div>
      
      
  </div>

    <button className="helpButton"><h4  onClick={()=>{
        overlay.current.classList.add('active');
        helpModal.current.classList.add('active');
    }}>?</h4></button>
    </div>
  )
}

export default Game;
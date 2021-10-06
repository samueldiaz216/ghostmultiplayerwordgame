"use strict";

var _require = require('@socket.io/admin-ui'),
    instrument = _require.instrument;

var express = require('express');

var cors = require('cors');

var fs = require("fs");

require('dotenv').config();

var app = express();
var port = process.env.PORT || 5000; //MIDDLEWARE

app.use(cors());
app.use(express.json());
var wordList;
var server = app.listen(port, function () {
  console.log("Listening on port ".concat(port)); //Getting dictionary and turning it into an array with
  //the words with more than 4 characters.

  var text = fs.readFileSync("./scrabbleWordsWithDefinitions.txt").toString('utf-8');
  wordList = text.split("\n").filter(function (word) {
    var found = word.match(/^[A-Za-z]*\s/i);

    if (found[0].trim().length > 3) {
      return word;
    }
  });
});
app.get('/', function (req, res) {
  res.send('The server is up and running');
});
app.get('/isstem/:word', function _callee(req, res) {
  var search;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("in is stem");
          console.log(req.params.word);
          search = new RegExp('^' + req.params.word + '[A-Za-z]*\\s', 'i');
          res.json(wordList.some(function (e) {
            return search.test(e);
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.get('/isword/:word', function _callee2(req, res) {
  var status1, definition1, search, i;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          status1 = false;
          definition1 = "";
          console.log("in is word");
          console.log(req.params.word);
          search = new RegExp('^' + req.params.word + '\\s', 'i');
          i = 0;

          if (wordList.some(function (e) {
            i++; //to get index of definition

            return search.test(e);
          })) {
            status1 = true;
            definition1 = wordList[i - 1].replace(/[A-Z]*/g, "").replace(/\(.*\)/g, "").replace(/\[.*\]/g, "").replace(/,\salso/g, "");
            definition1 = definition1.slice(1, definition1.length - 2).trim().concat('.');
          }

          res.json({
            status: status1,
            definition: definition1
          });

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
});

var io = require('socket.io')(server, {
  cors: {
    origin: ["https://ghostwordgameapp.netlify.app", "https://admin.socket.io"]
  }
});

var userCreatedRooms = [];
io.on('connection', function (socket) {
  socket.on('check-room', function (source, gameName, availability) {
    console.log("source" + source);
    console.log(userCreatedRooms);
    console.log(userCreatedRooms.includes(gameName)); //if game name not entered

    if (source === "create-game" && gameName.length <= 0) {
      availability({
        available: false,
        message: "Enter a game name."
      });
    } //if trying to create a game but name already taken


    if (source === "create-game" && userCreatedRooms.includes(gameName)) {
      console.log("if trying to create a game but name already taken");
      availability({
        available: false,
        message: "Name already taken."
      });
    } //If trying to create game and name not taken


    if (source === "create-game" && !userCreatedRooms.includes(gameName) && gameName.length > 0) {
      console.log("If trying to create game and name not taken");
      userCreatedRooms.push(gameName);
      availability({
        available: true,
        message: ""
      });
    } //If trying to join a game but doesn't exist


    if (source === "join-game" && !userCreatedRooms.includes(gameName)) {
      console.log("if trying to join a game but doesn't exist");
      availability({
        available: false,
        message: "Game doesn't exist."
      });
    } //If trying to join a game, but it's already full


    if (source === "join-game" && userCreatedRooms.includes(gameName)) {
      if (io.sockets.adapter.rooms.get(gameName).size === 2) {
        console.log("if trying to join a game, but it's already full");
        availability({
          available: false,
          message: "Game is full."
        });
      } else {
        console.log("if trying to join a game, and not full");
        availability({
          available: true,
          message: ""
        });
      }
    }
  }); //When joining room with friend

  socket.on('join-friend-room', function (gameID, friendRoomInfo) {
    socket.join(gameID);

    if (io.sockets.adapter.rooms.get(gameID).size === 1) {
      userCreatedRooms.push(gameID);
      friendRoomInfo({
        yourTurn: true,
        room: gameID
      });
    } else {
      friendRoomInfo({
        yourTurn: false,
        room: gameID
      });
    }
  });
  socket.on("player-amount", function (room, amount) {
    console.log("clients:" + io.sockets.adapter.rooms.get(room).size);
    socket.to(room).emit("receive-player-amount", io.sockets.adapter.rooms.get(room).size);
    amount(io.sockets.adapter.rooms.get(room).size);
  }); //When there is user input from one player, send it to the opposing player

  socket.on('userinput', function (letter, room) {
    console.log(letter);
    console.log(room);
    socket.to(room).emit("receive-letter", letter);
  });
  socket.on('username', function (username, room, playerID) {
    console.log(username);
    console.log(playerID);
    socket.to(room).emit("opponent-name", username, playerID);
  });
  socket.on('request-rematch', function (room, playerID) {
    socket.to(room).emit("rematch-requested", playerID);
  });
  socket.on('accept-rematch', function (room, id, result) {
    socket.to(room).emit("rematch-accepted", id, result);
  });
});
instrument(io, {
  auth: false
});
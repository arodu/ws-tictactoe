var express = require('express');
var app = express();

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = require('http').Server(app);
var io = require('socket.io')(server);

var Game = require('./game');

var count = 0
var rooms = []

io.on('connection', (socket) => {
  getRoom(socket);


})

function getRoom(socket){
  //console.log(rooms)

  let game = rooms.find((g) => {
    return !(g.fullPlayers())
  })

  if( game == undefined ){
    let channel = count
    game = new Game(io, channel)
    game.newPlayer(socket)
    rooms[count] = game
    count++

  }else{
    game.newPlayer(socket)
  }

  //console.log(game)


  /*if(rooms != []){



  }else{

  }*/
}



//var game = new Game(io)

app.use(express.static('docs'));

app.get('/hello', function(req, res){
  res.status(200).send("Hello Word!")
})

server.listen(port, function() {
  console.log('Runnin in '+port);
})

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var Game = require('./game');

var rooms = []

io.on('connection', (socket) => {
  



})


//var game = new Game(io)

app.use(express.static('docs'));

app.get('/hello', function(req, res){
  res.status(200).send("Hello Word!")
})


server.listen(8080, function() {
  console.log('Servidor corriendo en http://localhost:8080');
});

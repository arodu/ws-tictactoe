const socket = io.connect('https://ws-tictactoe.herokuapp.com/', { 'forceNew': false });
//const socket = io.connect('ws://127.0.0.1:8080', { 'forceNew': false });
//const socket = io.connect('ws://192.168.0.108:8080', { 'forceNew': false });

const playerName = document.getElementById('playerName')
const status = document.getElementById('status')
const boardCells = document.getElementsByClassName('cell')
let player = 0

socket.on('messages', function(data) {
  console.log(data);
});

socket.on('player', function(data) {
    player = data.player
    if(data.player == 0){
      playerName.innerHTML = "Guest"
    }else{
      playerName.innerHTML = "Game "+data.channel+": Player "+data.player
    }
});

socket.on('board', function(data) {
    //console.log(data)
    renderBoard(data.board);
    status.innerHTML = "Turn player "+data.turn
});

socket.on('alert', function(data) {
  alert(data)
  console.log(data);
});

//socket.on('move', function(data) {
//    console.log(data);
//});


const renderBoard = (board) => {
  board.map((value, key) => {
    if(value == 1){
      boardCells[key].innerHTML = 'X'
    }else if(value == 2){
      boardCells[key].innerHTML = 'O'
    }else{
      boardCells[key].innerHTML = '&nbsp'
    }
  })
}

const move = (key) => {
  socket.emit('move', {player, key})
}

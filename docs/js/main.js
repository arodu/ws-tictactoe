//const socket = io.connect('https://ws-tictactoe.herokuapp.com/', { 'forceNew': false });
//const socket = io.connect('ws://127.0.0.1:3000', { 'forceNew': false });
const socket = io.connect('ws://192.168.0.108:3000', { 'forceNew': false });

const playerName = document.getElementById('playerName')
const playerOponent = document.getElementById('playerOponent')
const roomName = document.getElementById('roomName')
const status = document.getElementById('status')
const boardCells = document.getElementsByClassName('cell')
const opponent = document.getElementById('opponent')
let player = 0

socket.on('messages', function(data) {
  console.log(data);
});

socket.on('player', function(data) {
    player = data.player
    if(data.player == 0){
      playerName.innerHTML = "Guest"
    }else{
      playerName.innerHTML = "Player "+data.player
      playerOponent.innerHTML = "Player "+(data.player==1 ? 2 : 1)
    }
    roomName.innerHTML = "Room "+(data.channel+1)
});

socket.on('board', function(data) {
    renderBoard(data.board);
    status.innerHTML = "Turn player "+data.turn
});

socket.on('opponent', function(data){
  if(data.player != player){
    opponent.innerHTML = data.message
  }
})

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
      //boardCells[key].innerHTML = '<i class="fas fa-times"></i>'
      boardCells[key].classList.add('p1')
    }else if(value == 2){
      boardCells[key].classList.add('p2')
      //boardCells[key].innerHTML = '<i class="fas fa-circle"></i>'
    }else{
      boardCells[key].classList.remove('p1')
      boardCells[key].classList.remove('p2')
      boardCells[key].innerHTML = ''
    }
  })
}

const move = (key) => {
  socket.emit('move', {player, key})
}

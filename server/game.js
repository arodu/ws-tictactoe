
class Game{

  constructor(io){
    this.io = io
    this.init()

    this.io.on('connection', (socket) => {
        let player = this.selectPlayer(socket)
        socket.emit('player', player)
        console.log(`Player ${player} connected`);
        this.io.sockets.emit('messages', `Player ${player} connected`)
        this.io.sockets.emit('board', {board: this.board, turn: this.turn})

        socket.on('move', (payload) => {
          if( payload.player == this.turn && this.move(payload) ){
            this.io.sockets.emit('board', {board: this.board, turn: this.turn})
            socket.emit('messages', "valid movement")

            if(this.checkWinner()){
              this.io.sockets.emit('alert', `Winner player ${this.turn}`)
              this.init(this.turn)
            }else if(this.checkFull()){
              this.io.sockets.emit('alert', `Game without winners`)
              this.changeTurn()
              this.init(this.turn)
            }else{
              this.changeTurn()
            }

            this.io.sockets.emit('board', {board: this.board, turn: this.turn})

          }else{
            socket.emit('messages', "invalid movement")
          }
        })

    })
  }

  selectPlayer(socket){
    if(this.player1 == undefined){
      this.player1 = socket
      return 1;
    }else if(this.player2 == undefined){
      this.player2 = socket
      return 2;
    }
    return 0;
  }

  init(turn = 1){
    this.board = [0,0,0,0,0,0,0,0,0]
    this.turn = turn
  }

  getBoard(){
    return this.board
  }

  move(data){
    if(this.board[data.key] == 0){
      this.board[data.key] = data.player
      return true
    }
    return false
  }

  changeTurn(){
    if( this.turn == 1 ){
      this.turn = 2
    }else {
      this.turn = 1
    }
  }

  checkWinner(){
    let b = this.board
    let win = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];

    let isWin = win.filter( (l) => {
      return (b[l[0]]==b[l[1]] && b[l[1]]==b[l[2]] && b[l[0]] != 0)
    } )
    return (isWin.length > 0)
  }

  checkFull(){
    let isFull = this.board.filter( (cell) => {
      return (cell == 0)
    } )

    return !(isFull.length > 0)
  }


}

module.exports =  Game;

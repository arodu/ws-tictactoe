
class Game{

  constructor(io, channel){
    this.io = io
    this.channel = channel
    this.init()

    console.log("new channel "+this.channel)
    //this.io.to(this.channel).emit('board', {board: this.board, turn: this.turn})

    this.player = {
      "1": null,
      "2": null,
    }

  }

  init(turn = 1){
    this.board = [0,0,0,0,0,0,0,0,0]
    this.turn = turn
  }

  newPlayer(socket){
    let player = this.selectPlayer(socket)
    socket.join(this.channel);

    socket.emit('channel', this.channel);

    socket.on('move', (payload) => {
      if( payload.player == this.turn && this.move(payload) ){
        this.io.to(this.channel).emit('board', {board: this.board, turn: this.turn})
        socket.emit('messages', "valid movement")

        if(this.checkWinner()){
          this.io.to(this.channel).emit('alert', `Winner player ${this.turn}`)
          this.init(this.turn)
        }else if(this.checkFull()){
          this.io.to(this.channel).emit('alert', `Game without winners`)
          this.changeTurn()
          this.init(this.turn)
        }else{
          this.changeTurn()
        }

        this.io.to(this.channel).emit('board', {board: this.board, turn: this.turn})

      }else{
        socket.emit('messages', "invalid movement")
      }
    })

    socket.on('disconnect', () => {
      let player = 0
      if(this.player["1"] != null && socket.id == this.player["1"].id){
        player = 1
        this.player["1"] = null
      }
      if(this.player["2"] != null && socket.id == this.player["2"].id){
        player = 2
        this.player["2"] = null
      }

      this.io.to(this.channel).emit('messages', `Player ${player} disconnected`)
    })

    console.log(`Player ${player} connected`);
    socket.emit('player', {player: player, channel: this.channel})
    this.io.to(this.channel).emit('messages', `Player ${player} connected`)

    this.io.to(this.channel).emit('board', {board: this.board, turn: this.turn})

    return player;
  }

  selectPlayer(socket){
    let player = 0
    if(this.player["1"] == null){
      this.player["1"] = socket
      player = 1
    }else if(this.player["2"] == null){
      this.player["2"] = socket
      player = 2
    }
    return player
  }

  fullPlayers(){
    return (this.player["1"] != null && this.player["2"] != null)
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

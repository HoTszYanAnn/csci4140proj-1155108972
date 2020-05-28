var _ = require('lodash');

class Node {
  constructor(game, parent, move, depth, mcts) {
    this.game = game;
    this.mcts = mcts;
    this.parent = parent;
    this.move = move;
    this.wins = [];
    this.visits = 0;
    this.children = null;
    this.depth = depth || 0;
  }

  getUCB1(player) {
    let scorePerVisit = 0;
    // always visit unvisited nodes first
    if (this.visits == 0) return Infinity;
    if (!this.parent) {
      return 0;
    }
    scorePerVisit = (this.wins[player] || 0) / this.visits;
    return scorePerVisit + Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
  }

  getChildren() {
    if (this.children === null) {
      if (this.move !== null) {
        this.performMove(this.move);
        // console.log("move");
        // console.log(this.move)
        // console.log(this.game.G.cells)
        //console.log(this.game.G.hp)
        //console.log(this.game.G.mineValue)
        //console.log(this.depth+" "+this.move)
      }
      var moves = this.getPossibleMoves();
      this.children = []
      for (let i = 0; i < moves.length; i++) {
        let node = new Node(_.cloneDeep(this.game), this, moves[i], this.depth + 1, this.mcts)
        this.children.push(node)
      }
      //console.log(this.children)
    }
    return this.children;
  }

  getWinner() {
    // forces the move to be performed
    this.getChildren();
    let x = this.game.G.boardx
    let y = this.game.G.boardy
    let full = true
    for (let i = 0; i < x * y; i++) {
      if (this.game.G.cells[i] == null) {
        full = false
        break;
      }
    }
    /*if (this.parent && this.parent.children.length < (x * y / 3)) {
     
      if (this.game.G.hp[0] <= 0) {
        return 1;
      }
      else if (this.game.G.hp[1] <= 0) {
        return 0;
      }
      else {
        if (full) {
          if (this.game.G.hp[0] < this.game.G.hp[1])
            return { winner: 1 };
          else if (this.game.G.hp[1] < this.game.G.hp[0])
            return { winner: 0 };
          else
            return { winner: 1 };
        } else {
          //console.log(this.game.G.cells)
        }
      }
    }
    else {*/
      if (this.game.G.hp[0] <= this.mcts.orginalhp[0] - 2 || this.game.G.hp[0] <= 0) {
        return 1;
      }
      else if (this.game.G.hp[1] <= this.mcts.orginalhp[1] - 2 || this.game.G.hp[1] <= 0) {
        return 0;
      }
      else {
        if (full) {
          if (this.game.G.hp[0] < this.game.G.hp[1])
            return { winner: 1 };
          else if (this.game.G.hp[1] < this.game.G.hp[0])
            return { winner: 0 };
          else
            return { winner: 1 };
        } else {
          //console.log(this.game.G.cells)
        }
     // }
    }
    return false;
  }

  nextMove() {
    return _(this.getChildren()).shuffle().sortBy(this.mcts.nodeSort).last();
  }

  getPossibleMoves() {
    let moves = []

    //console.log(this.haveMine())
    //console.log(this.game.G.playersMine);
    //console.log(this.game.G.mineValue.length)
    //console.log(1 - Math.abs(this.mcts.player - this.depth % 2));
    if (this.haveMine()) {
      for (let i = 0; i < this.game.G.mineValue.length * 2; i++) {
        if (i < this.game.G.mineValue.length) {
          if (this.game.G.cells[i] == null) {
            moves.push(i)
          }
        } else {
          if (this.placeActive(i - this.game.G.mineValue.length)) {
            moves.push(i)
          }
        }
      }
    } else {
      for (let i = 0; i < this.game.G.mineValue.length; i++) {
        if (i < this.game.G.mineValue.length) {
          if (this.game.G.cells[i] == null) {
            moves.push(i)
          }
        }
      }
    }
    //console.log(moves);
    //console.log(moves);
    //console.log(moves)
    moves = _.shuffle(moves);
    //console.log(moves)

    return moves;
  }
  haveMine() {
    let cPlayer = Math.abs(this.mcts.player - this.depth % 2)
    //console.log(cPlayer)
    let sum = 0
    for (let i = 5 * cPlayer; i < 5 * cPlayer + 5; i++) {
      sum = sum + this.game.G.playersMine[i]
    }
    if (sum > 0) return true
    return false
  }
  placeActive = (id) => {
    if (this.game.G.cells[id] || this.game.G.cells[id] == 0) return false;
    if ((this.game.G.cells[id - 1] || this.game.G.cells[id - 1] == 0) && (id % this.game.G.boardx != 0)) return false;
    if ((this.game.G.cells[id + 1] || this.game.G.cells[id + 1] == 0) && (id % this.game.G.boardx != this.game.G.boardx - 1)) return false;
    if ((this.game.G.cells[id + this.game.G.boardx - 1] || this.game.G.cells[id + this.game.G.boardx - 1] == 0) && (id % this.game.G.boardx != 0)) return false;
    if (this.game.G.cells[id + this.game.G.boardx] || this.game.G.cells[id + this.game.G.boardx] == 0) return false;
    if ((this.game.G.cells[id + this.game.G.boardx + 1] || this.game.G.cells[id + this.game.G.boardx + 1] == 0) && (id % this.game.G.boardx != this.game.G.boardx - 1)) return false;
    if ((this.game.G.cells[id - this.game.G.boardx - 1] || this.game.G.cells[id - this.game.G.boardx - 1] == 0) && (id % this.game.G.boardx != 0)) return false;
    if (this.game.G.cells[id - this.game.G.boardx] || this.game.G.cells[id - this.game.G.boardx] == 0) return false;
    if ((this.game.G.cells[id - this.game.G.boardx + 1] || this.game.G.cells[id - this.game.G.boardx + 1] == 0) && (id % this.game.G.boardx != this.game.G.boardx - 1)) return false;
    return true;
  }
  performMove(id) {
    let cPlayer = 1 - Math.abs(this.mcts.player - this.depth % 2)
    //console.log(cPlayer)
    if (id < this.game.G.mineValue.length) {
      let x = this.game.G.boardx
      this.game.G.cells[id] = this.calculateMinesAround(id)
      if (this.mcts.inBoard(id + 1) && (id % x != x - 1) && this.game.G.cells[id + 1] == null) this.game.G.cells[id + 1] = this.calculateMinesAround(id + 1)
      if (this.mcts.inBoard(id - 1) && (id % x != 0) && this.game.G.cells[id - 1] == null) this.game.G.cells[id - 1] = this.calculateMinesAround(id - 1)
      if (this.mcts.inBoard(id + x) && this.game.G.cells[id + x] == null) this.game.G.cells[id + x] = this.calculateMinesAround(id + x)
      if (this.mcts.inBoard(id - x) && this.game.G.cells[id - x] == null) this.game.G.cells[id - x] = this.calculateMinesAround(id - x)
    } else {
      id = id - this.game.G.mineValue.length
      let mineValue = 0
      //console.log(this.game.G.playersMine)
      do {
        mineValue = Math.floor(Math.random() * 5)
      } while (this.game.G.playersMine[cPlayer * 5 + mineValue] <= 0)
      this.game.G.mineValue[id] += mineValue + 1
      this.game.G.playersMine[cPlayer * 5 + mineValue] -= 1
    }
  }

  calculateMinesAround(id) {
    let mines = 0;
    let x = this.game.G.boardx
    if (this.game.G.mineValue[id - 1] && this.game.G.mineValue[id - 1] > 0 && (id % x != 0)) {
      mines = mines + this.game.G.mineValue[id - 1];
    }
    if (this.game.G.mineValue[id + 1] && this.game.G.mineValue[id + 1] > 0 && (id % x != x - 1)) {
      mines = mines + this.game.G.mineValue[id + 1];
    }
    if (this.game.G.mineValue[id + x - 1] && this.game.G.mineValue[id + x - 1] > 0 && (id % x != 0)) {
      mines = mines + this.game.G.mineValue[id + x - 1];
    }
    if (this.game.G.mineValue[id + x] && this.game.G.mineValue[id + x] > 0) {
      mines = mines + this.game.G.mineValue[id + x];
    }
    if (this.game.G.mineValue[id + x + 1] && this.game.G.mineValue[id + x + 1] > 0 && (id % x != x - 1)) {
      mines = mines + this.game.G.mineValue[id + x + 1];
    }
    if (this.game.G.mineValue[id - x - 1] && this.game.G.mineValue[id - x - 1] > 0 && (id % x != 0)) {
      mines = mines + this.game.G.mineValue[id - x - 1];
    }
    if (this.game.G.mineValue[id - x] && this.game.G.mineValue[id - x] > 0) {
      mines = mines + this.game.G.mineValue[id - x];
    }
    if (this.game.G.mineValue[id - x + 1] && this.game.G.mineValue[id - x + 1] > 0 && (id % x != x - 1)) {
      mines = mines + this.game.G.mineValue[id - x + 1];
    }
    if (this.game.G.mineValue[id] !== null)
      this.game.G.hp[Math.abs(this.mcts.player - this.depth % 2)] -= this.game.G.mineValue[id]
    return mines;
  }
}


class MCTS {
  constructor(game, aiMine) {
    this.aiMine = aiMine
    this.game = _.cloneDeep(game);
    this.orginalMineArray = _.cloneDeep(this.game.G.mineValue);
    this.orginalCells = _.cloneDeep(this.game.G.cells)
    this.nodeSort = function (node) {
      if (node.parent) return node.getUCB1(1 - Math.abs(node.mcts.player - node.parent.depth % 2));
      return 0;
    };
    this.winnerarr = []
    this.orginalhp = _.cloneDeep(this.game.G.hp);
    this.rounds = this.game.ai.time || 15;
    console.log(this.rounds)
    this.player = this.game.ctx.currentPlayer || 0;
    this.rootNode = new Node(this.game, null, null, 0, this);
  }

  inBoard(id) {
    let x = this.game.G.boardx
    let y = this.game.G.boardy
    if (id >= 0 && id < x * y) return true
    return false
  }

  fillMinable(id, val, minable) {
    let x = this.game.G.boardx
    if (id % x != 0 && this.inBoard(id - 1 - x)) if (minable[id - 1 - x] === null || minable[id - 1 - x] > val) minable[id - 1 - x] = val;
    if (this.inBoard(id - x)) if (minable[id - x] === null || minable[id - x] > val) minable[id - x] = val;
    if ((id % x != x - 1) && this.inBoard(id + 1 - x)) if (minable[id + 1 - x] === null || minable[id + 1 - x] > val) minable[id + 1 - x] = val;
    if (id % x != 0 && this.inBoard(id - 1)) if (minable[id - 1] === null || minable[id - 1] > val) minable[id - 1] = val;
    if ((id % x != x - 1) && this.inBoard(id + 1)) if (minable[id + 1] === null || minable[id + 1] > val) minable[id + 1] = val;
    if (id % x != 0 && this.inBoard(id - 1 + x)) if (minable[id - 1 + x] === null || minable[id - 1 + x] > val) minable[id - 1 + x] = val;
    if (this.inBoard(id + x)) if (minable[id + x] === null || minable[id + x] > val) minable[id + x] = val;
    if ((id % x != x - 1) && this.inBoard(id + 1 + x)) if (minable[id + 1 + x] === null || minable[id + 1 + x] > val) minable[id + 1 + x] = val;
    return minable;
  }

  minusCellValue(id, val, cells) {
    let x = this.game.G.boardx
    if (id % x != 0 && this.inBoard(id - 1 - x)) if (cells[id - 1 - x] != null) cells[id - 1 - x] -= val;
    if (this.inBoard(id - x)) if (cells[id - x] != null) cells[id - x] -= val;
    if ((id % x != x - 1) && this.inBoard(id + 1 - x)) if (cells[id + 1 - x] != null) cells[id + 1 - x] -= val;
    if (id % x != 0 && this.inBoard(id - 1)) if (cells[id - 1] != null) cells[id - 1] -= val;
    if ((id % x != x - 1) && this.inBoard(id + 1)) if (cells[id + 1] != null) cells[id + 1] -= val;
    if (id % x != 0 && this.inBoard(id - 1 + x)) if (cells[id - 1 + x] != null) cells[id - 1 + x] -= val;
    if (this.inBoard(id + x)) if (cells[id + x] != null) cells[id + x] -= val;
    if ((id % x != x - 1) && this.inBoard(id + 1 + x)) if (cells[id + 1 + x] != null) cells[id + 1 + x] -= val;
    return cells;
  }
  randomizeMine() {
    let mine = [0, 0, 0, 0, 0]
    let x = this.game.G.boardx
    let y = this.game.G.boardy

    // count onBoard Mine
    for (let i = 0; i < 5; i++) {
      if (this.game.G.randomMine[i] != undefined) {
        mine[i] = this.game.G.randomMine[i];
      }
    }
    for (let i = 0; i < 10; i++) {
      if (i < 5) {
        mine[i] += this.game.G.presetPlayersMine[i] - this.game.G.playersMine[i];
      } else {
        mine[i - 5] += this.game.G.presetPlayersMine[i - 5] - this.game.G.playersMine[i];
      }
    }

    let randomWrongFlag = false
    let randomizeBoardAIMine = Array(x * y).fill(null);
    //aiMine place
    for (let i = 0; i < this.aiMine.length; i++) {
      randomizeBoardAIMine[this.aiMine[i][0]] += this.aiMine[i][1]
      mine[this.aiMine[i][1] - 1] -= 1
    }
    let randomizeBoard = randomizeBoardAIMine
    // found minable place
    /*let knownMine = Array(x * y).fill(null);
      for (let i = 0; i < knownMine.length; i++) {
        if (this.orginalCells[i] != null && this.orginalMineArray[i] != null)
          knownMine[i] = this.orginalMineArray[i];
    }
    console.log(knownMine);
    */
   let minable = Array(x * y).fill(null);
    do {
      randomWrongFlag = false
      let cells = _.cloneDeep(this.orginalCells)
      // initize randomize board
      randomizeBoard = randomizeBoardAIMine
      //random process
      for (let i = mine.length - 1; i >= 0; i--) {
        for (let j = 0; j < mine[i]; j++) {
          // minable place and it maximum value
          minable = Array(x * y).fill(null);
          for (let id = 0; id < minable.length; id++) {
            if (cells[id] >= 0 && cells[id] != null) {
              minable = this.fillMinable(id, cells[id], minable)
            }
          }
          let minableRandomID = []
          let nullArray = []
          // init the random list (adjust weighting, larger value have a largest weighting)
          for (let id = 0; id < minable.length; id++) {
            if (minable[id] >= i + 1) {
              for (let k = 0; k < minable[id]; k++) {
                // weighting higher
                for (let m = 0; m < 10; m++)
                  minableRandomID.push(id);
              }
            } else if (minable[id] == null) {
              nullArray.push(id);
            }
          }
          if (nullArray.length != 0)
            for (let k = 0; k < 2; k++)
              minableRandomID.push(-1);

          // check error (if yes loop again)
          if (minableRandomID.length == 0) {
            randomWrongFlag = true;
            break;
          }
          //random choose 1 in list
          let item = minableRandomID[Math.floor(Math.random() * minableRandomID.length)];
          if (item == -1)
            randomizeBoard[nullArray[Math.floor(Math.random() * nullArray.length)]] += 1 + 1
          else
            randomizeBoard[item] += i + 1;
          // surrounded minable value minus val
          cells = this.minusCellValue(item, i + 1, cells);
        }
        if (randomWrongFlag) {
          break;
        }
      }
      /*if (!randomWrongFlag)
        for (let i = 0; i< x*y; i++){
          if (knownMine[i] !== null) {
            if (knownMine[i] !== randomizeBoard[i]){
              randomWrongFlag = true;
              break;
            }
          }
        }*/
    } while (randomWrongFlag);
    for(let i = 0; i < x*y; i++){
      if (minable[i] == null && randomizeBoard[i] == null){
        if (Math.floor(Math.random()* 3)){
          randomizeBoard[i] = 1;
        }
      }
    }
    this.game.G.mineValue = _.cloneDeep(randomizeBoard)
    //return finish randomize board
    return;
  }

  selectMove() {
    let round, currentNode;
    var d = new Date();
    var start = d.getTime();
    var i = 0
    do {
      i += 1
      d = new Date();
      var end = d.getTime();
      //for (round = 0; round < this.rounds; round += 1) {
      currentNode = this.rootNode;
      this.rootNode.visits += 1;
      this.randomizeMine();
      while (!_.isEmpty(currentNode.getChildren())) {
        currentNode = currentNode.nextMove();
        currentNode.visits += 1;
        if (currentNode.getWinner() === 0 || currentNode.getWinner() === 1)
          break;
      }
      let winner = currentNode.getWinner();
      this.winnerarr.push(winner)
      while (currentNode) {
        currentNode.wins[winner] = (currentNode.wins[winner] || 0) + 1;
        currentNode = currentNode.parent;
      }
      //console.log(i)
    } while (end - start < this.rounds * 1000)
    var count0 = 0;
    var count1 = 0;
    for (var i = 0; i < this.winnerarr.length; ++i) {
      if (this.winnerarr[i] == 0)
        count0++;
      else
        count1++
    }
    console.log(_(this.rootNode.getChildren()).sortBy('visits').last().wins)
    console.log("loop " + i)
    console.log(this.rootNode.children.length)
    console.log(_(this.rootNode.getChildren()).sortBy('visits').last().visits)
    return _(this.rootNode.getChildren()).sortBy('visits').last().move;
  }
}
export default MCTS;
import React, { Component } from 'react';
import './GameBoard.css';
import {  LoopCircleLoading } from 'react-loadingg';
import MCTS from '../AI/MCTS'
class GameBoard extends Component {
    constructor(props){
        super(props)
        this.state = {
            aiMine:[[],[]],
            aiFirstMove:false
        }
    }
    componentDidMount(prevProps){
        if ((this.props.ai !== undefined|| this.props.bothai )&& this.props.ctx.turn == 1 && !this.props.aiFirstMove){
            if (this.isAITurn()){
                this.setState({aiFirstMove : true})
                console.log(this.props.ctx.currentPlayer)
                setTimeout(() => {
                    this.AImove()
                }, 1000);
            }
        }
    }
    componentDidUpdate(prevProps){
        if ((this.props.ai !== undefined || this.props.bothai) && prevProps.ctx.currentPlayer != this.props.ctx.currentPlayer && !this.props.G.gameover){
            if (this.isAITurn()){
                console.log(this.props.ctx.currentPlayer)
                setTimeout(() => {
                    this.AImove()
                }, 1000);
            }
        }
    }

    AImove = () => {
        console.log('AITURN')
        let mcts = new MCTS(this.props, this.state.aiMine[this.props.ctx.currentPlayer])
        var id = mcts.selectMove();
        if (id < this.props.G.mineValue.length){
            console.log("sweep "+id)
            this.props.moves.sweep(id);
        } else {
            let value = 0
            do{
                value = Math.floor(Math.random() * 5)
            }while (this.props.G.playersMine[this.props.ctx.currentPlayer * 5 + value] == 0)
            this.state.aiMine[this.props.ctx.currentPlayer].push([id- this.props.G.boardx *this.props.G.boardy,value+1])
            console.log(this.state.aiMine);
            this.props.moves.placeMine(id- this.props.G.boardx *this.props.G.boardy, value + 1);
        }
        this.props.events.endTurn();
    }

    onClick = (id, a) => {
        if (this.isActive() && this.isMyTurn()) {
            if (!this.props.G.currentMine) {
                if (this.sweepActive(id)) {
                    this.props.moves.sweep(id);
                    this.props.events.endTurn();
                } else {
                    if (this.props.G.mineValue[id] && this.props.G.cells[id] != 0) {
                        this.props.moves.changeBoardShowing(id);
                        //console.log('change');
                    }
                }
            } else {
                if (this.placeActive(id)) {
                    this.props.moves.placeMine(id);
                    this.props.events.endTurn();
                }
            }
        } else if (this.props.G.mineValue[id] && this.props.G.cells[id] != 0) {
            this.props.moves.changeBoardShowing(id);
            //console.log('change');
        }
    }
    selectMine = (value) => {
        if (this.isActive() && this.selectActive(value)) {
            this.props.moves.selectMine(value);
        }
    }

    isAITurn = () =>{
        if (this.props.bothai) return true;
        if (this.props.ai === undefined) return false
        if (this.props.ai.id == this.props.ctx.currentPlayer) return true;
        return false;
    }
    isMyTurn = () =>{
        if (this.props.playerID == this.props.ctx.currentPlayer) return true;
        return false;
    }
    isActive = () => {
        if (this.props.G.gameover) return false;
        return true;
    }
    sweepActive = (id) => {
        if (this.props.G.cells[id] || this.props.G.cells[id] == 0) return false;
        return true;
    }
    placeActive = (id) => {
        if (this.props.G.cells[id] || this.props.G.cells[id] == 0) return false;
        if ((this.props.G.cells[id - 1] || this.props.G.cells[id - 1] == 0) && (id % this.props.G.boardx != 0)) return false;
        if ((this.props.G.cells[id + 1] || this.props.G.cells[id + 1] == 0) && (id % this.props.G.boardx != this.props.G.boardx - 1)) return false;
        if ((this.props.G.cells[id + this.props.G.boardx - 1] || this.props.G.cells[id + this.props.G.boardx - 1] == 0) && (id % this.props.G.boardx != 0)) return false;
        if (this.props.G.cells[id + this.props.G.boardx] || this.props.G.cells[id + this.props.G.boardx] == 0) return false;
        if ((this.props.G.cells[id + this.props.G.boardx + 1] || this.props.G.cells[id + this.props.G.boardx + 1] == 0) && (id % this.props.G.boardx != this.props.G.boardx - 1)) return false;
        if ((this.props.G.cells[id - this.props.G.boardx - 1] || this.props.G.cells[id - this.props.G.boardx - 1] == 0) && (id % this.props.G.boardx != 0)) return false;
        if (this.props.G.cells[id - this.props.G.boardx] || this.props.G.cells[id - this.props.G.boardx] == 0) return false;
        if ((this.props.G.cells[id - this.props.G.boardx + 1] || this.props.G.cells[id - this.props.G.boardx + 1] == 0) && (id % this.props.G.boardx != this.props.G.boardx - 1)) return false;
        return true;
    }
    selectActive = (value) => {
        if (this.props.G.playersMine[value + this.props.ctx.currentPlayer * 5 - 1] == 0) return false;
        return true;
    }

    isSelected = (value) => {
        if (this.props.G.currentMine == value) return true;
        return false;
    }
    isCurrentValue = (value) => {
        if (this.props.G.currentValue[value]) return true;
        return false;
    }
    changeable = (value) => {
        if (this.props.G.mineValue[value] && this.props.G.cells[value] && this.props.G.cells[value] != 0) return true;
        return false;
    }
    render() {
        let winner = '';
        let boardStyle = "selectDisable gameBoardTable gameBoardCell";
        if (this.props.G.currentMine && this.props.ctx.currentPlayer == this.props.playerID) {
            boardStyle = boardStyle + ' gameBoardSelectedMine';
        }
        if (this.props.G.gameover) {
            winner = this.props.G.gameover.winner
        }
        let minebtns = [];
        let board = [];
        if (this.props.bothai){
            minebtns.push(
                <div key="textbtn" style={{ display: 'flex', flexDirection: 'column', paddingRight: '1rem' }} >
                    <div style={{ alignSelf: 'flex-end' }}>Mine:</div>
                    <div style={{ alignSelf: 'flex-end' }}>AI 1:</div>
                    <div style={{ alignSelf: 'flex-end' }}>AI 2:</div>
                </div>
            );
        }else{
        minebtns.push(
            <div key="textbtn" style={{ display: 'flex', flexDirection: 'column', paddingRight: '1rem' }} >
                <div style={{ alignSelf: 'flex-end' }}>Mine:</div>
                <div style={{ alignSelf: 'flex-end' }}>Remains:</div>
                <div style={{ alignSelf: 'flex-end' }}>Opponents:</div>
            </div>
        );
        }
        //btn
        for (let i = 1; i < 6; i++) {
            let mineBtnClass = null;
            if (this.isSelected(i) && this.props.ctx.currentPlayer == this.props.playerID) {
                mineBtnClass = "minebtnStyle selectPressed mineBtnActive";
            } else if (this.selectActive(i) && this.isActive(i) && !this.isAITurn() && this.props.ctx.currentPlayer == this.props.playerID) {
                mineBtnClass = "minebtnStyle mineBtnActive";
            } else {
                mineBtnClass = "minebtnStyle";
            }
            if (this.props.bothai){
                minebtns.push(
                    <div key={i} className="temp">
                        <div className={mineBtnClass}
                            key={i}
                            onClick={() => this.selectMine(i)}>
                            {i}
                        </div>
                        <div className="remainMineValue">{this.props.G.playersMine[i + 0 * 5 - 1]}</div>
                        <div className="remainMineValue">{this.props.G.playersMine[i + 1 * 5 - 1]}</div>
                    </div>
                );
            }else{
            minebtns.push(
                <div key={i} className="temp">
                    <div className={mineBtnClass}
                        key={i}
                        onClick={() => this.selectMine(i)}>
                        {i}
                    </div>
                    <div className="remainMineValue">{this.props.G.playersMine[i + this.props.playerID * 5 - 1]}</div>
                    <div className="remainMineValue">{this.props.G.playersMine[i + (1-this.props.playerID) * 5 - 1]}</div>
                </div>
            );
            }
        }
        //gameboard
        for (let i = 0; i < this.props.G.boardy; i++) {
            let cells = [];
            for (let j = 0; j < this.props.G.boardx; j++) {
                const id = i * this.props.G.boardx + j
                let idClass = null;
                let valueShow = null;
                if (this.sweepActive(id) && this.isActive(id)) {
                    idClass = "cell cellActive";
                } else {
                    idClass = "cell";
                }
                if (this.changeable(id)) {
                    idClass = idClass + " cellChangeable";
                }
                if (this.isCurrentValue(id)) {
                    valueShow = this.props.G.mineValue[id];
                    idClass = idClass + " showingMineValue";
                } else {
                    if (this.props.G.cells[id] == 0)
                        valueShow = "";
                    else
                        valueShow = this.props.G.cells[id];
                }
                cells.push(
                    <td className="gameBoardCell"
                        key={id}
                        onClick={() => this.onClick(id)}>
                        <div className={idClass}>{valueShow}</div>
                    </td>
                );
            }
            board.push(<tr key={i} className="gameBoardCell">{cells}</tr>);
        }
        //console.log(this.props);
        return (
            <div>
                <div>
                    <div style={{marginBottom:'1rem'}}>
                    { (!winner && winner !== 0) && (
                        <div>
                            <div className="flexGroup">
                                <div className="game-detailgp">
                                    <div className="game-text">{this.props.gameMetadata[0].name}</div>
                                    <div className="game-text">HP: {this.props.G.hp[0]}</div>
                                </div>
                                <div className="game-vs">VS</div>
                                <div className="game-detailgp">
                                    <div className="game-text">{this.props.gameMetadata[1].name}</div>
                                    <div className="game-text">HP: {this.props.G.hp[1]}</div>
                                </div>
                            </div>
                            { !this.props.bothai && <div className="game-text">{this.props.playerID == this.props.ctx.currentPlayer && "Your Turn"}{this.props.playerID != this.props.ctx.currentPlayer && "Opponent Turn"}</div>}
                            {this.props.bothai && <div className="game-text">{this.props.gameMetadata[this.props.ctx.currentPlayer].name} turn </div>}
                        </div>
                    )}
                    {!this.props.bothai &&
                        (winner === 0 || winner ) &&
                        <div className="subtitle">
                            {winner == this.props.playerID && "Congratulations, You Win"}
                            {winner != this.props.playerID && winner >= 0 && "Oops, You Lose"}
                        </div>
                    }
                    {this.props.bothai && (winner === 0 || winner ) &&
                        <div className="subtitle">
                            {this.props.gameMetadata[winner].name }win
                        </div>
                    }
                    </div>
                    {( this.isAITurn() && !this.props.G.gameover && <LoopCircleLoading  color="#34ffff"/>)}
                    <table id="board" className={boardStyle} style={{ margin: "0 auto" }}>
                        <tbody>{board}</tbody>
                    </table>
                </div>
                <br />
                <div className="minebtnGroups selectDisable game-text" text-align="center" style={{ display: 'flex', justifyContent: 'center' }}>{minebtns}</div>
            </div>
        )
    }
}

export default GameBoard;
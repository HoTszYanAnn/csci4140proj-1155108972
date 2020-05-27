import React, { Component } from "react";
import {Button} from "@material-ui/core";
import WaitingOpp from "./waitingOpponent.svg";
import { IconButton, withStyles }from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { FaGamepad } from "react-icons/fa";
const LargeIconButton = withStyles({
  root:{
    '& svg': {
      fontSize: 50,
      color: '#adadad'
    },
    '&:hover svg': {
      fontSize: 50,
      color: '#34ffff'
    }
  }
})(IconButton);
const ExitIconButton = withStyles({
  root:{
    '& svg': {
      fontSize: 50,
      color: '#adadad'
    },
    '&:hover svg': {
      fontSize: 50,
      color: '#ff3434'
    }
  }
})(IconButton);
const findPlayerSeat = (players, playerName) =>
  players.find(player => player.name === playerName);
const findFreeSeat = players => players.find(player => !player.name);

class StyledRoom extends Component {
  handleJoinClick = () => {
    const { roomId, players } = this.props;
    this.props.onJoin(roomId, findFreeSeat(players).id);
  };

  handleLeaveClick = () => {
    this.props.onLeave(this.props.roomId);
  };

  handlePlayClick = () => {
    const { roomId, players, playerName } = this.props;
    this.props.onPlay(
      roomId,
      `${findPlayerSeat(players, playerName).id}`,
      players.length
    );
  };

  handleSpectateClick = () => {
    const { roomId, players } = this.props;
    this.props.onSpectate(roomId, players.length);
  };

  render() {
    const { name, playerName, players } = this.props;
    const playerSeat = findPlayerSeat(players, playerName);
    const freeSeat = findFreeSeat(players);
    if (freeSeat){
      return (
        <div className="center flexGroup">
          <object type="image/svg+xml" data={WaitingOpp} />
            <LargeIconButton onClick={this.handleLeaveClick}>
              <ExitToAppIcon />
            </LargeIconButton>
        </div>
        
      )
    }else{
      return (
        <div className="center">
          <div className="title">Minesweeper Battle</div>
          <div className="loginGroup">
            <div className="subtitle">{players[0].name} <span style={{color:'#ff3434'}}>VS</span> {players[1].name}</div>
            <div style={{marginLeft: '1rem'}}>
            <LargeIconButton variant="outlined" onClick={this.handlePlayClick}>
              <FaGamepad />
            </LargeIconButton>
            </div>
            <div>
            <ExitIconButton variant="outlined" onClick={this.handleLeaveClick}>
              <ExitToAppIcon />
            </ExitIconButton>
            </div>
            </div>
      </div>
      );
    }
  }
}

export default StyledRoom;
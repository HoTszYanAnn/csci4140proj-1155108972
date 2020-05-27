import React, { Component, Fragment } from "react";
import { Button } from "@material-ui/core";
import Error from "../../Error";
import OnlineLogin from "../OnlineLogin";
import OnlineRoom from "../OnlineRoom";
import OnlineExit from "../OnlineExit";
import LoadingPage from "../../LoadingPage";
import RefreshIcon from '@material-ui/icons/Refresh';
import "./onlinelobby.css";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IconButton, withStyles } from "@material-ui/core";
import { Link as RouterLink } from 'react-router-dom';

const selectGameName = props => props.gameComponents[0].game.name;

const LargeIconButton = withStyles({
  root: {
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
const TTTIconButton = LargeIconButton;
const selectAllPlayersNames = props => {
  const playersNames = [];
  if (!Array.isArray(props.gameInstances)) {
    return playersNames;
  }

  props.gameInstances.forEach(gameInstance => {
    gameInstance.players.forEach(player => {
      if (player.name) {
        playersNames.push(player.name);
      }
    });
  });

  return playersNames;
};

class OnlineLobby extends Component {
  constructor(props) {
    super(props);
    this.state = { join: 0,
      justleave: 0,
    }
  }
  componentDidMount() {
    // Refresh all rooms every 15 seconds
    setInterval(this.handleRefreshRoomsClick, 15000);
    if (!this.props.gameInstances[0]) {
      this.handleCreateRoomClick();
    }
  }

  handleLoginClick = name => {
    this.props.onEnterLobby(name);
  };

  findCurrentPlayerGame = () => {
    const { gameInstances, playerName } = this.props;
    return gameInstances.filter(gameInstance =>
      gameInstance.players.some(player => player.name === playerName)
    );
  }
     reload() {
      window.location.reload();
    }
  handleLogoutClick = () => {
    const currentPlayerGames = this.findCurrentPlayerGame();
    currentPlayerGames.forEach(game => this.handleLeaveRoomClick(game.gameID));
    this.props.onExitLobby();
  };

  handleCreateRoomClick = () => {
    this.props.onCreateRoom(selectGameName(this.props), 2);
  };

  handleRefreshRoomsClick = () => {
    this.props.onRefreshRooms();
  };

  handleJoinRoomClick = (gameId, playerId) => {
    this.props.onJoinRoom(selectGameName(this.props), gameId, playerId);
  };

  handleLeaveRoomClick = gameId => {
    this.props.onLeaveRoom(selectGameName(this.props), gameId);
  };

  handlePlayClick = (gameId, playerId, numPlayers) => {
    this.props.onStartGame(selectGameName(this.props), {
      gameID: gameId,
      playerID: playerId,
      numPlayers
    });
  };

  handleSpectateClick = (gameId, numPlayers) => {
    this.props.onStartGame(selectGameName(this.props), {
      gameID: gameId,
      numPlayers
    });
  };

  handleExitRoomClick = () => {
    this.props.onExitRoom();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.gameInstances !== this.props.gameInstances && this.state.join) {
      this.autoJoin();
      this.state.join = 0;
    }
  }

  findFreeSeat = players => players.find(player => !player.name);

  autoJoin = () => {
    let i = 0;
    let create = 1;
    while (this.props.gameInstances[i]) {
      console.log(this.props.gameInstances[i].players);
      if (this.findFreeSeat(this.props.gameInstances[i].players)) {
        create = 0;
        console.log(this.findFreeSeat(this.props.gameInstances[i].players).id);
        console.log(this.props.gameInstances[i].gameID);
        this.handleJoinRoomClick(this.props.gameInstances[i].gameID, this.findFreeSeat(this.props.gameInstances[i].players).id);
        return;
      }
      i++;
    }
    if (create) {
      this.handleCreateRoomClick();
      this.state.join = 1;
    }
  };

  exitAndLeaveRoom = () =>{
    this.state.justleave = 1;
    this.handleExitRoomClick();
    this.handleLeaveRoomClick(this.props.runningGame.gameID);
  }

  render() {
    const {
      errorMsg,
      phase,
      playerName,
      gameInstances,
      runningGame
    } = this.props;

    if (errorMsg) {
      return (
        <div>
          error: {errorMsg}
          <LargeIconButton onClick={this.reload}> <RefreshIcon/></LargeIconButton>
        </div>
      );
    }
    console.log(this.props);
    console.log(phase);
    if (phase === "enter") {
      
      return (
        <OnlineLogin
          playerName={playerName}
          playersNames={selectAllPlayersNames(this.props)}
          onLogin={this.handleLoginClick}
        />
      );
    }
    console.log(gameInstances);
    console.log(this.findCurrentPlayerGame()[0]);
   /* if (phase === "list" && (!gameInstances[0]) ) {
      return <LoadingPage />;
    }*/
    if (phase === "list" && gameInstances[0] ) {
      if (this.findCurrentPlayerGame()[0] && (!this.state.justleave)) {
        return (
          <OnlineRoom
            key={this.findCurrentPlayerGame()[0].gameID}
            name={`Territories ${this.findCurrentPlayerGame()[0].gameID.substring(0, 3)}`}
            roomId={this.findCurrentPlayerGame()[0].gameID}
            players={this.findCurrentPlayerGame()[0].players}
            playerName={playerName}
            alreadyJoined={selectAllPlayersNames(this.props).includes(
              playerName
            )}
            onJoin={this.handleJoinRoomClick}
            onLeave={this.handleLeaveRoomClick}
            onPlay={this.handlePlayClick}
            onSpectate={this.handleSpectateClick}
          />
        );
      } else {
        this.state.justleave = 0;
        return (
          <div className="center">
            <OnlineExit
              exitButtonLabel="logout"
              playerName={playerName}
              onExit={this.handleLogoutClick}
            />
            <div className="margin"><Button className="button" onClick={this.autoJoin}>START Pairing</Button></div>
          </div>
        )
      }
    }  
    if (phase === "play") {
      return (
        <div className="center">
          <div className="flexGroup">
          <div className="titleSmaller">MineSweeper Battle</div>
              <TTTIconButton onClick={this.exitAndLeaveRoom}>
                <ExitToAppIcon />
              </TTTIconButton>
          </div>
          {runningGame && (
            <runningGame.app
              gameID={runningGame.gameID}
              playerID={runningGame.playerID}
              credentials={runningGame.credentials}
            />
          )}
        </div>
      );
    }
    return (
      <div>
        <LoadingPage/>
      </div>
    );
  }
}

export default OnlineLobby;
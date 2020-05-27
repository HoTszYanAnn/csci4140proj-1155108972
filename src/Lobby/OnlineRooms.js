import React, { Component, Fragment } from "react";

import {Card} from "@material-ui/core";
import {CardContent} from "@material-ui/core";
import {CardHeader} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import {IconButton} from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import OnlineRoom from "./OnlineRoom";
import {Tooltip} from "@material-ui/core";

class OnlineRooms extends Component {
  handleCreateRoomClick = () => {
    this.props.onCreate();
  };

  handleRefreshRooms = () => {
    this.props.onRefresh();
  };

  handleJoinRoomClick = (gameId, playerId) => {
    this.props.onJoin(gameId, playerId);
  };

  handleLeaveRoomClick = gameId => {
    this.props.onLeave(gameId);
  };

  handlePlayClick = (gameId, playerId, numPlayers) => {
    this.props.onPlay(gameId, playerId, numPlayers);
  };

  handleSpectateClick = (gameId, numPlayers) => {
    this.props.onSpectate(gameId, numPlayers);
  };

  render() {
    const { gameInstances, playerName, alreadyJoined } = this.props;
    return (
      <div>
        <Card>
          <CardHeader
            title="roomstitle"
            subheader="subtitle"
            action={
              <Fragment>
                <Tooltip title="newroom">
                  <IconButton
                    color="primary"
                    onClick={this.handleCreateRoomClick}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="refresh">
                  <IconButton color="primary" onClick={this.handleRefreshRooms}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Fragment>
            }
          />
          <CardContent>
              <OnlineRoom
                key={gameInstances[0].gameID}
                name={`Territories ${gameInstances[0].gameID.substring(0, 3)}`}
                roomId={gameInstances[0].gameID}
                players={gameInstances[0].players}
                playerName={playerName}
                alreadyJoined={alreadyJoined}
                onJoin={this.handleJoinRoomClick}
                onLeave={this.handleLeaveRoomClick}
                onPlay={this.handlePlayClick}
                onSpectate={this.handleSpectateClick}
              />
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default OnlineRooms;
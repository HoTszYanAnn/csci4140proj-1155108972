import React from "react";
import Game from "../MineSweeper/Minesweeper";
import { Lobby } from "boardgame.io/react";

import LoadingPage from "../LoadingPage";

import OnlineLobby from "../Lobby/OnlineLobby";
import Board from "../MineSweeper/GameBoard";


const url = process.env.REACT_APP_SERVER_URL
const OnlineLobbyPage = () => (
  <Lobby
    gameServer={url}
    lobbyServer={url}
    gameComponents={[
      {
        game: Game,
        board: Board
      }
    ]}
    renderer={({
      errorMsg,
      lobbyServer,
      gameComponents,
      rooms,
      phase,
      playerName,
      runningGame,
      handleEnterLobby,
      handleExitLobby,
      handleCreateRoom,
      handleJoinRoom,
      handleLeaveRoom,
      handleExitRoom,
      handleRefreshRooms,
      handleStartGame
    }) => (
      <OnlineLobby
        server={lobbyServer}
        errorMsg={errorMsg}
        gameComponents={gameComponents}
        gameInstances={rooms}
        phase={phase}
        playerName={playerName}
        runningGame={runningGame}
        onEnterLobby={handleEnterLobby}
        onExitLobby={handleExitLobby}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={handleLeaveRoom}
        onExitRoom={handleExitRoom}
        onRefreshRooms={handleRefreshRooms}
        onStartGame={handleStartGame}
      />
    )}
  />
);

export default OnlineLobbyPage;
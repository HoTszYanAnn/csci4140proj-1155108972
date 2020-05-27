import React from 'react';
import Game from './MineSweeper/Minesweeper';
import Board from './MineSweeper/GameBoard';
import { Lobby } from 'boardgame.io/react';

function LobbyPage() {
  return (
    <div>
      <Lobby
        gameServer={'https://csci4140proj-1155108972-server.herokuapp.com'}
        lobbyServer={'https://csci4140proj-1155108972-server.herokuapp.com'}
        gameComponents={[{ game: Game, board: Board }]}
      />
    </div>
  );
}

export default LobbyPage;

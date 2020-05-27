import React from 'react';
import { Client } from 'boardgame.io/react';
import GameBoard from './GameBoard';
import Minesweeper from './Minesweeper';
import { SocketIO } from 'boardgame.io/multiplayer'
import LoadingPage from '../LoadingPage';

const SweepClient = Client({
    name: 'minesweeper',
    game: Minesweeper,
    loading: () => <LoadingPage/>,
    numPlayers: 2,
    board: GameBoard,
    debug: true
});

export default SweepClient;
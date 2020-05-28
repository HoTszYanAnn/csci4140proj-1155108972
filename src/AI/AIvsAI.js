import React from 'react';
import { Client } from 'boardgame.io/react';
import GameBoard from '../MineSweeper/GameBoard'
import Minesweeper from '../MineSweeper/Minesweeper'
import LoadingPage from '../LoadingPage';


let gameMetadata = [{id: 0, name: "AI 1"}, {id: 1, name: "AI 2"}]
const AIvsAI = Client({
  game: Minesweeper,
  loading: () => <LoadingPage/>,
  board: ({ G, ctx, moves, events, isActive }) => (
    <GameBoard
      bothai={true}
      G={G}
      ai={{time: 30}}
      ctx={ctx}
      moves={moves}
      events={events}
      isActive={isActive}
      gameMetadata={gameMetadata}
    />
  ),
  debug: false
});

export default AIvsAI;
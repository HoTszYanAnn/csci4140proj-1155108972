import React from 'react';
import { Client } from 'boardgame.io/react';
import GameBoard from '../MineSweeper/GameBoard'
import Minesweeper from '../MineSweeper/Minesweeper'
import LoadingPage from '../LoadingPage';


const aiplayer = Math.floor(Math.random() * 2)
let gameMetadata = []

if (aiplayer == 0){
  gameMetadata = [{id: 0, name: "AI Normal"}, {id: 1, name: "you"}]
}else{
  gameMetadata = [{id: 0, name: "you"}, {id: 1, name: "AI Normal"}]
}
const AINormal = Client({
  game: Minesweeper,
  loading: () => <LoadingPage/>,
  board: ({ G, ctx, moves, events, isActive }) => (
    <GameBoard
      playerID={1-aiplayer}
      ai={{id:aiplayer, time: 20}}
      G={G}
      ctx={ctx}
      moves={moves}
      events={events}
      isActive={isActive}
      gameMetadata={gameMetadata}
    />
  ),
  debug: false
});

export default AINormal;
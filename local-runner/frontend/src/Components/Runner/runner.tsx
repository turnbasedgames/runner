/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useEffect, useRef, useState,
} from 'react';
import { ObjectID } from 'bson';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { connectToChild } from 'penpal';
import { onRoomStart, onPlayerJoin, onPlayerMove } from '../../backend';

interface BoardGame {
  state: Record<string, any>,
  joinable: boolean,
  finished: boolean,
  players: string[]
}

let boardGame: BoardGame = {
  state: {},
  joinable: true,
  finished: false,
  players: [],
};

let currentPlayerID = '';

function Runner() {
  const [boardGame2, setBoardGame2] = useState<BoardGame>({
    state: {},
    joinable: true,
    finished: false,
    players: [],
  });
  const [createdPlayers, setCreatedPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [childClient, setChildClient] = useState<any | null>(null);

  const startRoom = () => {
    boardGame = { ...boardGame, ...onRoomStart() };
  };

  const joinPlayer = () => {
    const newBoardGameState = ({
      ...boardGame,
      players: [...boardGame.players, currentPlayer],
    });
    if (currentPlayer) {
      boardGame = {
        ...newBoardGameState,
        ...onPlayerJoin(currentPlayer, newBoardGameState),
      };
    }
  };

  const handleSelect = (event: SelectChangeEvent) => {
    currentPlayerID = (event.target as HTMLInputElement).value;
    setCurrentPlayer(currentPlayerID);
  };

  const createPlayer = () => {
    const newPlayer = new ObjectID().toString();
    setCreatedPlayers([...createdPlayers, newPlayer]);
  };

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (childClient && Object.keys(boardGame2.state).length !== 0) {
      childClient.stateChanged(boardGame2);
    }
  }, [childClient, boardGame2]);

  useEffect(() => {
    if (iframeRef.current) {
      // eslint-disable-next-line no-param-reassign
      iframeRef.current.src = 'http://localhost:3000';
      const connection = connectToChild({
        iframe: iframeRef.current,
        methods: {
          async makeMove(move: any) {
            try {
              const newState = onPlayerMove(currentPlayerID, move, boardGame);
              boardGame = { ...boardGame, ...newState };
              setBoardGame2(boardGame);
              return { success: true };
            } catch (err) {
              console.log(err);
              return { success: false };
            }
          },
        },
      });
      connection.promise.then((child) => {
        setChildClient(child);
      });
    }
  }, []);

  return (
    <div className="App">
      <iframe
        ref={iframeRef}
        title="gameFrame"
        sandbox="allow-scripts allow-forms allow-same-origin"
        id="gameFrame"
        style={{ width: '100%', border: 'none' }}
      />
      <button type="button" onClick={startRoom}>Start Room</button>
      {/* <button type="button" onClick={makeMove}>Make Move</button> */}
      <button type="button" onClick={joinPlayer}>Join Player</button>
      <Select value={currentPlayer} label="Current Player" onChange={handleSelect}>
        {createdPlayers.map((player) => (
          <MenuItem
            value={player}
            key={player}
          >
            {player}
          </MenuItem>
        ))}
      </Select>
      <button type="button" onClick={createPlayer}>+</button>
    </div>
  );
}

export default Runner;

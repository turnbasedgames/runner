/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useEffect, useRef, useState,
} from 'react';
import { MenuItem, Select } from '@mui/material';
import { connectToChild } from 'penpal';
import axios from 'axios';
import { io } from 'socket.io-client';
import { onRoomStart, onPlayerJoin, onPlayerMove } from '../../backend';

const socket = io('http://localhost:8080', { transports: ['websocket'] });

interface BoardGame {
  state: Record<string, any>,
  joinable: boolean,
  finished: boolean,
  players: string[],
  version: number
}

const initialBoardGameState: BoardGame = {
  state: {},
  joinable: true,
  finished: false,
  players: [],
  version: 0,
};

let boardGame = initialBoardGameState;

let currentPlayerID = '';

function Runner() {
  const [createdPlayers, setCreatedPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [childClient, setChildClient] = useState<any | null>(null);

  const getCurrentState = async () => {
    const res = await axios.get('/api/');
    return res.data as BoardGame;
  };

  const setCurrentState = async (state: BoardGame) => {
    await axios.post('/api/', state);
    if (childClient) childClient.stateChanged(state);
  };

  useEffect(() => {
    const setLatestStateWithContender = async (contender: BoardGame) => {
      console.log('IN LATEST, CONTENDER: ', contender);
      console.log('CHILD CLIENT: ', childClient);
      if (childClient) {
        console.log('UPDATING CHILD STATE');
        childClient.stateChanged(contender);
      } else boardGame = contender;

      if (contender.version === 0) {
        await setCurrentState({ ...contender, ...onRoomStart() });
      } else { setCreatedPlayers(contender.players); }
    };

    async function setupRoomSocket() {
      socket.on('room:latestState', setLatestStateWithContender);
    }

    setupRoomSocket();
    // return () => {
    //   socket.emit('unwatchRoom', { roomId }, (res: null | UnwatchRoomRes) => {
    //     if (res) {
    //       console.error('error trying to unwatch room', res.error);
    //     }
    //   });
    //   socket.off('room:latestState', setLatestStateWithContender);
    // };
  }, [childClient]);

  const resetGame = async () => {
    await setCurrentState({ ...initialBoardGameState, ...onRoomStart() });
  };

  const changePlayer = (ID: string) => {
    setCurrentPlayer(ID);
    currentPlayerID = ID;
  };

  const joinNewPlayer = async () => {
    const newPlayer = (createdPlayers.length + 1).toString();
    await setCreatedPlayers([...createdPlayers, newPlayer]);
    await changePlayer(newPlayer);

    const state = await getCurrentState();
    state.players = [...state.players, newPlayer];
    const newState = { ...state, ...onPlayerJoin(newPlayer, state) };

    await setCurrentState(newState);
  };

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (iframeRef.current) {
      console.log('IN IFRAME CURRENT');
      // eslint-disable-next-line no-param-reassign
      iframeRef.current.src = 'http://localhost:3000';
      const connection = connectToChild({
        iframe: iframeRef.current,
        methods: {
          async makeMove(move: any) {
            try {
              console.log('IN MAKEMOVE');
              const currentState = await getCurrentState();
              const newState = onPlayerMove(currentPlayerID, move, currentState);
              await setCurrentState({ ...currentState, ...newState });

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
      {/* <button type="button" onClick={makeMove}>Make Move</button> */}
      <button type="button" onClick={joinNewPlayer}>Join New Player</button>
      <Select value={currentPlayer} label="Current Player" onChange={(e) => changePlayer(e.target.value)}>
        {createdPlayers.map((player) => (
          <MenuItem
            value={player}
            key={player}
          >
            {player}
          </MenuItem>
        ))}
      </Select>
      <button type="button" onClick={resetGame}>RESET</button>
    </div>
  );
}

export default Runner;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import { ObjectID } from 'bson';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { AsyncMethodReturns, CallSender, connectToChild } from 'penpal';
import { onRoomStart, onPlayerJoin, onPlayerMove } from '../../backend';

interface BoardGame {
  state: Record<string, any>,
  joinable: boolean,
  finished: boolean,
  players: string[]
}

function Runner() {
  const [boardGame, setBoardGame] = useState<BoardGame>({
    state: {},
    joinable: true,
    finished: false,
    players: [],
  });

  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [childClient, setChildClient] = useState<any | null>(null);

  const startRoom = () => {
    setBoardGame({ ...boardGame, ...onRoomStart() });
  };

  const joinPlayer = () => {
    if (currentPlayer) setBoardGame({ ...boardGame, ...onPlayerJoin(currentPlayer, boardGame) });
  };

  const makeMove = () => {
    console.log('MAKIng move foR: ', currentPlayer);
    console.log('STATE::: ', boardGame);
    // if (currentPlayer) onPlayerMove(currentPlayer, 'a', boardGame);
    // else throw Error('No player - make player');
  };

  const handleSelect = (event: SelectChangeEvent) => {
    setCurrentPlayer((event.target as HTMLInputElement).value);
  };

  const createPlayer = () => {
    const newPlayer = new ObjectID().toString();
    setBoardGame({ ...boardGame, players: [...boardGame.players, newPlayer] });
  };

  const iframeRef = useCallback((iframe: HTMLIFrameElement | null) => {
    if (iframe) {
      // eslint-disable-next-line no-param-reassign
      iframe.src = 'http://localhost:3000';
      const connection = connectToChild({
        iframe,
        methods: {
          async makeMove(move: any) {
            try {
              const newBoardGame = await onPlayerMove(currentPlayer, move, boardGame);
              setBoardGame({ ...boardGame, ...newBoardGame });
              if (childClient) childClient.stateChanged(boardGame);
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
  }, [boardGame, currentPlayer]);

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
      <button type="button" onClick={makeMove}>Make Move</button>
      <button type="button" onClick={joinPlayer}>Join Player</button>
      <Select value={currentPlayer} label="Current Player" onChange={handleSelect}>
        {boardGame.players.map((player) => <MenuItem value={player}>{player}</MenuItem>)}
      </Select>
      <button type="button" onClick={createPlayer}>+</button>
    </div>
  );
}

export default Runner;

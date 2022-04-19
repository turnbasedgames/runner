import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Stack, Button, IconButton, Paper,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ReactJson from 'react-json-view';
import {
  addPlayer, getState, resetState, removePlayer,
} from '../data';

function GameManager() {
  const [gameState, setGameState] = useState(null);
  const { players = [] } = gameState || {};
  async function reloadGameState() {
    const state = await getState();
    setGameState(state);
  }
  useEffect(() => {
    reloadGameState();
  }, []);
  let playerTitle = 'No Players!';
  if (players.length === 1) {
    playerTitle = '1 Player';
  } else if (players.length > 1) {
    playerTitle = `${players.length} Players`;
  }
  return (
    <Stack height="50%">
      <AppBar position="relative">
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
          <Typography color="text.primary">
            Current Game State
          </Typography>
          <Stack spacing={1} direction="row">
            <Button
              size="small"
              variant="outlined"
              onClick={async () => {
                await addPlayer();
                await reloadGameState();
                // TODO: open new tab as the player
              }}
            >
              Add Player
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={async () => {
                await resetState();
                await reloadGameState();
              }}
            >
              Restart Game
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Stack direction="row" spacing={1} sx={{ minHeight: 0, flexGrow: 1 }}>
        <Stack
          sx={{ padding: 1, flexGrow: 1, minWidth: 0 }}
          direction="row"
          spacing={1}
        >
          <Paper sx={{
            padding: 1,
            flexGrow: 1,
            overflow: 'auto',
          }}
          >
            <ReactJson
              name={false}
              theme="twilight"
              src={gameState}
            />
          </Paper>
          <Paper sx={{
            padding: 1,
            minWidth: '120px',
            overflow: 'auto',
          }}
          >
            <Stack>
              <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.primary" sx={{ fontWeight: 'bold' }}>
                  {playerTitle}
                </Typography>
              </Stack>
              {players.map((player) => (
                // TODO: open player in new tab if click on the player
                <Stack key={player} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography color="text.primary">{player}</Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={async () => {
                      await removePlayer(player);
                      await reloadGameState();
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default GameManager;

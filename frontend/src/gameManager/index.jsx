import React from 'react';
import {
  AppBar, Toolbar, Typography, Stack, Button,
} from '@mui/material';
import ReactJson from 'react-json-view';

function GameManager() {
  const curGameState = {
    msg: 'TODO: this is the current game state',
  };
  return (
    <Stack height="50%">
      <AppBar position="relative">
        <Toolbar variant="dense">
          <Typography color="text.primary">
            Game Manager
          </Typography>
        </Toolbar>

      </AppBar>
      <Stack direction="row" margin={2} spacing={3} sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Button size="small" variant="outlined">Add New Player</Button>
          <Button size="small" variant="outlined">Remove Player</Button>
          <Button size="small" variant="outlined">Restart Game</Button>
        </Stack>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography color="text.primary">
            Current Game State
          </Typography>
          <ReactJson
            style={{
              flexGrow: 1,
              padding: '10px',
              borderRadius: '3px',
              margin: '10px 0px',
            }}
            name={false}
            theme="twilight"
            src={curGameState}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default GameManager;

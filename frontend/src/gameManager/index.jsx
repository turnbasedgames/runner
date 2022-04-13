import React from 'react';
import {
  AppBar, Toolbar, Typography, Stack,
} from '@mui/material';

function GameManager() {
  return (
    <Stack height="50%">
      <AppBar position="relative">
        <Toolbar variant="dense">
          <Typography color="text.primary">
            Game Manager
          </Typography>
        </Toolbar>

      </AppBar>
      <Typography color="text.primary">
        game manager body
      </Typography>
    </Stack>
  );
}

export default GameManager;

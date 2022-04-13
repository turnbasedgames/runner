import React from 'react';
import {
  AppBar, Toolbar, Typography, Stack,
} from '@mui/material';

function Timeline() {
  return (
    <Stack height="50%">
      <AppBar position="relative">
        <Toolbar variant="dense">
          <Typography color="text.primary">
            Timeline
          </Typography>
        </Toolbar>
      </AppBar>
      <Typography color="text.primary">
        lol timeline
      </Typography>
    </Stack>
  );
}

export default Timeline;

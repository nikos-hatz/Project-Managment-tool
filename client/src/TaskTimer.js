import React, { useState, useEffect } from "react";
import { IconButton, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import { doc, updateDoc, increment  } from "firebase/firestore";
import { db } from "./firebase";
import { useTimer } from "./TimerContext"


const TaskTimer = ({ taskId, taskName }) => {
  const { isRunning, elapsedTime, formatTime, startTimer, pauseTimer, stopTimer } = useTimer();
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
      <Stack spacing={1} alignItems="center" sx={{ padding: 1, borderRadius: 2, border: "1px solid #ddd", width: "150px" }}>
        {isRunning && <Typography variant="subtitle1" >Now working on :{taskName}</Typography>}
          <Typography variant="subtitle1">{formatTime(elapsedTime)}</Typography>
          <Stack direction="row" spacing={1}>
              <IconButton onClick={() => startTimer(taskId)} disabled={isRunning} color="primary">
                  <PlayArrowIcon />
              </IconButton>
              <IconButton onClick={pauseTimer} disabled={!isRunning} color="warning">
                  <PauseIcon />
              </IconButton>
              <IconButton onClick={() => {
                pauseTimer();
                setOpenConfirm(true);
                 }} color="error">
                  <StopIcon />
              </IconButton>
          </Stack>
          <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
              <DialogTitle>Confirm Stop</DialogTitle>
              <DialogContent>Are you sure you want to stop the timer?</DialogContent>
              <DialogActions>
                  <Button onClick={() => setOpenConfirm(false)} color="secondary">Cancel</Button>
                  <Button onClick={async () => { await stopTimer();setOpenConfirm(false);}} color="primary">Confirm</Button>
              </DialogActions>
          </Dialog>
      </Stack>
  );
};
export default TaskTimer;

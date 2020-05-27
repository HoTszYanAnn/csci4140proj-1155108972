import React from "react";

import { Grid } from "@material-ui/core";
import { IconButton, withStyles }from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const LargeIconButton = withStyles({
  root:{
    '& svg': {
      fontSize: 50,
      color: '#adadad'
    },
    '&:hover svg': {
      fontSize: 50,
      color: '#ff3434'
    }
  }
})(IconButton);

const OnlineExit = ({ exitButtonLabel, playerName, onExit }) => (
  <div>
    <div className="title">Minesweeper Battle</div>
    <div className="flexGroup">
    <div className="subtitle">Welcome, { playerName }</div>
      <div>
          <LargeIconButton onClick={onExit}>
            <ExitToAppIcon />
          </LargeIconButton>
      </div>
    </div>
  </div>
);

export default OnlineExit;
import React from 'react';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import PublicIcon from '@material-ui/icons/Public';
import { AiOutlineRobot } from "react-icons/ai";
import './home.css';

function HomePage() {
  return (
    <div className="center">
      <div className="title">Minesweeper Battle</div>
      <div className="margin"><Button className="button" startIcon={<PublicIcon />} component={RouterLink} to="/online">Online Battle</Button></div>
      <div className="margin"><Button className="button" startIcon={<AiOutlineRobot/>} component={RouterLink} to="/ai">AI Battle</Button></div>
    </div>
  );
}

export default HomePage;

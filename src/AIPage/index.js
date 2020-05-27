import React from 'react';
import LoadingPage from '../LoadingPage';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton } from "@material-ui/core";
import { TiArrowBackOutline } from "react-icons/ti"
import AIEasy from '../AI/AIEasy'
import AINormal from '../AI/AINormal'
import AIHard from '../AI/AIHard'
import AIvsAI from '../AI/AIvsAI'
import './aipage.css';

const ExitIconButton = withStyles({
  root: {
    '& svg': {
      fontSize: 75,
      color: '#adadad'
    },
    '&:hover svg': {
      fontSize: 75,
      color: '#ff3434'
    }
  }
})(IconButton);
class AIPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      level: 0,
    }
    this.toLevel = this.toLevel.bind(this)
  }


  toLevel(val) {
    this.setState({ level: val })
  }

  render() {
    console.log(this.level)
    if (this.state.level == 1) {
      return (
        <div className="center" >
          <div className="flexGroup">
            <div className="subtitle">Minesweeper Battle</div>
            <div>
            </div>

            <ExitIconButton onClick={() => this.toLevel(0)}> <TiArrowBackOutline /></ExitIconButton>
          </div>
          <AIEasy />
        </div>
      )
    }
    else if (this.state.level == 2) {
      return (
        <div className="center" >
          <div className="flexGroup">
            <div className="subtitle">Minesweeper Battle</div>
            <div>
              <ExitIconButton onClick={() => this.toLevel(0)}> <TiArrowBackOutline /></ExitIconButton>
            </div>
          </div>

          <AINormal />
        </div>
      )
    }
    else if (this.state.level == 3) {
      return (
        <div className="center" >
          <div className="flexGroup">
            <div className="subtitle">Minesweeper Battle</div>
            <div>
              <ExitIconButton onClick={() => this.toLevel(0)}> <TiArrowBackOutline /></ExitIconButton>
            </div>
          </div>

          <AIHard />
        </div>
      )
    }else if (this.state.level == 4) {
      return (
        <div className="center" >
          <div className="flexGroup">
            <div className="subtitle">Minesweeper Battle</div>
            <div>
              <ExitIconButton onClick={() => this.toLevel(0)}> <TiArrowBackOutline /></ExitIconButton>
            </div>
          </div>

          <AIvsAI />
        </div>
      )
    } else {
      return (
        <div className="center" >
          <div className="title">Minesweeper Battle</div>
          <div className="flexGroup">
            <div className="subtitle">Battle VS AI</div>
            <div>
              <ExitIconButton component={RouterLink} to="/"> <TiArrowBackOutline /></ExitIconButton>
            </div>
          </div>
          <div className="margin"><Button className="button" onClick={() => this.toLevel(1)}>Easy</Button></div>
          <div className="margin"><Button className="button" onClick={() => this.toLevel(2)}>Normal</Button></div>
          <div className="margin"><Button className="button" onClick={() => this.toLevel(3)}>Hard</Button></div>
          <div className="margin"><Button className="button" onClick={() => this.toLevel(4)}>AIvsAI</Button></div>
        </div >
      )
    }
  }
}

export default AIPage;

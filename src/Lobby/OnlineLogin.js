import React, { Component } from "react";
import {
  withStyles,
} from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton } from "@material-ui/core";
import { TiArrowBackOutline } from "react-icons/ti"
import CheckIcon from '@material-ui/icons/Check';
import { Grid, TextField } from "@material-ui/core";

const UsernameField = withStyles({
  root: {
    '& .MuiInputLabel-outlined': {
      transform: 'translate(20px, 12px) scale(3)',
      color: '#adadad',
      '&.Mui-error ': {
        color: 'red',
      },
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -12px) scale(1.5)',
      '&.Mui-focused ': {
        color: '#34ffff',
      },
      '&.Mui-error ': {
        color: 'red',
      },
    },
    '&:hover .MuiInputLabel-outlined': {
      color: '#34ffff',
      '&.Mui-error ': {
        color: 'red',
      },
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#adadad',
        '& span': {
          '& legend': {
            color: 'white',
          }
        }
      },
      '&:hover fieldset': {
        borderColor: '#34ffff',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#34ffff',
      },
      '&.Mui-error fieldset': {
        borderColor: 'red',
      },

      color: 'white',
      fontSize: '2rem',
    },
  },
})(TextField);

const LargeIconButton = withStyles({
  root: {
    '& svg': {
      fontSize: 75,
      color: '#adadad'
    },
    '&:hover svg': {
      fontSize: 75,
      color: '#34ffff'
    }
  }
})(IconButton);
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

class OnlineLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changingPlayerName: props.playerName
    };
  }

  handlePlayerNameChange = ({ target: { value } }) => {
    this.setState({ changingPlayerName: value });
  };

  handleLogin = () => {
    // TODO add user to AUTH server
    this.props.onLogin(this.state.changingPlayerName);
  };

  getErrorMessage = (changingPlayerName, playersNames) => {
    if (!changingPlayerName) {
      return "Player name cannot be empty";
    }
    if (!/^\w+$/.test(changingPlayerName)) {
      return "Invalid characters exist";
    }
    if (changingPlayerName.length > 15) {
      return "Too Long! Max length is 15";
    }
    // TODO load players names from AUTH server
    if (playersNames.includes(changingPlayerName)) {
      return "Player name is existed";
    }
    return " ";
  };

  getError = (message) => {
    if (message === " ") return false;
    return true;
  }

  render() {
    const { changingPlayerName } = this.state;
    const { playersNames } = this.props;

    const errorMessage = this.getErrorMessage(changingPlayerName, playersNames);
    const hasError = this.getError(errorMessage);

    return (
      <div className="center">
        <div className="title">Minesweeper Battle</div>
        <div className="subtitle">Online Battle</div>
        <div className="loginGroup">
          <div >
            <UsernameField label="Enter Your Name" error={hasError} helperText={errorMessage} margin="normal"
              value={changingPlayerName}
              variant="outlined"
              inputProps={{ min: 0, style: { textAlign: 'center' } }}
              onKeyPress={({ key }) =>
                !hasError && key === "Enter" && this.handleLogin()
              }
              onChange={this.handlePlayerNameChange}
            />
          </div>
          <div>
            <LargeIconButton disabled={hasError} onClick={this.handleLogin} > <CheckIcon /></LargeIconButton>
          </div>
          <div>
            <ExitIconButton disabled={hasError} component={RouterLink} to="/"> <TiArrowBackOutline /></ExitIconButton>
          </div>
        </div>
      </div>
    );
  }
}

export default OnlineLogin;
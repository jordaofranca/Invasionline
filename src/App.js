import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LoginTemplate from './layout/LoginTemplate';
import AppTemplate from './layout/AppTemplate';
import Dashboard from './components/Dashboard';
import Camera from './components/Camera';
import Rank from './components/Rank';
import Clues from './components/Clues';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import About from './components/About';
import { hashHistory, Router, Route, IndexRedirect } from 'react-router'
import 'flexboxgrid';

import './App.css';


injectTapEventPlugin();

const checkAuth = (nextState, replace, cb) => {
  let authUser = JSON.parse(sessionStorage.getItem("invasionlineUser"));
  switch (nextState.location.pathname) {
    case "login":
    case "signup":
      if (authUser) {
        replace("dashboard");
      }
      cb();
      break;
    case "profile":
      if(!authUser){
        replace("login");
      }
      cb();
      break;
    default:
      if (!authUser) {
        replace("login");
      }
      cb();
  }
}

const InvasionlineRouter = () => {
  return(
    <Router history={hashHistory}>
      <Route path="/">
        <Route component={LoginTemplate}>
          <Route path="login" component={Login}  onEnter={checkAuth}/>
          <Route path="signup" component={Signup}  onEnter={checkAuth}/>
        </Route>
        <Route component={AppTemplate}>
          <IndexRedirect to="dashboard"/>
          <Route path="dashboard" component={Dashboard} onEnter={checkAuth}/>
          <Route path="camera" component={Camera} onEnter={checkAuth}/>
          <Route path="rank" component={Rank} onEnter={checkAuth}/>
          <Route path="clues" component={Clues} onEnter={checkAuth}/>
          <Route path="profile" component={Profile} onEnter={checkAuth}/>
          <Route path="about" component={About} onEnter={checkAuth}/>
        </Route>
      </Route>
    </Router>
  );
}
// verde claro: c6ee6d, verde escuro: 569667, amarelo: fffcc7, vermelho: e4004d
const palette = {
  textColor: "#c6ee6d",
  alternateTextColor: "#c6ee6d",
  primary1Color: "#2A2C36",
  ascent1Color: "#666",
  rosa: "#e4004d",
  white: "#e0e0e0",
  bege: "#fffcc7"
};
const muiTheme = getMuiTheme({
  palette,
    snackbar: {
      textColor: palette.primary1Color,
      backgroundColor: palette.rosa,
      actionColor: palette.white
    },
    dialog: {
      titleFontSize: 22,
      bodyFontSize: 16,
      bodyColor: palette.ascent1Color
    },
    drawer: {
      color: palette.rosa
    },
    menuItem: {
      dataHeight: 32,
      height: 48,
      selectedTextColor: palette.white,
      textColor:palette.primary1Color,
      rightIconDesktopFill: palette.primary1Color
    },
    raisedButton: {
      color: palette.textColor,
      textColor: palette.primary1Color
    },
    flatButton: {
      textColor: palette.textColor
    },
    floatingActionButton: {
     color: palette.textColor,
     iconColor: palette.primary1Color
   },
   textField: {
      borderColor: palette.bege,
      textColor: palette.bege,
      hintColor: palette.bege,
      floatingLabelColor: palette.bege,
      focusColor: palette.textColor
    }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
        <InvasionlineRouter />
      </MuiThemeProvider>
    );
  }
}

export default App;

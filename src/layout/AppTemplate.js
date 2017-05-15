import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
// import Dashboard from 'material-ui/svg-icons/action/dashboard';
// import Search from 'material-ui/svg-icons/action/search';
// import ViewList from 'material-ui/svg-icons/action/view-list';
// import Exit from 'material-ui/svg-icons/action/exit-to-app';
// import PhotoCamera from 'material-ui/svg-icons/image/photo-camera';
// import Account from 'material-ui/svg-icons/action/account-circle';
import {
  Dashboard,
  Rank,
  Clues,
  Capture,
  Profile,
  About,
  Logout
} from '../components/icons';
import {Link, hashHistory} from 'react-router';
import {auth} from '../firebase';

class AppTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: '',
      photo:null,
      uid: null,
      title: 'InvasiOnline'
    };
  }
  componentDidMount(){
    const self = this;
    auth.onAuthStateChanged(function(user) {
      if (user) {
        self.setState({
          name: user.displayName,
          photo: user.photoURL,
          uid: user.uid
        });
      } else {
        console.log("no user");
      }
    });
  }
  componentWillReceiveProps(newProps){
    const self = this;
    auth.onAuthStateChanged(function(user) {
      if (user) {
        self.setState({
          name: user.displayName,
          photo: user.photoURL,
          uid: user.uid
        });
      } else {
        console.log("no user");
      }
    });
  }
  componentWillMount(){
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => {
    this.setState({open: false});
  }
  handleLogout = () => {
    sessionStorage.removeItem('invasionlineUser');
    this.setState({open: false});
    auth.signOut().then(response => {
      hashHistory.replace("login");
    })
  }
  render() {
    if (this.state.uid) {
      return (
        <div>
          <AppBar
            titleStyle={{textTransform: "capitalize"}}
            title={this.props.location.pathname.replace("/", "")}
            onLeftIconButtonTouchTap={this.handleToggle}/>
          <Drawer
            docked={false}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <div className="user-head">
              <div className="user-head-avatar">
                <img src={`../../img/avatar-${this.state.photo}.png`} alt={this.state.name}/>
              </div>
              <div className="user-head-name">
                {this.state.name}
              </div>
            </div>
            <List style={{paddingTop: 0}}>
              <ListItem
                className="list"
                primaryText="Dashboard"
                leftIcon={<Dashboard />}
                onTouchTap={this.handleClose}
                containerElement={<Link to='dashboard' activeClassName="active" />}
              />
              <ListItem
                className="list"
                primaryText="Clues"
                leftIcon={<Clues />}
                onTouchTap={this.handleClose}
                containerElement={<Link to='clues' activeClassName="active" />}
              />
              <ListItem
                className="list"
                primaryText="Rank"
                leftIcon={<Rank />}
                onTouchTap={this.handleClose}
                containerElement={<Link to='Rank' activeClassName="active" />}
              />
              <ListItem
                className="list"
                primaryText="Capture"
                leftIcon={<Capture />}
                onTouchTap={this.handleClose}
                containerElement={<Link to='camera' activeClassName="active" />}
              />
              <ListItem
                className="list"
                primaryText="Perfil"
                leftIcon={<Profile />}
                onTouchTap={this.handleClose}
                containerElement={<Link to='profile' activeClassName="active" />}
              />
              <ListItem
                className="list"
                primaryText="About"
                leftIcon={<About />}
                onTouchTap={this.handleClose}
                containerElement={<Link to='about' activeClassName="active" />}
              />
              <Divider style={{marginTop: 20, marginBottom: 20, backgroundColor: "#212121" }}/>
              <ListItem
                className="list"
                primaryText="Logout"
                leftIcon={<Logout />}
                onTouchTap={this.handleLogout}
              />
            </List>

          </Drawer>
          {this.props.children && React.cloneElement(this.props.children, {
            user: {name: this.state.name, photo: this.state.photo, uid: this.state.uid }
          })}
        </div>
      );
    }
    return(
      <div className="row center-xs">
        <CircularProgress size={60} thickness={7} color="#c6ee6d" style={{marginTop: 200}}/>
      </div>
    )
  }
}

export default AppTemplate;

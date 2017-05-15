import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import { auth, userRef, usersRef } from '../firebase';
import { hashHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';

const avatars = [0,1,2,3,4,5];

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      snackOpen: false,
      snackMsg: '',
      name: null,
      photo: null,
      ready: false
    };
  }
  componentDidMount(){
    console.log("received");
    const self = this;
    userRef(this.props.user.uid).on('value', snap => {
      console.log(snap.val());
      self.setState({
          name: snap.val().name,
          photo: snap.val().photo,
          ready: true
      }, () => {
        document.querySelector(`#avatar-${this.state.photo}`).checked = true;
      })
    })
  }
  handleProfileUpdate = (e) => {
    console.log(this.state.user);
    e.preventDefault();
    const self = this;
    auth.currentUser.updateProfile({
      displayName: this.state.name,
      photoURL: this.state.photo
    }).then(() => {
      var updates = {};
      updates[`${this.props.user.uid}/name`] = this.state.name;
      updates[`${this.props.user.uid}/photo`] = this.state.photo;

      usersRef.update(updates);
      // userRef(`${this.props.user.uid}/name`).set({
      //   name: this.state.user.name,
      //   photo: this.state.user.photo
      // });
      self.setState({
        snackOpen: true,
        snackMsg: 'perfil atualizado'
      })
      hashHistory.replace("dashboard")
    }, error => {
      self.setState({
        snackOpen: true,
        snackMsg: 'erro ao atualizar'
      })
    });
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      name: e.target.value
    })
  }
  handleAvatarChange = (e) => {
    console.log(e.target.value);
    this.setState({
      photo: e.target.value
    })
  }

  render() {
    if (this.state.ready) {
      return (
        <div className="row center-xs" style={{marginTop: 20}}>
          <div className="col-xs-10 start-xs">
            <h5 className="title">Avatar</h5>
          </div>
          <div className="col-xs-10 center-xs">
          <div className="row">
            {avatars.map( (obj,key) => {
              return(
                  <div className="avatar-icon col-xs-4" key={`avatar-${key}`}>
                    <input
                    type="radio"
                    id={`avatar-${key}`}
                    name="avatar"
                    value={obj}
                    onChange={this.handleAvatarChange}
                    hidden />
                    <label htmlFor={`avatar-${key}`}>
                      <div className="profile-avatar">
                        <img src={`../../img/avatar-${obj}.png`} alt="" style={{width: "100%"}}/>
                      </div>
                    </label>
                  </div>

              )
            })}
            </div>

          </div>

          <form className="row center-xs" onSubmit={this.handleProfileUpdate}>
            <div className="col-xs-10">
              <TextField
                id="nome"
                type="name"
                value={this.state.name}
                onChange={this.handleChange}
                floatingLabelText="Nome" />
            </div>
            <div className="col-xs-8" style={{marginTop: 20}}>
              <RaisedButton
                fullWidth={true}
                type="submit"
                label="Salvar"/>
            </div>

          </form>
          <Snackbar
            open={this.state.snackOpen}
            message={this.state.snackMsg}
            autoHideDuration={3000} />
        </div>
      );
    }
    return(
      <div className="row center-xs">
        <CircularProgress size={60} thickness={7} color="#c6ee6d" style={{marginTop: 200}}/>
      </div>
    );
  }
}

export default Profile;

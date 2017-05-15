import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import { Link } from 'react-router';
import { auth, usersRef } from '../firebase';
import { hashHistory } from 'react-router';


class Signup extends Component {
  constructor(props){
    super(props);
    this.state = {
      snackOpen: false,
      snackMsg: ''
    };
  }
  handleSignup = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(e.target.email.value,e.target.pass.value).then( response =>{
      console.log(response);
      usersRef.child(response.uid).set(
        {
          name: response.displayName,
          uid: response.uid,
          photo: 0
        }
      );
      sessionStorage.setItem('invasionlineUser', JSON.stringify(response));
      this.setState({
        snackOpen: true,
        snackMsg: response.email
      })
      hashHistory.replace("/profile");
    }).catch(err => {
      let snackMsg;
      switch (err.code) {
        case "auth/invalid-email":
          snackMsg = "Email inválido"
          break;
        case "auth/email-already-in-use":
          snackMsg = "Email já registrado"
          break;
        case "auth/operation-not-allowed":
          snackMsg = "Operação inválida"
          break;
        case "auth/weak-password":
          snackMsg = "Senha Fraca"
          break;
        default:

      }
      this.setState({
        snackOpen: true,
        snackMsg
      })
    });
  }

  render() {
    return (
        <div className="row center-xs" style={{marginTop: 20}}>
          <div className="col-xs-10">
            <img src="../../img/logo.png" alt="" style={{width: "100%"}}/>
          </div>
          <form className="row center-xs" onSubmit={this.handleSignup}>
            <div className="col-xs-10">
              <TextField
                className="fw-input"
                id="email"
                type="email"
                hintText="Exemplo@ojc.com.br"
                floatingLabelText="Email" />
            </div>
            <div className="col-xs-10">
              <TextField
                className="fw-input"
                id="pass"
                floatingLabelText="Senha"
                type="password" />
            </div>
            <div className="col-xs-8" style={{marginTop: 20}}>
              <RaisedButton
                fullWidth={true}
                type="submit"
                label="Criar conta"/>
            </div>
            <div className="col-xs-8" style={{marginTop: 20}}>
              <Link to="login">
                <FlatButton
                label="já tenho uma conta"/>
              </Link>
            </div>

          </form>
          <Snackbar
            open={this.state.snackOpen}
            message={this.state.snackMsg}
            autoHideDuration={3000} />
        </div>
    );
  }
}

export default Signup;

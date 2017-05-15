import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import {Link} from 'react-router';
import {auth} from '../firebase';
import {hashHistory} from 'react-router';


class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      snackOpen: false,
      snackMsg: '',
      modalOpen: false,
      resetSent: false
    };
  }
  componentWillMount(){
  }
  handleLogin = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(e.target.email.value, e.target.pass.value)
    .then(response => {
      console.log("logado");

      sessionStorage.setItem('invasionlineUser', JSON.stringify(response));
      this.setState({
        snackOpen: true,
        snackMsg: response.email
      })
      hashHistory.replace("dashboard");
    })
    .catch(err => {
      let snackMsg;
      switch (err.code) {
        case "auth/invalid-email":
          snackMsg = "Email inválido"
          break;
        case "auth/user-disabled":
          snackMsg = "Usuário blockeado"
          break;
        case "auth/user-not-found":
          snackMsg = "Nenhuma conta com este email"
          break;
        case "auth/wrong-password":
          snackMsg = "Senha inválida"
          break;
        default:

      }
      this.setState({
        snackOpen: true,
        snackMsg
      })
    })
  }

  toggleModal = (e) => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }
  SendPassReset = (e) => {
    e.preventDefault();
    console.log("reset");
    auth.sendPasswordResetEmail(e.target.emailReset.value).then(response => {
      this.setState({
        resetSent: true
      });
      setTimeout(() => {
        this.setState({
          modalOpen: false
        })
      }, 3000)
    }).catch(err => {
      let snackMsg;
      switch (err.code) {
        case "auth/invalid-email":
          snackMsg = "Email inválido"
          break;
        case "auth/user-not-found":
          snackMsg = "Usuário não encontrado"
          break;
        default:

      }
      this.setState({
        snackOpen: true,
        snackMsg
      });
    })
  }

  render() {
    return (
        <div className="row center-xs" style={{marginTop: 20}}>
          <div className="col-xs-10">
            <img src="../../img/logo.png" alt="" style={{width: "100%"}}/>
          </div>

          <form className="col-xs-10" onSubmit={this.handleLogin}>
            <div className="row center-xs">
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
            </div>
            <div className="row center-xs">
              <div className="col-xs-8" style={{marginTop: 30}}>
                <RaisedButton
                  fullWidth={true}
                  type="submit"
                  label="entrar"/>
              </div>
            </div>
            <div className="row between-xs">
              <div className="col-xs-6" style={{marginTop: 30}}>
                <Link to="signup">
                  <FlatButton
                    label="Criar conta"/>
                </Link>
              </div>
              <div className="col-xs-6" style={{marginTop: 30}}>
                <FlatButton
                  label="mudar senha"
                  onTouchTap={this.toggleModal}/>
              </div>
            </div>

          </form>
          <Snackbar
            open={this.state.snackOpen}
            message={this.state.snackMsg}
            autoHideDuration={3000} />

            <Dialog
              title="Mudar senha"
              className="modal"
              modal={false}
              open={this.state.modalOpen}
              onRequestClose={this.toggleModal}>
              {(() => {
                if (this.state.resetSent) {
                  return <h4>Verifique seu email.</h4>
                }
                return(
                  <form onSubmit={this.SendPassReset}>
                    <TextField
                      id="emailReset"
                      floatingLabelText="Email"
                      hintText="Exemplo@ojc.com.br"
                      type="email"
                      fullWidth={true} />
                      <div className="row" style={{marginTop: 20}}>
                          <div className="col-xs-12">
                          <RaisedButton
                            style={{width: "100%"}}
                            label="Enviar"
                            fullWidth={true}
                            primary={true}
                            type="submit"
                          />
                        </div>
                      </div>
                  </form>
                )
              })()}

            </Dialog>
        </div>
    );
  }
}

export default Login;

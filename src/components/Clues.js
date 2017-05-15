import React, { Component } from 'react';

//Material-ui
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Close from 'material-ui/svg-icons/navigation/close';

//cluesRef
import CluesList from '../clues';

//firebase
import { userRef } from '../firebase'

const pistaNome = {
  fontSize: 20,
  color: '#ffffff',
  position: 'relative',
  zIndex: '3',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}

const horario = {
  fontSize: 16,
  color: '#ffffff'
}

const pontosVal = {
  fontSize: 80,
  lineHeight: '0.8',
  textAlign: 'right',
  color: '#ff2a5f',
}

const pontosValDisable = {
  fontSize: 80,
  lineHeight: '0.8',
  textAlign: 'right',
  color: '#222',
}

const pontosText = {
  fontSize: 21,
  color: '#ffffff',
  position: 'absolute',
  top: '30%',
  right: 12
}

class Clues extends Component {
  constructor(props){
    super(props);

    this.state = {
      pistas: CluesList,
      userPistas: null,
      ready: false,
      open: false,
      openedClue: {
        name: '',
        description: '',
        image: null
      }
    };
  };

  componentWillMount(){
    const self = this;
    userRef(this.props.user.uid).on('value', snap => {
      let userPistas = snap.val().pistas;
      let pistas;
      if (userPistas) {
        pistas = CluesList.map( (pistasObj, pistasKey) => {
          let pista = null;
          for (let i = 0; i < userPistas.length; i++) {
            if (userPistas[i].id === pistasObj.id ) {
              pista = Object.assign(userPistas[i], pistasObj );
            }
          }
          if (pista) {
            return pista;
          }else {
            return {id: `unknown-${pistasKey}`}
          }
        })
      }else{
        pistas = CluesList.map( (pistasObj, pistasKey) => {
          return {id: `unknown-${pistasKey}`}
        })
      }
      userPistas = pistas;
      self.setState({
        userPistas,
        ready: true
      });
    })
  }

  handleOpen = (e, obj) => {
    this.setState({
      openedClue: obj,
      open: true
    });
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    let self = this;
      if(this.state.ready) {
        return (
          <div className="container col-xs">
            <div className="col-xs">
              {this.state.userPistas.map(function(obj) {
                if (obj.found_in) {
                  return(
                    <Paper key={obj.id} className="clueCard row" style={{background: `linear-gradient(to right, rgba(255,255,255, 0), #1c1e28), ${obj.image}`}} onTouchTap={x => self.handleOpen(x, obj)} >
                      <div className="pista-overlay"></div>
                      <div className="col-xs-6" style={pistaNome}>
                        <div style={horario}>
                          {(() => {
                            let hour = new Date(obj.found_in).getUTCHours();
                            let mins = new Date(obj.found_in).getUTCMinutes();
                            if(hour.toString().length !== 2){
                              hour = '0' + hour
                            }
                            if(mins.toString().length !== 2){
                              mins = '0' + mins
                            }
                            return hour + ':' + mins;
                          })()}
                        </div>
                        <div style={pistaNome}>{obj.name}</div>
                      </div>
                      <div className="col-xs-6" style={{position: "relative"}}>
                        <div style={pontosVal}>{obj.score}</div>
                        <div style={pontosText}>Pontos</div>
                      </div>
                    </Paper>
                  )
                }
                return (
                  <Paper key={obj.id} className="clueCard row" style={{backgroundImage: null}}>
                    <div className="pista-overlay"></div>
                    <div className="col-xs-6" style={pistaNome}>
                      <div style={{visibility: 'hidden'}}>00:00</div>
                      <div style={pistaNome}>???</div>
                    </div>
                    <div className="col-xs-6" style={{position: "relative"}}>
                      <div style={pontosValDisable}>???</div>
                      <div style={pontosText}>Pontos</div>
                    </div>
                  </Paper>
                );
              })}
            </div>
            <Dialog
              className="modal"
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              <div className="row">
                <div className="col-xs-12 end-xs"><Close onTouchTap={this.handleClose}/></div>
              </div>
              <div className="clue-image" style={{backgroundImage: this.state.openedClue.image}}></div>
              <div className="clue-title">
                {this.state.openedClue.name}
              </div>
              <div className="clue-description">
              {this.state.openedClue.description}
              </div>
            </Dialog>
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

export default Clues;

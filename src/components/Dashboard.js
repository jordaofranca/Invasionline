import React, { Component } from 'react';
//List
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import CluesList from '../clues';
//Icon
import {userRef} from '../firebase';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      pistas: CluesList,
      user: null,
      ready: false
    }
  };
  componentWillMount(){
    const self = this;
    userRef(this.props.user.uid).on('value', snap => {
      let user = {};
      let obj = snap.val();
      if (obj.pistas) {
        let pistas = obj.pistas.map( pistasObj => {
          for (var i = 0; i < CluesList.length; i++) {
            if (CluesList[i].id === pistasObj.id ) {
              return Object.assign(CluesList[i], pistasObj );
            }
          }
          return false
        }).filter(obj => {
          if (obj) {
            return obj
          }
          return false
        });
        let count = 0;
        pistas.map(obj => {
          count = obj.score + count;
          return false
        })
        user = Object.assign(obj, {score: count});
        self.setState({
          user,
          ready: true
        });
      }else{
        user = Object.assign(obj, {score: 0, pistas: []});
        self.setState({
          user,
          ready: true
        });
      }
    })
  }

  render() {
    return (
      <div>
      <div className="row">
      <Paper className="col-xs-12 header">
      <div className="row center-xs">
      <div className="col-xs-12">
      <div className="header-avatar">
      <img src={`../../img/avatar-${this.props.user.photo}.png`} alt="" style={{width: "100%"}}/>
      </div>
      </div>
      <div className="col-xs-12">
      <div className="header-name">
      {this.props.user.name}
      </div>
      </div>
      </div>
      </Paper>
      </div>
      {(() => {
        if (this.state.ready) {
          return(
            <div className="row">
            <div className="col-xs" style={{marginTop: 20, position: "relative"}}>
            <div className="dashboard-text">{this.state.user.pistas.length}/10</div>
            <span className="dashboard-label">Pistas</span>
            </div>
            <Divider style={{width: "100%", marginTop: 20, backgroundColor: "#E0E0E0"}} />
            <div className="col-xs" style={{marginTop: 20, position: "relative"}}>
            <div className="dashboard-text">
            {this.state.user.score}
            </div>
            <span className="dashboard-label">Pontos</span>
            </div>

            </div>
          )
        }
        return(
          <div className="row center-xs">
            <CircularProgress size={60} thickness={7} color="#c6ee6d" style={{marginTop: 200}}/>
          </div>
        )
      })()}

      </div>
    );
  }
}

export default Dashboard;

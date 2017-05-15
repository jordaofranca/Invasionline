import React, { Component } from 'react';

//Papers
import Paper from 'material-ui/Paper';

//Avatar
import CircularProgress from 'material-ui/CircularProgress';

//Firebase
import {usersRef} from '../firebase';

//CluesList
import CluesList from '../clues';

const pontosVal = {
  fontSize: 48,
  lineHeight: '0.8',
  textAlign: 'right',
  color: '#ff2a5f',
  marginTop: 10,
  marginBottom: 10
}

const normalCard = {
  padding: 20
}

class Rank extends Component {

  constructor(props){
    super(props);
    this.state = {
      pistas: CluesList,
      users: null,
      pontos: 0,
      ready: false,
      currentPosition: {}
    }
  };

  componentWillMount(){
    const self = this;
    // access users collection in firebase
    usersRef.on('value', snap => {
      let users = [];
      let obj = snap.val();
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key].pistas) {
            let pistas = obj[key].pistas.map( pistasObj => {
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
            users.push(Object.assign(obj[key], {id: key, score: count}));
          }
        }
      }
      users.sort(function(a, b) {
        return b.score - a.score;
      });
      users.map((obj, key) => {
        if (obj.name === this.props.user.name) {
          let currentPosition = Object.assign(obj, {position: key+1})
          this.setState({
            currentPosition
          })
        }
        return false
      })
      self.setState({
        users
      });
    })
  }

  render() {
    if (this.state.users) {
      return (
        <div className="container col-xs row">
        <Paper className="header col-xs-12 row">
        <div className="positionRank col-xs-1"><div>{this.state.currentPosition.position}</div></div>
        <div className="perfilImg col-xs-3"><img src={`../../img/avatar-${this.state.currentPosition.photo}.png`} alt="" style={{width: "100%"}} /></div>
        <div className="nomeRank col-xs-4 row"><div>{this.state.currentPosition.name}</div></div>
        <div className="totalPontos col-xs-4" style={pontosVal}>{this.state.currentPosition.score}</div>
        </Paper>

        {this.state.users.map((obj, key) => {
          return(
            <div className="rank-item container col-xs-12 row" key={obj.id} style={normalCard}>
              <div className="positionRank col-xs-1"><div>{key+1}</div></div>
              <div className="perfilImg col-xs-3">
              <img src={`../../img/avatar-${obj.photo}.png`} alt="" style={{width: "100%"}} />
              </div>
              <div className="nomeRank col-xs-4 row"><div>{obj.name}</div></div>
              <div className="totalPontos col-xs-4" style={pontosVal}>{obj.score}</div>
            </div>

          )
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

export default Rank;

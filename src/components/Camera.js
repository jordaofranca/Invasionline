import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import PhotoCamera from 'material-ui/svg-icons/image/photo-camera';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import QrCode from 'qrcode-reader';
import { hashHistory } from 'react-router';
import CluesList from '../clues';
import { userRef } from '../firebase'

let localstream;
let qr = new QrCode();

class Camera extends Component {
  constructor(props){
    super(props);
    this.state = {
      snackOpen: false,
      snackMsg: '',
      userPistas: false,
      image: null,
      scanning: false,
      gotCamera: false,
      qrcode: ''
    }
  }
  componentWillUnmount(){
    localstream.getTracks()[0].stop();
  }
  componentWillMount(){
    let self = this;
    let userPistas;
    console.log(this.props.user.uid);
    userRef(this.props.user.uid).on('value', snap => {
      if (snap.val().pistas) {
        userPistas = snap.val().pistas;
      }else{
        userPistas = [];
      }
      self.setState({
        userPistas
      })
    })
  }

  componentDidMount(){
    let self = this;
    //check for getUserMedia
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
    let devices = [];
    if (navigator.mediaDevices) {

      navigator.mediaDevices.enumerateDevices()
      .then(function (deviceInfos) {
        for (let i = 0; i !== deviceInfos.length; ++i) {
          let deviceInfo = deviceInfos[i];
          if (deviceInfo.kind === 'videoinput') {
            devices.push(deviceInfo)
          }
        }
        let backCamera = devices.map(obj => {
          if(obj.label.indexOf("back")){
            return obj.deviceId;
          }
          return false
        })
        if (navigator.getUserMedia) {
          navigator.getUserMedia({ audio: false, video: { width: 720, height: 1280, deviceId: { exact: backCamera[1] } } },
            function(stream) {
              localstream = stream;
              let video = document.querySelector('video');
              video.src = window.URL.createObjectURL(stream);
              video.onloadedmetadata = function(e) {
                video.play();
              };
              self.setState({
                gotCamera: true
              })
            },
            function(err) {
              console.log("The following error occurred: " + err.name);
            }
          );
        } else {
          console.log("getUserMedia not supported");
        }
      })
      .catch(function (error) {
        console.log("erro");
      });
    }
    qr.callback = (result,err) => {
      // check result
      if(result) {
        console.log(result || err);
        // check filter clue
        let clue = CluesList.filter( obj => {
          if (obj.id === result) {
            return obj
          }
          return false
        });
        let newClue = {
          id: clue[0].id,
          found_in: new Date().toString()
        }
        let clues = [];
        // check if user has this clue
        let sameClue = self.state.userPistas.map(obj => {
          if (obj.id.toString() === clue[0].id.toString()) {
            return obj
          }
          return false
        }).filter(obj => {
          if (obj) {
            return obj
          }
          return false
        });
        if (sameClue.length === 0) {
          clues = self.state.userPistas.concat([newClue]);
          userRef(this.props.user.uid).set({
            pistas: clues,
            name: self.props.user.name,
            photo: self.props.user.photo
          })
          hashHistory.replace('dashboard');
        }else{
          self.setState({
            scanning: false,
            snackOpen: true,
            snackMsg: 'pista repetida'
          })
        }
      }else if(err){

        self.setState({
          scanning: false,
          snackOpen: true,
          snackMsg: 'erro de leitura, tente novamente.'
        })
      }
    };

  }

  handleChooseFileClick = (e) => {
    if (this.state.gotCamera) {
      let video = document.querySelector("video");
      let canvas = document.querySelector('canvas');
      let ctx = canvas.getContext('2d');
      ctx.drawImage(video,0,0, 250, 250);
      let data = ctx.getImageData(0, 0, 250, 250);
      qr.decode(data);
    }else{
      e.preventDefault();
      this._inputLabel.click();
    }
  }
  handleFileChange = (e) => {
      this.setState({
        scanning: true
      })
      window.URL = window.URL || window.webkitURL || window.mozURL;
      let url = URL.createObjectURL(e.target.files[0]);
      console.log(url);
      qr.decode(url);
  }

  render() {
    if (!this.state.scanning) {
      return (
        <div className="video">
        <video ></video>
        <canvas width="250" height="250" className="qrCode"></canvas>
        <img src={this.state.image} alt="" width="250" height="400" style={{display: "none"}}/>
        <input type="file" name="image" id="file" accept="image/*" className="input-file" onChange={this.handleFileChange} capture hidden/>
        <label htmlFor="file" ref={x => this._inputLabel = x}>
        <FloatingActionButton
        style={{position: "fixed", bottom: 20, left: "calc(50% - 28px)", zIndex: 2}}
        onTouchTap={this.handleChooseFileClick}
        >
        <PhotoCamera />
        </FloatingActionButton>
        </label>
        <Snackbar
        open={this.state.snackOpen}
        message={this.state.snackMsg}
        autoHideDuration={3000} />
        </div>
      );
    }
    return(
      <div className="row center-xs">
      <div>{this.state.qrcode}</div>
        <CircularProgress size={60} thickness={7} color="#c6ee6d" style={{marginTop: 200}}/>
      </div>
    )
  }
}

export default Camera;

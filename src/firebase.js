import * as firebase from 'firebase';

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  storageBucket: "",
  messagingSenderId: ""
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const storage = firebase.storage();
export const database = firebase.database();

export const cluesRef = database.ref().child('pistas');
export const usersRef = database.ref().child('users');

export const userRef = (id) => {
  return database.ref().child('users/' + id);
}

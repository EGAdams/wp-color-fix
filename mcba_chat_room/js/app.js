
var firebaseConfig = {
  apiKey: "AIzaSyBVdSbg0x__3wvPeSLDC6lW-ywbd_l0Wvo",
  authDomain: "mcba-master.firebaseapp.com",
  databaseURL: "https://mcba-master.firebaseio.com",
  projectId: "mcba-master",
  storageBucket: "mcba-master.appspot.com",
  messagingSenderId: "1153728140",
  appId: "1:1153728140:web:161da318e89c996aba05a9"
};

// Initialize Firebase
console.log( "firebase.initializeApp() called here... " );
var app_fireBase = firebase.initializeApp( firebaseConfig );

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI( firebase.auth() );
// Disable auto-sign in.
ui.disableAutoSignIn();

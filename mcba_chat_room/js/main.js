if( typeof firebase == "undefined" ) {
  var firebase = app_fireBase;
}

let email = "";
let name = "";
var msgScreen = document.getElementById( "messages" );
var msgForm = document.getElementById( "messageForm" );
var msgInput = document.getElementById( "msg-input" );
var msgBtn = document.getElementById( "msg-btn" );
var userName = document.getElementById( "user-name" );
var db = firebase.database();
var msgRef = db.ref( "/msgs" ); //save in msgs folder in database

function clearCookies() {
    var cookies = document.cookie.split("; ");
    debugger;
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
}

function init() {
  console.log( "initializing firebase... " );
  firebase.auth().onAuthStateChanged( function ( user ) {
    if ( user ) {
        msgScreen = document.getElementById( "messages" );
        msgForm   = document.getElementById( "messageForm" );
        msgForm.addEventListener( 'submit', sendMessage );
        msgInput  = document.getElementById( "msg-input" );
        msgBtn    = document.getElementById( "msg-btn" );
        userName  = document.getElementById( "user-name" );
        jQuery( "#loginDiv" ).css( "display", "none" );
        jQuery( ".chat" ).css( "display", "block"  );
        
      // User is signed in. Get their name.
      name = user.displayName;
      email = user.email;
      msgRef.on( 'child_added', updateMsgs );
      if ( userName != null ) {
        userName.innerHTML = "Welcome, " + name + "!";
      }
      
    } else {
      //redirect to login page
      //window.location.replace( "login.html" );
      jQuery( ".chat" ).css( "display", "none"  );
      jQuery( "#loginDiv" ).css( "display", "block" );
      // loadjscssfile( "js/app.js", "js" );
      // loadjscssfile( "js/login.js", "js" );
      ( function () {
        var ui = new firebaseui.auth.AuthUI( firebase.auth() );
        var uiConfig = {
          callbacks: {
            signInSuccessWithAuthResult: function ( authResult, redirectUrl ) {
              // User successfully signed in.
              // Return type determines whether we continue the redirect automatically
              // or whether we leave that to developer to handle.
              return true;
            },
            uiShown: function () {
              // The widget is rendered.
              // Hide the loader.
              document.getElementById( 'loader' ).style.display = 'none';
            }
          },
          // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
          signInFlow: 'popup',
          signInSuccessUrl: '',  /* removed index.html stpat2021 */
          signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
          ],
          // Terms of service url.
          tosUrl: 'index.html',
          // Privacy policy url.
          privacyPolicyUrl: 'index.html'
        };
      
        // The start method will wait until the DOM is loaded.
        ui.start( '#firebaseui-auth-container', uiConfig );
      } )()
      console.log( "loading firebase-app.js..." );
      loadjscssfile( "https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js", "js" );
      console.log( "loading firebase-auth.js..." );
      loadjscssfile( "https://www.gstatic.com/firebasejs/7.8.1/firebase-auth.js", "js" );
      return;                      
    }
  });

  // document.getElementById( 'log-out' ).addEventListener( 'click', logOut );
  if ( msgForm != undefined ) {
      msgForm.addEventListener( 'submit', sendMessage );
  }
}

// function logOut() {
//   firebase.auth().signOut().then( function () {
//     console.log( "SIGN OUT" );
//     window.location.replace( "login.html" );
//   } ).catch( function ( error ) {

//     console.error( error );
//   } );
// }

const updateMsgs = data => {
  const { email: userEmail, name, text } = data.val();

  //Check the encrypting mode
  var encryptMode = fetchJson();
  var outputText = text;

  if ( encryptMode == "nr" ) {
    outputText = normalEncrypt( outputText );
  } else if ( encryptMode == "cr" ) {
    outputText = crazyEncrypt( outputText );
  }

  //load messages
  const msg = `<li class="${email == userEmail ? "msg my" : "msg"}"><span class = "msg-span">
    <i class = "name">${name}: </i>${outputText}
    </span>
  </li>`
  msgScreen.innerHTML += msg;
  document.getElementById( "chat-window" ).scrollTop = document.getElementById( "chat-window" ).scrollHeight;
  //auto scroll to bottom
}

function sendMessage( e ) {
  e.preventDefault();
  const text = msgInput.value;

  if ( !text.trim() ) return alert( 'Please type a message.' ); // no msg submitted
  const msg = {
    email,
    name,
    text: text
  };

  msgRef.push( msg );
  msgInput.value = "";
}

//Get encryption settings
function fetchJson() {
  var settings = JSON.parse( localStorage.getItem( 'settings' ) );
  return settings;
}


function crazyEncrypt( text ) {
  var words = text.replace( /[\r\n]/g, '' ).toLowerCase().split( ' ' );
  var newWord = '';
  var newArr = [];

  words.map( function ( w ) {
    if ( w.length > 1 ) {
      w.split( '' ).map( function () {
        var hash = Math.floor( Math.random() * w.length );
        newWord += w[ hash ];
        w = w.replace( w.charAt( hash ), '' );
      } );
      newArr.push( newWord );
      newWord = '';

    } else {
      newArr.push( w );
    }
  } );
  text = newArr.join( ' ' );
  return text;
}

//Normal encryption - first and last letter fixed position
function normalEncrypt( text ) {
  var words = text.replace( /[\r\n]/g, '' ).toLowerCase().split( ' ' );
  var newWord = '';
  var newArr = [];

  words.map( function ( w ) {
    if ( w.length > 1 ) {
      var lastIndex = w.length - 1;
      var lastLetter = w[ lastIndex ];

      //add the first letter
      newWord += w[ 0 ];
      w = w.slice( 1, lastIndex );

      //scramble only letters in between the first and last letter
      w.split( '' ).map( function ( x ) {
        var hash = Math.floor( Math.random() * w.length );
        newWord += w[ hash ];
        w = w.replace( w.charAt( hash ), '' );
      } );

      //add the last letter
      newWord += lastLetter;
      newArr.push( newWord );
      newWord = '';
    } else {
      newArr.push( w );
    }
  } );
  text = newArr.join( ' ' );
  return text;
}
document.addEventListener( 'DOMContentLoaded', init );


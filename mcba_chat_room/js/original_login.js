console.log( 'login.js loaded.' );
( function () {
  console.log( "calling anonymous function inside of login.js..." );
  var ui = new firebaseui.auth.AuthUI( firebase.auth() );
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function ( authResult, redirectUrl ) {
        console.log( "sign in success with auth result." );
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function () {
        console.log( "ui shown." ); 
        // The widget is rendered.
        // Hide the loader.
        document.getElementById( 'loader' ).style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'index.html',
    // Privacy policy url.
    privacyPolicyUrl: 'index.html'
  };

  // The start method will wait until the DOM is loaded.
  console.log( "calling ui.start inside login.js..." );
  ui.start( '#firebaseui-auth-container', uiConfig );
} )()
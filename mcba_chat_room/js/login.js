

function loginWrapper() {

  // var ui = new firebaseui.auth.AuthUI( firebase.auth() );
  var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI( firebase.auth() );
  // ui.disableAutoSignIn();
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
    signInSuccessUrl: '', /* removed index.html stpat2021 */
    signInOptions: [
      //firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'index.html',
    // Privacy policy url.
    privacyPolicyUrl: 'index.html'
  };

  // The start method will wait until the DOM is loaded.
  ui.start( '#firebaseui-auth-container', uiConfig );
}

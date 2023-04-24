// import { UserAgentApplication } from '@azure/msal-browser';

// import * as msal from '@azure/msal-browser';
// import $ from 'jquery';

const msalConfig = {
  auth: {
    clientId: '5c17ff26-50a1-4003-bc31-f0545709c2f7',
    authority: 'https://login.microsoftonline.com/c43d3f81-f57a-48cc-8b07-74b39935d876',
    redirectUri: 'http://localhost:8000/danh-sach-test/'
  }
};
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Handle button click event
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', () => {
  event.preventDefault();
  msalInstance
    .loginPopup()
    .then(response => {
      // Handle successful login
      console.log('Login successful:', response);
      // Get access token
      return msalInstance.acquireTokenSilent({
        scopes: ['user.read']
      });

      
    })
    .then(accessTokenResponse => {
      // Handle access token response
      console.log('Access token:', accessTokenResponse.accessToken);
    })
    .catch(error => {
      // Handle login or access token error
      console.log('Error:', error);
    });
});

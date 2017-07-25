import d from 'debug';

/*global gapi:true*/

const debug = d('yt:actions:videoPlayer');


const GAPI_OPTS = {
  'clientId': '681087467481-tgrs38f4u76cjrdilhch2gom7mnvi462.apps.googleusercontent.com',
  'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
  'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner'
}

const HAS_GRANTED_SCOPES = 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner';


function initGAPI(dispatch) {
  debug('initGAPI');
  gapi.client.init(GAPI_OPTS)
    .then(() => {
      let GoogleAuth = gapi.auth2.getAuthInstance();
      let user = GoogleAuth.currentUser.get();
      const isAuthorized = user.hasGrantedScopes(HAS_GRANTED_SCOPES);

      if (isAuthorized) {
        debug('user authorized', GoogleAuth);
        dispatch(setUser({
          'isAuthorized': true,
          'googleAuth': GoogleAuth
        }))
      } else {
        dispatch(setUser({
          'isAuthorized': false,
          'googleAuth': GoogleAuth
        }));
      }

      debug('initGAPI success');
    })
}



export function authGoogle(googleAuth) {
  debug('Google Auth', googleAuth);
  return (dispatch, getState) => {
    googleAuth.signIn();
    return dispatch(function () { return true; });
  }
}



export function loadGAPI() {
  debug('loadGAPI');
  return (dispatch, getState) => {
    gapi.load('client', function () {
      gapi.load('client:auth2', initGAPI(dispatch));
    });
  }
}



export const SET_USER = 'SET_USER'

export function setUser(user) {
  debug('set user');
  return {
    type: SET_USER,
    user
  }
}





import d from 'debug';

/*global gapi:true*/

const debug = d('yt:actions:videoPlayer');


const GAPI_OPTS = {
  'clientId': '681087467481-tgrs38f4u76cjrdilhch2gom7mnvi462.apps.googleusercontent.com',
  'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
  'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner'
}

const HAS_GRANTED_SCOPES = 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner';


function initYoutube(dispatch) {
  debug('initYoutube');
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

      debug('initYoutube success');
    })
    .then(() => dispatch(receiveAuthYoutube()))
}


/**
 * Init Google API
 */
export function authYoutube() {
  debug('authenticate');

  return dispatch => {
    debug('about to dispatch `requestAuthYoutube`');

    dispatch(requestAuthYoutube)

    return gapi.client.init(GAPI_OPTS)
      .then(() => {
        debug('gapi init success', gapi);
        gapi.load('client:auth2', initYoutube(dispatch));
      });
  }
}

export function authGoogle(googleAuth) {
  debug('Google Auth', googleAuth);
  return (dispatch, getState) => {
    googleAuth.signIn();
    return dispatch(function () { return true; });
  }
}


/**
 * Init Google API (GAPI)
 */
export function initGAPI(googleAuth) {
  debug('initGAPI. Param: googleAuth: ', googleAuth);
  return (dispatch, getState) => {
    debug('Need to authenticate');
    return dispatch(authYoutube(googleAuth))
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



export const REQUEST_AUTH_YOUTUBE = 'REQUEST_AUTH_YOUTUBE'

export function requestAuthYoutube(params) {
  debug('requestAuthYoutube');
  return {
    type: REQUEST_AUTH_YOUTUBE,
    params
  }
}

export const RECEIVE_AUTH_YOUTUBE = 'RECEIVE_AUTH_YOUTUBE'

function receiveAuthYoutube() {
  debug('receiveAuthYoutube');
  return {
    type: RECEIVE_AUTH_YOUTUBE,
    receivedAt: Date.now()
  }
}

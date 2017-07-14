import 'babel-polyfill';
import d from 'debug';
import { merge } from 'lodash';

/*global gapi:true*/

const debug = d('yt:actions');

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





export function loadYoutubeAPI() {
  debug('Load Youtube API');

  return dispatch => {
    var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}

function onPlayerReady(e) {
  e.target.playVideo();
}
/*global YT:true */
let player;
export function playVideo(videoId) {
  debug('Play video');

  return (dispatch, getState) => {
    // player.loadVideoById(videoId)
    /* global player:true */
    // let player = getState().player;

    if (player) {
      console.log('player', player);
      player.loadVideoById(videoId); 
    } else {
			player = new YT.Player('player', {
				height: '390',
				width: '640',
				videoId,
				events: {
					'onReady': (e) => { e.target.playVideo() },
					// 'onStateChange': onPlayerStateChange
				}
			});

			dispatch(storePlayer(player));
    }
  }
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


export function fetchVideoSearch(searchText) {
  return (dispatch, getState) => {
    const opts = merge({q: searchText}, getState().searchOptions);

    return gapi.client.youtube.search.list(opts)	
			.then((json) => {
				debug('Youtube search results for "', searchText, '": ', json.result.items);
				dispatch(receiveSearchList(json.result.items))
			})
  };
}


export function setSearchOptions(opts) {
  return (dispatch, getState) => {
    dispatch(searchOptions(opts)); 
  }
}

export const SET_SEARCH_OPTIONS = 'SET_SEARCH_OPTIONS';

function searchOptions(opts) {
  debug('searchOptions', opts);
  return {
    type: SET_SEARCH_OPTIONS,
    options: opts
  }
}


export const STORE_PLAYER = 'STORE_PLAYER';

function storePlayer(player) {
  debug('storePlayer', player);
  return {
    type: STORE_PLAYER,
    player
  }
}


export const RECEIVE_SEARCH_LIST = 'RECEIVE_SEARCH_LIST'

function receiveSearchList(list) {
  return {
    type: RECEIVE_SEARCH_LIST,
    results: list,
    receivedAt: Date.now()
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


/**
 * Action: oAuth YouTube API
 */
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


export const SET_USER = 'SET_USER'

export function setUser(user) {
  debug('set user');
  return {
    type: SET_USER,
    user   
  }
}


/**
 * Action: Search YouTube
 */
export const SEARCH_YOUTUBE = 'SEARCH_YOUTUBE'

export function searchYoutube(search) {
  return {
    type: SEARCH_YOUTUBE,
    search
  }
}






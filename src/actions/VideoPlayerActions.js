import d from 'debug';
import { find } from 'lodash';

const debug = d('yt:actions:videoPlayer');

let player;

/*global YT:true gapi:true */

export function loadYoutubeAPI() {
  debug('Load Youtube API');

  return dispatch => {
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}


export function destroyVideoPlayer() {
  debug('Destroy video player');
  return dispatch => {

    if (player && player.destroy) {
      player.destroy();
      player = null;
    }

    dispatch(unsetCurrentVideo());
  }
}


export function playVideo(videoId, key) {
  debug('Play video');

  return (dispatch, getState) => {
    if (player) {
      debug('player already initialized. Playing next video');
      player.loadVideoById(videoId);
    } else {
      debug('player about to be initialized');
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId,
        events: {
          'onReady': (e) => { e.target.playVideo() }
        }
      });
    }

    dispatch(setCurrentVideo(videoId, key, getState()));

		gapi.client.youtube.commentThreads.list({
			order: 'relevance',
			part: 'snippet',
			videoId: videoId,
			maxResults: 10
		})
		.then((json) => {
			debug('Youtube comments successfully fetched', json.result);
			dispatch(storeComments(json.result.items))
		});

  }
}


export const SET_CURR_VIDEO = 'SET_CURR_VIDEO';

function setCurrentVideo(videoId, key, state) {
  const videoMeta = find(state[key], function (vid) {
    debug('#', vid.id.videoId, videoId);
    return vid.id.videoId === videoId;
  });

  debug('setCurrentVideo', videoId, 'details:', videoMeta);

  return {
    type: SET_CURR_VIDEO,
    currentVideo: videoMeta
  }
}


export const UNSET_CURR_VIDEO = 'UNSET_CURR_VIDEO';

function unsetCurrentVideo() {
  debug('unsetCurrentVideo');

  return {
    type: UNSET_CURR_VIDEO,
    currentVideo: null
  }
}


export const STORE_COMMENTS = 'STORE_COMMENTS';

function storeComments(comments) {
  debug('storeComments', comments);
  return {
    type: STORE_COMMENTS,
    comments
  }
}


export function addToFavorites(key) {

  return (dispatch, getState) => {
    const videoId = getState().currentVideo.id.videoId;
    debug('Add/Remove to favorites:', videoId);
    debug('searchResults', getState()[key]);
    const videoMeta = find(getState()[key], function (vid) {
      return vid.id.videoId === videoId;
    });

    debug('about to add/remove': videoMeta);
    
    dispatch(toggleFavorites(videoMeta));
  }
}

export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

function toggleFavorites(videoMeta) {
  debug('toggleFavorites', videoMeta);

  /*const videoMeta = find(state[key], function (vid) {
    debug('#', vid.id.videoId, videoId);
    return vid.id.videoId === videoId;
  });*/

  return {
    type: TOGGLE_FAVORITE,
    video: videoMeta
  }
}

import d from 'debug';

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


export function playVideo(videoId) {
  debug('Play video');

  return (dispatch, getState) => {
    if (player) {
      player.loadVideoById(videoId);
    } else {
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId,
        events: {
          'onReady': (e) => { e.target.playVideo() }
        }
      });
      //dispatch(storePlayer(player));
    }

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


function fetchVideoComments(dispatch, videoId) {
  gapi.client.youtube.commentThreads.list({
    order: 'relevance',
    part: 'snippet',
    videoId: videoId,
    maxResults: 10
  })
  .then((json) => {
    debug('Youtube comments successfully fetched', json);
    // dispatch.....
  });
}

export const STORE_COMMENTS = 'STORE_COMMENTS';

function storeComments(comments) {
  debug('storeComments', comments);
  return {
    type: STORE_COMMENTS,
    comments
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

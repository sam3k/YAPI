import d from 'debug';

/*global gapi:true*/

const debug = d('yt:actions:search');


export function fetchVideoSearch(searchText) {
  return (dispatch, getState) => {
    // const opts = merge({q: searchText}, getState().searchOptions);
    const opts = getState().searchOptions;

    return gapi.client.youtube.search.list(opts)
      .then((json) => {
        debug('Youtube search results for "', searchText, '": ', json.result.items);
        dispatch(receiveSearchList(json.result.items))
      })
  };
}


/*
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
*/

export const RECEIVE_SEARCH_LIST = 'RECEIVE_SEARCH_LIST'

function receiveSearchList(list) {
  return {
    type: RECEIVE_SEARCH_LIST,
    results: list,
    receivedAt: Date.now()
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


export function setSearchOptions(opts) {
  return (dispatch, getState) => {
    dispatch(searchOptions(opts));
  }
}

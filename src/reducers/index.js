import { combineReducers } from 'redux'
import d from 'debug';
import { merge } from 'lodash';
import {
  SET_USER,
  RECEIVE_SEARCH_LIST,
  SET_SEARCH_OPTIONS,
  STORE_COMMENTS,
  SET_CURR_VIDEO
} from '../actions/index'

const debug = d('yt:reducers');

const initialState = {
  user: null,
  searchOptions: {
    order: 'relevance',
    part: 'snippet',
    type: 'video',
    maxResults: 10
  }
}

function user(state = null, action) {
  debug('User reducer. Action:', action);

  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, action.user)
    default:
      return state
  }
}


function searchResults(state = null, action) {
  debug('Search results reducer. Action:', action);

  switch (action.type) {
    case 'persist/REHYDRATE':
      const incoming = action.payload.searchResults;
      if (incoming) return {...state, ...incoming};
      return state;
    case RECEIVE_SEARCH_LIST:
      return Object.assign({}, state, action.results);
    default:
      return state;
  }
}


function searchOptions(state = initialState.searchOptions, action) {
  debug('Search options reducer. Action:', action);

  switch (action.type) {
    case 'persist/REHYDRATE':
      const incoming = action.payload.searchOptions;
      if (incoming) return {...state, ...incoming};
      return state;
    case SET_SEARCH_OPTIONS:
      const opts = merge({}, initialState.searchOptions, action.options);
      return Object.assign({}, state, opts);
    default:
      return state
  }
}


function video(state = null, action) {
  debug('Video reducer. Action:', action);

  switch (action.type) {
    /*case 'persist/REHYDRATE':
      const incoming = action.payload.searchOptions;
      if (incoming) return {...state, ...incoming};
      return state;*/
    case SET_CURR_VIDEO:
      return {...state, ...action.videoDetails}
    default:
      return state
  }
}

function favorites(state = null, action) {
  debug('Favorites reducer. Action:', action);
  return state;
}



function comments(state = null, action) {
  debug('Comments reducer. Action:', action);

  switch (action.type) {
    case STORE_COMMENTS:
      return Object.assign({}, state, action.comments)
    default:
      return state
  }
}

const rootReducer = combineReducers({
  user,
  comments,
  searchResults,
  searchOptions,
  favorites
  // rehydrateReducer
})



export default rootReducer



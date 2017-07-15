import { combineReducers } from 'redux'
import d from 'debug';
import { merge } from 'lodash';
import {
  SET_USER,
  RECEIVE_SEARCH_LIST,
  SET_SEARCH_OPTIONS,
  STORE_PLAYER,
  STORE_COMMENTS
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
    case RECEIVE_SEARCH_LIST:
      return Object.assign({}, state, action.results)
    default:
      return state
  }
}

function searchOptions(state = initialState.searchOptions, action) {
  debug('Search options reducer. Action:', action);

  switch (action.type) {
    case SET_SEARCH_OPTIONS:
      const opts = merge({}, initialState.searchOptions, action.options);
      return Object.assign({}, state, opts);
    default:
      return state
  }
}

function player(state = null, action) {
  debug('Search results reducer. Action:', action);

  switch (action.type) {
    case STORE_PLAYER:
      return Object.assign({}, state, action.player)
    default:
      return state
  }
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
  player,
  comments,
  searchResults,
  searchOptions
})



export default rootReducer



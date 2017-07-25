import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { find } from 'lodash';
import {
  loadGAPI,
  authGoogle,
  fetchVideoSearch,
  setSearchOptions,
  loadYoutubeAPI,
  playVideo,
  destroyVideoPlayer,
  addToFavorites
} from '../actions/index'

const debug = require('debug')('yt:containers:app')


class Home extends Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this)
    this.onAuthClick = this.onAuthClick.bind(this);
    this.onSortBy = this.onSortBy.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  componentDidMount () {
    this.props.dispatch(loadYoutubeAPI());
    this.props.dispatch(loadGAPI());
  }

  componentWillUnmount () {
    this.props.dispatch(destroyVideoPlayer());
  }

  onAuthClick() {
    debug('onAuthClick');
    this.props.dispatch(authGoogle(this.props.user.googleAuth));
  }

  handleKeyUp(e) {
    this.props.dispatch(setSearchOptions({
      q: e.target.value
    }));

    if (e.keyCode === 13) {
      this.handleGoClick(e.target.value)
    }
  }

  onPlayVideo(videoId, currIndex) {
    debug('onPlayVideo -> videoId:', videoId);
    this.props.dispatch(playVideo(videoId, 'searchResults'));
  }

  onSortBy(e) {
    debug('onSortBy', e.target.value);
    this.props.dispatch(setSearchOptions({
      order: e.target.value
    }));
  }

  handleGoClick = () => {
    debug('handleGoClick');
    let searchText = this.refs.input.value;
    this.props.dispatch(fetchVideoSearch(searchText))
  }

  toggleFavorite() {
    debug('toggleFavorite');
    this.props.dispatch(addToFavorites('searchResults'));
  }

  render() {
    let content;
    let searchResultsHTML;
    let commentsHTML;

    if (this.props.comments && this.props.currentVideo) {
      let comments = this.props.comments;

      commentsHTML = (
        <div className="comments">
          <h3>Comments</h3>
          {Object.keys(comments).map(key => (
            <div
              key={comments[key].id}
              className="media fadeIn animated">
                <div className="media-left">
                  <img className="media-object" src={comments[key].snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                </div>
                <div className="media-body">
                  <h6 className="media-heading">{comments[key].snippet.topLevelComment.snippet.authorDisplayName}</h6>
                  <p>{comments[key].snippet.topLevelComment.snippet.textDisplay}</p>
                  <p><small>Likes <span className="badge">{comments[key].snippet.topLevelComment.snippet.likeCount}</span></small></p>
              </div>
            </div>
          ))}
        </div>
      );
    }


    if (this.props.searchResults) {
      let searchResults = this.props.searchResults;

      searchResultsHTML = (
        <div className="search-results">
          {Object.keys(searchResults).map(key => (
		    <div
              onClick={() => this.onPlayVideo(searchResults[key].id.videoId, key)}
              key={searchResults[key].id.videoId}
              className="media fadeIn animated">
                <div className="media-left">
                  <img className="media-object" src={searchResults[key].snippet.thumbnails.default.url} alt="" />
                </div>
                <div className="media-body">
                    <h4 className="media-heading">{searchResults[key].snippet.title}</h4>
                    <p>{searchResults[key].snippet.description}</p>
                </div>
			</div>
          ))}
        </div>
      );
    }

    let videoContainerCss = '';
    if (this.props.player) {
      videoContainerCss = 'animated bounceInRight';
    }

    if (!this.props.user || !this.props.user.isAuthorized) {
      content = (
		<div className="navbar-form navbar-left">
		  <div className="form-group">
            <button className="btn btn-default" onClick={this.onAuthClick}>Authenticate with Google</button>
          </div>
		</div>
      );
    } else {
      content = (
        <div>
          <div className="navbar-form navbar-left">
            <div className="form-group">
              <input size="30"
                     ref="input"
                     defaultValue={this.props.searchOptions.q}
                     className="form-control"
                     placeholder="Search Videos"
                     onKeyUp={this.handleKeyUp} />

            </div> <div className="form-group">
              <form className="form-inline">
                <div className="form-group">
                  <select defaultValue="relevance" onChange={this.onSortBy} className="form-control">
                    <option value="relevance">Sort by Relevance</option>
                    <option value="date">Sort by Date</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>
              </form>
            </div> <button className="btn btn-default" onClick={this.handleGoClick}>Search</button>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </div>
      );
    }

    let favorite;

    if (this.props.comments && this.props.currentVideo) {
      let currVideoId = this.props.currentVideo.id.videoId;

      const favClass = find(this.props.favorites, function (vid) {
        return vid.id.videoId === currVideoId;
      }) ? 'fa-heart' : 'fa-heart-o';

      favorite = (
        <div onClick={this.toggleFavorite} className="add-to-favorites">
          <i className={'fa fa-2x ' + favClass}></i> Add to favorites
        </div>
      );
    }

    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#yapi">Youtube API Demo</a>
            </div>
            {content}
          </div>
        </nav>

        <div>
          <div className="col-md-6">
            {searchResultsHTML}
          </div>
          <div className="col-md-6">
            <div className={videoContainerCss}>
              <div id="player"></div>
              {favorite}
              {commentsHTML}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


Home.propTypes = {
  dispatch: PropTypes.func.isRequired
}


function mapStateToProps(state) {
  const {
    user,
    searchYoutube,
    searchResults,
    searchOptions,
    comments,
    favorites,
    currentVideo
  } = state

  return {
    user,
    searchOptions,
    searchResults,
    searchYoutube,
    comments,
    favorites,
    currentVideo
  }
}


export default connect(mapStateToProps)(Home)

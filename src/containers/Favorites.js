import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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


class Favorites extends Component {
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

  onPlayVideo(videoId) {
    debug('onPlayVideo -> videoId:', videoId);
    this.props.dispatch(playVideo(videoId, 'favorites'));
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
    this.props.dispatch(addToFavorites('favorites'));
  }

  render() {
    let content;
    let favoritesHTML;
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


    if (this.props.favorites) {
      let favs = this.props.favorites;

      favoritesHTML = (
        <div className="search-results">
          {Object.keys(favs).map(key => (
						<div
              onClick={() => this.onPlayVideo(favs[key].id.videoId, key)}
              key={favs[key].id.videoId}
              className="media fadeIn animated">

							<div className="media-left">
							  <img className="media-object" src={favs[key].snippet.thumbnails.default.url} alt="" />
							</div>
							<div className="media-body">
								<h4 className="media-heading">{favs[key].snippet.title}</h4>
								<p>{favs[key].snippet.description}</p>
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
          <ul className="nav navbar-nav navbar-right">
            <li><Link to="/">Home</Link></li>
          </ul>
        </div>
      );
    }

    let favorite;

    if (this.props.comments && this.props.currentVideo) {
      favorite = (
        <div
        onClick={this.toggleFavorite} className="add-to-favorites">
          <i className={'fa fa-2x fa-heart'}></i> Add to favorites
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
          <div className="col-md-12">
            <h1>Favorites</h1>
          </div>
          <div className="col-md-6">
            {favoritesHTML}
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


Favorites.propTypes = {
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


export default connect(mapStateToProps)(Favorites)

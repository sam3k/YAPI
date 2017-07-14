import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  initGAPI,
  authGoogle,
  fetchVideoSearch,
  setSearchOptions,
  loadYoutubeAPI,
  playVideo
} from '../actions'

const debug = require('debug')('yt:containers:app')

/*global gapi:true*/

class App extends Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this)
    this.onAuthClick = this.onAuthClick.bind(this);
    this.onSortBy = this.onSortBy.bind(this);
  }

  componentDidMount () {
    let self = this;
    const { googleAuth } = this.props;

    this.props.dispatch(loadYoutubeAPI());

    // TODO: move to actions
    gapi.load('client', function () {
      gapi.load('client:auth2', self.props.dispatch(initGAPI(googleAuth)));
    });
  }

  onAuthClick() {
    debug('onAuthClick');
    this.props.dispatch(authGoogle(this.props.user.googleAuth));
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleGoClick(e.target.value)
    }
  }

  onPlayVideo(videoId) {
    debug('onPlayVideo -> videoId:', videoId);
    this.props.dispatch(playVideo(videoId));
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

  render() {
    const { value, onIncrement, onDecrement } = this.props

    let content;
    let searchResultsHTML;

    if (this.props.searchResults) {
      let searchResults = this.props.searchResults;

      searchResultsHTML = (
        <div className="search-results">
          {Object.keys(searchResults).map(key => (
						<div
              // () => this.handleRemove(id)
              onClick={() => this.onPlayVideo(searchResults[key].id.videoId)}
              key={searchResults[key].id.videoId}
              className="media fadeIn animated">

							<div className="media-left">
							  <img className="media-object" src={searchResults[key].snippet.thumbnails.default.url} />
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
				<div className="navbar-form navbar-left">
					<div className="form-group">
						<input size="30"
									 ref="input"
									 defaultValue=""
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
      );
    }

    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">Youtube API Demo</a>
            </div>
            {content}
          </div>
        </nav>

        <div className="row">
          <div className="col-md-6">
            {searchResultsHTML}
          </div>
          <div className="col-md-6">
            <div className={videoContainerCss}>
              <div id="player"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}




App.propTypes = {
  dispatch: PropTypes.func.isRequired
}




function mapStateToProps(state) {
  const {
    user,
    searchYoutube,
    searchResults,
    searchOptions,
    player
  } = state


  /*const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsBySubreddit[selectedSubreddit] || {
    isFetching: true,
    items: []
  }*/


  return {
    user,
    searchOptions,
    searchResults,
    searchYoutube,
    player
  }
}


export default connect(mapStateToProps)(App)

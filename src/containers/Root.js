import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../configureStore';
import { persistStore } from 'redux-persist';
import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router';
import Home from './Home';
import Favorites from './Favorites';

const history = createHistory()
const middleware = routerMiddleware(history)
const store = configureStore();

persistStore(store);


export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
					<div>
						<Route exact path="/" component={Home}/>
            <Route path="/favorites" component={Favorites}/>
					</div>
				</ConnectedRouter>
      </Provider>
    )
  }
}


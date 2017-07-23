import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../configureStore';
import { persistStore } from 'redux-persist';
import App from './App';

const store = configureStore();

persistStore(store);


export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

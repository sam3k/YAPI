import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
  const enhancer = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );

  return createStore(
    rootReducer,
    enhancer,
    preloadedState
  );
}


import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga';
import 'bootstrap';
import { createHashHistory } from "history";
import 'bootstrap/dist/css/bootstrap.css';
import reducers from './state';
import sagas from './sagas';

export const history = createHashHistory({
  basename: '', // The base URL of the app (see below)
  hashType: 'slash', // The hash type to use (see below)
  getUserConfirmation: (message, callback) => callback(window.confirm('Why motherfucker?'))
});

const sagaMiddleware = createSagaMiddleware();
const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  ...reducers,
});

const setupStore = (preloadedState) => {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware
      ),
    ),
  )
  sagaMiddleware.run(sagas);
  return store
}

export default setupStore();

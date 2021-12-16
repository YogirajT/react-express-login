import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import reducers from './state';
import sagas from './sagas';
import { LOGOUT_SUCCEEDED } from './constants/ActionTypes';
import { createHashHistory } from 'history';

export const history = createHashHistory({
  hashType: 'slash',
  getUserConfirmation: (message, callback) => callback(window.confirm(message))
});

const actionSanitizer = (action) => (action.type === "heavy_object_ready") ? { type: action.type, api: 'api' } : action;

const reduxDevToolsExtensionOptions = { actionSanitizer, stateSanitizer:  (state) => state?.HeavyStateReducer.subApi ? {  ...state.HeavyStateReducer, heaveObject: '<heavyObject>' } : state };

const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSIONS_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSIONS_COMPOSE__(reduxDevToolsExtensionOptions)) || composeWithDevTools;

const sagaMiddleware = createSagaMiddleware();

const createMainReducer = (history) => combineReducers({
  router: connectRouter(history),
  ...reducers,
});

const createRootReducer = (history) => (state, action) => {
  if (action.type === LOGOUT_SUCCEEDED) return createMainReducer(history)(undefined, action);
  return createMainReducer(history)(state, action);
}


const setupStore = (preloadedState) => {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeEnhancers(
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

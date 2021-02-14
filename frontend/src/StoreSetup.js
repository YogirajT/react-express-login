import { createStore, combineReducers, applyMiddleware , compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga';
import 'bootstrap';
import { createBrowserHistory } from "history";
import 'bootstrap/dist/css/bootstrap.css';
import reducers from './state';
import sagas from './sagas';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  ...reducers,
});

const setupStore = (preloadedState) => {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
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

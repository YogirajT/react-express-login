import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import reducers from './state';
import sagas from './sagas';
const createHistory = require("history").createBrowserHistory;

const sagaMiddleware = createSagaMiddleware();
const history = createHistory();

const store = createStore(
  combineReducers({
    ...reducers,
    router: connectRouter(history),
  }),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
);

sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
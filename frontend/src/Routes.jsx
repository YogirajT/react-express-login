import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
// import { 
//     AsyncProfileView,
//     AsyncLoginView,
//     AsyncRegisterView,
//     AsyncEditView,
// } from './components/AsyncViews';
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import Edit from './components/Edit'

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={Register} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/register" component={Login} />
      <Route path="/edit" component={Edit} />
    </Switch>
  );
}
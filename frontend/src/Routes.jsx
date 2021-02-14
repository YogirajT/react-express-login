import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import Edit from './components/Edit'
import Logout from './components/Logout'


export function PrivateRoute({ component: Component, ...rest}) {
  return <Route 
    {...rest}
    render={props =>
    <React.Fragment>
      <h4 className="mx-auto mb-2 px-2 text-left text-white">
        <Link to="/logout"><span className={'Signup_Link'}>Log out</span></Link>
      </h4>
      <Component {...props} />
    </React.Fragment>}
  />
}

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <PrivateRoute path="/profile"  component={Profile} />
      <PrivateRoute path="/register" component={Register} />
      <PrivateRoute path="/edit" component={Edit} />
      <Route path="/logout" component={Logout} />
    </Switch>
  );
}
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { login } from '../actions';
import cn from 'classnames';
import { Link } from "react-router-dom";
import store from 'store2';

class Login extends Component {
  static propTypes = {
    loginUser: PropTypes.func,
    userObj: PropTypes.object,
    error: PropTypes.any,
  };

  static defaultProps = {
    error: null,
    userObj: {},
    loginUser: () => null,
  };

  state = {
    error: null,
    input: false,
  };

  handleInputChange = () => {
    this.setState({ error: null, input: true });
  }

  static getDerivedStateFromProps(props, state) {
    if(props.error && !state.input) return { error: props.error };
    return null;
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.setState({ input: false });
    this.props.loginUser(this.userName.value.trim(), this.password.value);
  };

  render() {
    const { error } = this.state;
    const { userObj } = this.props;
    if (!!store.get('auth_jwt')) return <Redirect to="/profile"></Redirect>
    return (
      <div className="loginForm__formContainer d-flex flex-column px-3 py-4">
        <div className="loginForm__form d-flex flex-column mx-auto mb-2" onSubmit={this.handleSubmitForm}>
          <h3 className={'Web_Title text-center'}>Portal</h3>
          <form className="d-flex flex-column mx-auto mb-2" onSubmit={this.handleSubmitForm}>
            <div className={cn('form-group', 'mb-4')}>
              <input
                type="text"
                className="form-control floatLabel"
                id="registerInputEmail"
                required
                placeholder="Username"
                onChange={this.handleInputChange}
                autoComplete="userName"
                ref={el => (this.userName = el)}
              />
            </div>
            <div className={cn('form-group')}>
              <input
                type="password"
                className="form-control floatLabel mt-2"
                id="registerInputPassword"
                required
                placeholder="Password"
                onChange={this.handleInputChange}
                autoComplete="current-password"
                ref={el => (this.password = el)}
                />
            </div>
            {error ? <h6 className="text-danger small">{error}</h6> : null}
            <button type="submit" className="btn btn-info loginForm__signIn">
              Sign in
            </button>   
          </form>
          <h5 className="loginForm__heading mx-auto mb-2 text-center text-white">Dont have an account?&nbsp;
            <Link to="/register"><span className={'Signup_Link'}>Sign up</span></Link>
          </h5>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userObj: state.access.user,
  error: state.access.error,
});

const mapDispatchToProps = dispatch => ({
  loginUser: (userName, password) => dispatch(login(userName, password)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Login),
);
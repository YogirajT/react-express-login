import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { login, toggleLogin } from '../actions';
import cn from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from "react-router-dom";

class Login extends Component {
  static propTypes = {
    loginUser: PropTypes.func,
    toggleLogin: PropTypes.func,
    openLogin: PropTypes.bool.isRequired,
    userObj: PropTypes.object,
    error: PropTypes.any,
  };

  static defaultProps = {
    error: null,
    userObj: {},
    loginUser: () => null,
    toggleLogin: () => null,
  };

  state = {
    error: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.userObj && nextProps.userObj.isAuthenticated) {
      this.closeModal();
    }

    if (nextProps.error) {
      this.setState({ error: nextProps.error });
    }
  }

  handleInputChange = (e) => {
    const nextState = {};
    nextState.error= null 
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  closeModal = () => {
    this.props.toggleLogin(false);
  };

  handleSubmitForm = (e) => {
    e.preventDefault();console.log(this.state.error)
    this.props.loginUser(this.userName.value, this.password.value);
  };
  
  resetError = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    return (
      <ReactCSSTransitionGroup
        transitionAppear={true}
        transitionAppearTimeout={600}
        transitionEnterTimeout={600}
        transitionLeaveTimeout={200}
        transitionName={this.props.match.path === '/' ? 'SlideIn' : 'SlideOut'}
      >
      <div className="loginForm__formContainer d-flex flex-column px-3 py-4">
        <div className="loginForm__form d-flex flex-column mx-auto mb-2" onSubmit={this.handleSubmitForm}>
          <h3 className={'Web_Title text-center'}>Portal</h3>
          <div className="form-group">
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
          </div>
          {error ? <h6 className="text-danger small">{error}</h6> : null}
          <button onClick={this.handleSubmitForm} type="submit" className="btn btn-info loginForm__signIn">
            Sign in
          </button>
          <h5 className="loginForm__heading mx-auto mb-2 text-center text-white">Dont have an account?&nbsp;
            <Link to="/register"><span className={'Signup_Link'}>Sign up</span></Link>
          </h5>
        </div>
      </div>
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  userObj: state.access.user,
  error: state.access.error,
});

const mapDispatchToProps = dispatch => ({
  loginUser: (userName, password) => dispatch(login(userName, password)),
  toggleLogin: newState => dispatch(toggleLogin(newState)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Login),
);
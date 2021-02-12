import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfile } from '../actions';
import { Link } from "react-router-dom";

class Profile extends Component {
  static propTypes = {
    userObj: PropTypes.object,
    getProfile: PropTypes.func,
  };

  static defaultProps = {
    userObj: {},
    getProfile: () => null,
  };

  state = {
    showProfile: false,
  };

  getProfile = () => {
    this.setState({ showProfile: true }, () => {
      this.props.getProfile();
    });
  };

  render() {
    const { userObj } = this.props;
    const { showProfile } = this.state;
    let profileImg = null;
    if (userObj?.isAuthenticated) {
      if (userObj?.loggedUserObj?.profileImage) {
        profileImg = `http://localhost:3000/images/${userObj?.loggedUserObj?.profileImage}.png`;
      } else {
        profileImg = "/logo512.png";
      }
    }
    return (
      <div className="HomeView m-3">
        {!userObj?.isAuthenticated && (
          <Link to="/login">
            <button type="button" className="btn btn-info loginForm__signIn">
              <span className={'Signup_Link'}>Sign up</span>
            </button>
          </Link>
        )}
        {userObj?.isAuthenticated &&
          showProfile && (
            <div className="d-flex mt-3">
              <div className="image__Circle">
                {profileImg && (
                  <img alt="Crop" style={{ maxWidth: '100%' }} src={profileImg} />
                )}
              </div>
              <div className="UserInfo d-flex flex-column justify-content-center ml-2">
                {userObj?.loggedUserObj?.userName && (
                  <div className="UserName">
                    <span>First Name: </span>
                    <strong>{userObj.loggedUserObj.firstName}</strong>
                  </div>
                )}
                {userObj?.loggedUserObj?.lastName && (
                  <div className="Email">
                    <span>Last Name: </span>
                    <strong>{userObj.loggedUserObj.lastName}</strong>
                  </div>
                )}
                {userObj?.loggedUserObj?.phone && (
                  <div className="Email">
                    <span>Phone: </span>
                    <strong>+91-{userObj.loggedUserObj.phone}</strong>
                  </div>
                )}
                {userObj?.loggedUserObj?.age && (
                  <div className="Email">
                    <span>Age: </span>
                    <strong>{userObj.loggedUserObj.age}</strong>
                  </div>
                )}
                {userObj?.loggedUserObj?.address && (
                  <div className="Email">
                    <span>Address: </span>
                    <strong>{userObj.loggedUserObj.address}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userObj: state.access.user,
});

const mapDispatchToProps = dispatch => ({
  getProfile: () => dispatch(getProfile()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
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

  componentDidMount() {
    this.getProfile();
  }
  
  render() {
    const { userObj } = this.props;
    const { showProfile } = this.state;
    let profileImg = null;
    if (userObj?.isAuthenticated) {
      if (userObj?.loggedUserObj?.user?.profileImage) {
        profileImg = `http://localhost:3000/${userObj.loggedUserObj.user.profileImage}.png`;
      } else {
        profileImg = "/logo512.png";
      }
    }
    return (
      <div className="UserInfocontainer d-flex flex-column px-3 py-4">
        {!userObj?.isAuthenticated && (
          <div className="UserInfo d-flex flex-column mx-auto mb-2">
            <Link to="/">
              <button type="button" className="btn btn-info loginForm__signIn">
                <span className={'Signup_Link'}>Sign In</span>
              </button>
            </Link>
          </div>
        )}
        {userObj?.isAuthenticated &&
          showProfile && (
            <div className="UserInfo d-flex flex-column mx-auto mb-2">
              <div className="image__Circle">
                {profileImg && (
                  <img alt="Crop" style={{ maxWidth: '100%' }} src={profileImg} />
                )}
              </div>
              <h3 className="text-center text-secondary mt-2">Profile</h3>
              <div className="d-flex flex-column mx-auto mb-2">
                {userObj?.loggedUserObj?.user?.userName && (
                  <div className="UserName">
                    <span>First Name: </span>
                    <strong>{userObj.loggedUserObj.user.firstName}</strong>
                  </div>
                )}
                {userObj?.loggedUserObj?.user?.lastName && (
                  <div className="Email">
                    <span>Last Name: </span>
                    <strong>{userObj.loggedUserObj.user.lastName}</strong>
                  </div>
                )}
                {userObj?.loggedUserObj?.user?.phone && (
                  <div className="Email">
                    <span>Phone: </span>
                    <strong>+91-{userObj.loggedUserObj.user.phone}</strong>
                  </div>
                )}
                {userObj?.loggedUserObj?.user?.age && (
                  <div className="Email">
                    <span>Age: </span>
                    <strong>{userObj.loggedUserObj.user.age}</strong>
                  </div>
                )}
                {userObj?.loggedUserObj?.user?.address && (
                  <div className="Email">
                    <span>Address: </span>
                    <strong>{userObj.loggedUserObj.user.address}</strong>
                  </div>
                )}
              </div>
              <Link to="/edit" style={{ textAlign: 'center' }}>
                <button className="btn btn-info mx-auto mb-2 text-center loginForm__signIn">
                  Edit
                </button>
              </Link>
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
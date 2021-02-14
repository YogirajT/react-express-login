import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { profile } from '../actions';
import { Link } from "react-router-dom";

class Profile extends Component {
  static propTypes = {
    userObj: PropTypes.object,
    profile: PropTypes.func,
  };

  static defaultProps = {
    userObj: {},
    profile: () => null,
  };

  state = {
    showProfile: false,
  };

  profile = () => {
    this.setState({ showProfile: true }, () => {
      this.props.profile();
    });
  };

  componentDidMount() {
    this.profile();
  }
  
  render() {
    const { userObj } = this.props;
    const { showProfile } = this.state;
    let profileImg = null;
    if (userObj?.isAuthenticated) {
      if (userObj?.loggedUserObj?.profileImage) {
        profileImg = `http://localhost:3000/${userObj.loggedUserObj.profileImage}.png`;
      } else {
        profileImg = "/logo512.png";
      }
    }
    return (
      <div className="UserInfocontainer d-flex flex-column px-3 py-4">
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
  profile: () => dispatch(profile()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
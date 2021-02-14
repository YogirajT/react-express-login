import { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../actions';
import 'react-image-crop/dist/ReactCrop.css';
import Loader from "react-loader-spinner";

const Loading = () => (
    <div style={{ 
      width: "100vw",
      height: "100vh",
      display: "flex",
      position:"absolute",
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center"
    }}><Loader type="ThreeDots" color="#00BFFF" height={80} width={80} /></div>
);


class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func,
    error: PropTypes.any,
  };

  static defaultProps = {
    error: null,
    logout: () => null,
  };

  state = {
    error: null,
    showProfile: false,
  };

  componentDidMount() {
      setTimeout(() => this.props.logout(), 1000);
  }
  
  render() {
    return (
      <div className="Web_Title text-center mt-5">
        <h3>Logging out</h3>
        <Loading />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.access.error,
});

const mapDispatchToProps = dispatch => ({
  logout: (obj) => dispatch(logout(obj)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Logout),
);
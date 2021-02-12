import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { register, toggleRegister } from '../actions';
import cn from 'classnames';
import { Link } from "react-router-dom";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactCrop from 'react-image-crop';
import ReactModal from 'react-modal';
import 'react-image-crop/dist/ReactCrop.css';


class Register extends Component {
  static propTypes = {
    registerUser: PropTypes.func,
    toggleRegister: PropTypes.func,
    openRegister: PropTypes.bool.isRequired,
    userObj: PropTypes.object,
    error: PropTypes.any,
  };

  static defaultProps = {
    error: null,
    userObj: {},
    registerUser: () => null,
    toggleRegister: () => null,
  };

  state = {
    error: null,
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: 1,
    },
    showModal: false,
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
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  closeModal = () => {
    this.props.toggleRegister(false);
  };

  handleSubmitForm = (e) => {
    e.preventDefault();
    if(this.password.value !== this.rePassword.value) {
      this.setState({ error: new Error("Passwords in both fields did not match") });
      return;
    }
    this.props.registerUser({ 
      userName: this.userName.value,
      password: this.password.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      address: this.address.value,
      age: this.age.value,
      phone: this.phone.value,
      profileImage: null 
    });

  };

  handleFocusInput = (e) => {
    this.resetError();
  };

  resetError = () => {
    if (this.errorElement && this.errorElement.length > 0) {
      this.setState({ error: null });
    }
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({ src: reader.result, showModal: true })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/png');
    });
  }

  render() {
    const { error, crop, croppedImageUrl, src, showModal } = this.state;

    const errorMessage = error ? error.message : '';

    return (
      <ReactCSSTransitionGroup
        transitionAppear={true}
        transitionAppearTimeout={600}
        transitionEnterTimeout={600}
        transitionLeaveTimeout={200}
        transitionName={this.props.match.path === '/register' ? 'SlideIn' : 'SlideOut'}
      >
        <ReactModal 
           isOpen={showModal}
           ariaHideApp={false}
           contentLabel="Inline Styles Modal Example"
           className={"d-flex flex-column mx-auto mb-2"}
           style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,0.5)",
                maxWidth: "100%",
                maxHeight: "100%"
              },
              content: {
                color: 'lightsteelblue',
                maxWidth: "100%",
                maxHeight: "100%"
              }
            }}
        >
          {src && (<ReactCrop
              src={src}
              crop={crop}
              ruleOfThirds
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          )}
          <button onClick={this.handleCloseModal} className="btn btn-info loginForm__signIn">Close</button>
        </ReactModal>
      <div className="registrationForm__formContainer d-flex flex-column px-3 py-4">
        <form className="registrationForm__form d-flex flex-column mx-auto mb-2" onSubmit={this.handleSubmitForm}>
          <h3 className={'text-center text-secondary mt-2'}>Register</h3>
          <div className="form-group">
            <div className="image__Circle">
              {croppedImageUrl && (
                <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
              )}
            </div>
            <div className={cn('file__input')}>
              <input
                type="file"
                onChange={this.onSelectFile}
                className="form-control floatLabel"
                id="registerInputImage"
                placeholder="Image"
              />
            </div>
            <div className={cn('form-group')}>
              <input
                type="text"
                className="form-control floatLabel"
                id="registerInputUserName"
                required
                placeholder="Username"
                onChange={this.handleInputChange}
                autoComplete="userName"
                maxLength="50"
                ref={el => (this.userName = el)}
              />
            </div>
            <div className={cn('form-group')}>
              <input
                type="password"
                maxLength="16"
                className="form-control floatLabel mt-2"
                id="registerInputPassword"
                required
                placeholder="Password"
                onChange={this.handleInputChange}
                ref={el => (this.password = el)}
                />
            </div>
            <div className={cn('form-group')}>
              <input
                type="password"
                className="form-control floatLabel mt-2"
                id="registerInputRetypePassword"
                required
                placeholder="Retype Password"
                onChange={this.handleInputChange}
                ref={el => (this.rePassword = el)}
                />
            </div>
            <div className={cn('form-group')}>
              <input
                type="text"
                maxLength="50"
                className="form-control floatLabel"
                id="registerInputFirstName"
                required
                placeholder="First Name"
                onChange={this.handleInputChange}
                ref={el => (this.firstName = el)}
              />
            </div>
            <div className={cn('form-group')}>
              <input
                type="text"
                maxLength="50"
                className="form-control floatLabel"
                id="registerInputLastName"
                required
                placeholder="Last Name"
                onChange={this.handleInputChange}
                ref={el => (this.lastName = el)}
              />
            </div>
            <div className={cn('form-group')}>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="validatedInputGroupPrepend">+91</span>
                </div>
                <input
                  type="text"
                  className="form-control floatLabel"
                  id="registerInputPhone"
                  required
                  maxLength="10"
                  minLength="10"
                  placeholder="Phone"
                  onChange={this.handleInputChange}
                  ref={el => (this.phone = el)}
                />
              </div>
            </div>
            <div className={cn('form-group')}>
              <input
                type="number"
                className="form-control floatLabel"
                id="registerInputAge"
                required
                min="13"
                max="120"
                placeholder="Age"
                onChange={this.handleInputChange}
                ref={el => (this.age = el)}
              />
            </div>
            <div className={cn('form-group')}>
              <textarea
                className="form-control floatLabel"
                id="registerInputAddress"
                required
                maxLength="200"
                placeholder="Address"
                onChange={this.handleInputChange}
                ref={el => (this.address = el)}
              />
            </div>
          </div>
          {error ? <h6 className="text-danger small">{error}</h6> : null}
          <button type="submit" className="btn btn-info loginForm__signIn">
            Submit
          </button>
          <h5 className="loginForm__heading mx-auto mb-2 text-center text-white">Already have an account? 
          <Link to="/"><span className={'Signup_Link'}>Sign in</span></Link></h5>
        </form>
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
  loginUser: (userName, password) => dispatch(register(userName, password)),
  toggleLogin: newState => dispatch(toggleRegister(newState)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Register),
);
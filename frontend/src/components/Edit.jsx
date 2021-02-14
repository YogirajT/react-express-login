import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { edit, profile } from '../actions';
import cn from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactCrop from 'react-image-crop';
import ReactModal from 'react-modal';
import 'react-image-crop/dist/ReactCrop.css';


class Edit extends Component {
  static propTypes = {
    editProfile: PropTypes.func,
    userObj: PropTypes.object,
    error: PropTypes.any,
  };

  static defaultProps = {
    error: null,
    userObj: {},
    editProfile: () => null,
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
    showProfile: false
  };

  componentDidMount() {
    this.profile();
  }
  
  handleSubmitForm = (e) => {
    e.preventDefault();
    const age = parseInt(this.age.value, 10);
    const data = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      address: this.address.value,
      age,
      phone: this.phone.value,
    }
    if(this.state.croppedImageUrl) data.profileImage =  this.state.croppedImageUrl 
    this.props.editProfile(data)
    
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
      resolve(canvas.toDataURL());
    });
  }

  profile = () => {
    this.setState({ showProfile: true }, () => {
      this.props.profile();
    });
  };

  render() {
    const { userObj } = this.props;
    const { error, crop, croppedImageUrl, src, showModal } = this.state;

    let profileImg = null;
    if (userObj?.isAuthenticated) {
      if (userObj?.loggedUserObj?.profileImage) {
        profileImg = `http://localhost:3000/${userObj.loggedUserObj.profileImage}.png`;
      } else {
        profileImg = "/logo512.png";
      }
    }

    const errorMessage = error ? error.message : '';

    return (
      <ReactCSSTransitionGroup
        transitionAppear={true}
        transitionAppearTimeout={600}
        transitionEnterTimeout={600}
        transitionLeaveTimeout={200}
        transitionName={this.props.match.path === '/edit' ? 'SlideIn' : 'SlideOut'}
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
          <button onClick={this.handleCloseModal} className="btn btn-info loginForm__signIn">Done</button>
        </ReactModal>
      {userObj?.isAuthenticated && (
      <div className="registrationForm__formContainer d-flex flex-column px-3 py-4">
        <form className="registrationForm__form d-flex flex-column mx-auto mb-2" onSubmit={this.handleSubmitForm}>
          <h3 className={'text-center text-secondary mt-2'}>Edit</h3>
          <div className="form-group">
            <div className="image__Circle">
                <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl || profileImg || '/logo512.png'} />
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
                maxLength="50"
                className="form-control floatLabel"
                id="registerInputFirstName"
                required
                placeholder="First Name"
                ref={el => (this.firstName = el)}
                defaultValue={userObj?.loggedUserObj?.firstName}
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
                ref={el => (this.lastName = el)}
                defaultValue={userObj?.loggedUserObj?.lastName}
              />
            </div>
            <div className={cn('form-group')}>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="validatedInputGroupPrepend">+91</span>
                </div>
                <input
                  type="text"
                  className="form-control floatLabel"
                  id="registerInputPhone"
                  required
                  maxLength="10"
                  minLength="10"
                  placeholder="Phone"
                  ref={el => (this.phone = el)}
                  defaultValue={userObj?.loggedUserObj?.phone}
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
                ref={el => (this.age = el)}
                defaultValue={userObj?.loggedUserObj?.age}
              />
            </div>
            <div className={cn('form-group')}>
              <textarea
                className="form-control floatLabel"
                id="registerInputAddress"
                required
                maxLength="200"
                placeholder="Address"
                ref={el => (this.address = el)}
                defaultValue={userObj?.loggedUserObj?.address}
              />
            </div>
          </div>
          {error ? <h6 className="text-danger small">{error}</h6> : null}
          <button type="submit" className="btn btn-info loginForm__signIn">
            Save
          </button>
        </form>
      </div>)}
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  userObj: state.access.user,
  error: state.access.error,
});

const mapDispatchToProps = dispatch => ({
  editProfile: (obj) => dispatch(edit(obj)),
  profile: () => dispatch(profile()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Edit),
);
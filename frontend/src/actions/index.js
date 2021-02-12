
import * as ActionTypes from '../constants/ActionTypes';


export const register = ({ 
  userName,
  password,
  firstName,
  lastName,
  address,
  age,
  phone,
  profileImage 
}) => ({
  type: ActionTypes.REGISTRATION_REQUESTED,
  userName,
  password,
  firstName,
  lastName,
  address,
  age,
  phone,
  profileImage,
});

export const login = (userName, password) => ({
  type: ActionTypes.LOGIN_REQUESTED,
  userName,
  password,
});

export const edit = ({
  firstName,
  lastName,
  age,
  address,
  profileImage
}) => ({
  type: ActionTypes.EDIT_REQUESTED,
  firstName,
  lastName,
  age,
  address,
  profileImage
});

export const getProfile = () => ({
  type: ActionTypes.PROFILE_REQUESTED,
});

export const logout = () => ({
    type: ActionTypes.LOGOUT_REQUESTED,
});

export const toggleLogin = newState => ({
  type: ActionTypes.TOGGLE_LOGIN_REQUESTED,
  newState,
});

export const toggleRegister = newState => ({
  type: ActionTypes.TOGGLE_REGISTER_REQUESTED,
  newState,
});

export const toggleEdit = newState => ({
  type: ActionTypes.TOGGLE_EDIT_REQUESTED,
  newState,
});

export const toggleProfile = () => ({
  type: ActionTypes.TOGGLE_PROFILE_REQUESTED,
});
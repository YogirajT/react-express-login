
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
  phone,
  profileImage
}) => ({
  type: ActionTypes.EDIT_REQUESTED,
  firstName,
  lastName,
  age,
  address,
  phone,
  profileImage
});

export const profile = () => ({
  type: ActionTypes.PROFILE_REQUESTED,
});

export const logout = () => ({
    type: ActionTypes.LOGOUT_REQUESTED,
});
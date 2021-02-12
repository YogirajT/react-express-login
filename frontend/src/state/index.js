import * as ActionTypes from '../constants/ActionTypes';
import * as store from 'store2'; 

const initialState = {
  user: {
    isAuthenticated: !!store.get('jwt_auth'),
    loggedUserObj: store.get('cached_user'),
  },
  error: null,
};

const access = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCEEDED: {
      return {
        ...state,
        error: null,
      };
    }
    case ActionTypes.REGISTRATION_SUCCEEDED: {
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: true,
          loggedUserObj: action.user,
        },
        error: null,
      };
    }
    case ActionTypes.EDIT_SUCCEEDED: {
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: true,
          loggedUserObj: action.user,
        },
        error: null,
      };
    }
    case ActionTypes.LOGIN_FAILED: {
      return {
        ...state,
        error: action.error,
      };
    }
    case ActionTypes.REGISTRATION_FAILED:
    case ActionTypes.EDIT_FAILED:
    case ActionTypes.LOGOUT_SUCCEEDED: {
      return {
        ...state,
        user: {
          isAuthenticated: false,
        },
        error: null,
      };
    }
    default:
      return state;
  }
}

const toggleRoutes = (state = { 
  login: false, edit: false, register: false, login: false, image: false 
}, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_EDIT_SUCCEEDED:
      return { edit: action.newState };
    case ActionTypes.TOGGLE_LOGIN_SUCCEEDED:
      return { login: action.newState };
    case ActionTypes.TOGGLE_REGISTER_SUCCEEDED:
      return { register: action.newState };
    case ActionTypes.IMAGE_EDIT_SUCCEEDED:
      return { image: action.newState };
    default:
      return state;
  }
}

export default {
  access,
  toggleRoutes,
};
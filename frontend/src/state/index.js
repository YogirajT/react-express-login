import * as ActionTypes from '../constants/ActionTypes';
import * as store from 'store2'; 

const initialState = {
  user: {
    isAuthenticated: !!store.get('auth_jwt'),
    loggedUserObj: null,
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
    case ActionTypes.PROFILE_SUCCEEDED: {
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
          edited: true,
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

export default {
  access
};
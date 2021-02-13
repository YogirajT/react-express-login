import { all, fork, put, call, takeLatest } from 'redux-saga/effects';
import store from 'store2';
import * as ActionTypes from '../constants/ActionTypes';
import { get, post } from '../utils';

function* login(action) {
  const { userName, password } = action;
  try {
    const response = yield call(
      post,
      '/login',
      { userName, password },
    );
    store.set('auth_jwt', response?.data?.token);
    yield put({ type: ActionTypes.LOGIN_SUCCEEDED });
  } catch (error) {
    yield put({ type: ActionTypes.LOGIN_FAILED, error: error.message });
  }
}

function* watchLogin() {
    yield takeLatest(ActionTypes.LOGIN_REQUESTED, login);
}

function* registration(action) {
    const { 
        userName,
        password,
        firstName,
        lastName,
        age,
        address,
        phone,
        profileImage
    } = action;
    try {
      const response = yield call(
        post,
        '/signup',
        { 
            userName,
            password,
            firstName,
            lastName,
            age,
            address,
            phone,
            profileImage
        },
      );
      store.set('auth_jwt', response.token);
      yield put({ type: ActionTypes.REGISTRATION_SUCCEEDED });
    } catch (error) {
      yield put({ type: ActionTypes.REGISTRATION_FAILED, error: 'Could not create profile. Please read validation messages' });
    }
}

function* watchRegistration() {
    yield takeLatest(ActionTypes.REGISTRATION_REQUESTED, registration);
}

function* editProfile(action) {
    const jwt = store.get('auth_jwt');
    const { 
        firstName,
        lastName,
        age,
        address,
        phone,
        profileImage
    } = action;
    try {
      const response = yield call(
        post,
        '/user/profile',
        { 
            firstName,
            lastName,
            age,
            address,
            phone,
            profileImage
        },
        {},
        jwt,
      );
      yield put({ type: ActionTypes.EDIT_SUCCEEDED, user: response, error: null });
    } catch (error) {
      yield put({ type: ActionTypes.EDIT_FAILED, error: 'Could not update profile.' });
    }
}

function* watchEditProfile() {
    yield takeLatest(ActionTypes.EDIT_REQUESTED, editProfile);
}

function* logout() {
  try {
    store.remove('auth_jwt');
    yield put({ type: ActionTypes.LOGOUT_SUCCEEDED });
  } catch (error) {
    yield put({ type: ActionTypes.LOGOUT_FAILED, error: error.response.data });
  }
}

function* watchLogout() {
  yield takeLatest(ActionTypes.LOGOUT_REQUESTED, logout);
}

function* getProfile() {
  const jwt = store.get('auth_jwt');
  try {
    const response = yield call(
      get,
      '/user/profile',
      {},
      jwt
    );
    yield put({ type: ActionTypes.PROFILE_SUCCEEDED, user: response });
  } catch (error) {
    yield put({ type: ActionTypes.PROFILE_FAILED, error: 'Could not load profile. Please try logging in again.' });
  }
}

function* watchGetProfile() {
  yield takeLatest(ActionTypes.PROFILE_REQUESTED, getProfile);
}

function* toggleProfile(action) {
  const { newState } = action;
  if (!newState) {
    yield put({ type: ActionTypes.EDIT_FAILED, error: null });
    yield put({ type: ActionTypes.REGISTRATION_FAILED, error: null });
    yield put({ type: ActionTypes.LOGIN_FAILED, error: null });
  }
  yield put({ type: ActionTypes.TOGGLE_PROFILE_SUCCEEDED, newState });
}

function* watchToggleProfile() {
  yield takeLatest(ActionTypes.TOGGLE_PROFILE_REQUESTED, toggleProfile);
}

function* toggleEdit(action) {
  const { newState } = action;
  if (!newState) {
    yield put({ type: ActionTypes.PROFILE_FAILED, error: null });
    yield put({ type: ActionTypes.REGISTRATION_FAILED, error: null });
    yield put({ type: ActionTypes.LOGIN_FAILED, error: null });
  }
  yield put({ type: ActionTypes.TOGGLE_EDIT_SUCCEEDED, newState });
}

function* watchToggleEdit() {
  yield takeLatest(ActionTypes.TOGGLE_EDIT_REQUESTED, toggleEdit);
}

function* toggleRegister(action) {
  const { newState } = action;
  if (!newState) {
    yield put({ type: ActionTypes.PROFILE_FAILED, error: null });
    yield put({ type: ActionTypes.EDIT_FAILED, error: null });
    yield put({ type: ActionTypes.LOGIN_FAILED, error: null });
  }
  yield put({ type: ActionTypes.TOGGLE_REGISTER_SUCCEEDED, newState });
}

function* watchToggleRegister() {
  yield takeLatest(ActionTypes.TOGGLE_REGISTER_REQUESTED, toggleRegister);
}

function* toggleLogin(action) {
  const { newState } = action;
  if (!newState) {
    yield put({ type: ActionTypes.PROFILE_FAILED, error: null });
    yield put({ type: ActionTypes.EDIT_FAILED, error: null });
    yield put({ type: ActionTypes.REGISTRATION_FAILED, error: null });
  }
  yield put({ type: ActionTypes.TOGGLE_LOGIN_SUCCEEDED, newState });
}

function* watchToggleLogin() {
  yield takeLatest(ActionTypes.TOGGLE_LOGIN_REQUESTED, toggleLogin);
}

export default function* rootSaga() {
  yield all([
    fork(watchLogin),
    fork(watchGetProfile),
    fork(watchLogout),
    fork(watchRegistration),
    fork(watchEditProfile),
    fork(watchToggleProfile),
    fork(watchToggleEdit),
    fork(watchToggleRegister),
    fork(watchToggleLogin),
  ]);
}
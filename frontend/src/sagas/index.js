import { all, fork, put, call, takeLatest, takeLeading } from 'redux-saga/effects';
import store from 'store2';
import * as ActionTypes from '../constants/ActionTypes';
import { get, post } from '../utils';
import { push } from 'connected-react-router';

function* login(action) {
  const { userName, password } = action;
  try {
    const response = yield call(
      post,
      '/login',
      { userName, password },
    );
    store.set('auth_jwt', response?.token);
    yield put({ type: ActionTypes.LOGIN_SUCCEEDED });
    yield put(push('/profile'));
  } catch (error) {
    yield put({ type: ActionTypes.LOGIN_FAILED, error: error.message });
  }
}

function* watchLogin() {
    yield takeLeading(ActionTypes.LOGIN_REQUESTED, login);
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
      yield put(push('/'));
    } catch (error) {
      yield put({ type: ActionTypes.REGISTRATION_FAILED, error: 'Could not create profile. Please read validation messages' });
    }
}

function* watchRegistration() {
    yield takeLatest(ActionTypes.REGISTRATION_REQUESTED, registration);
}

function* watchEditProfile() {
    yield takeLatest(ActionTypes.EDIT_REQUESTED, editProfile);
}

function* logout() {
  try {
    store.remove('auth_jwt');
    yield put({ type: ActionTypes.LOGOUT_SUCCEEDED });
    yield put(push('/'));
  } catch (error) {
    yield put({ type: ActionTypes.LOGOUT_FAILED, error: error.response.data });
  }
}

function* watchLogout() {
  yield takeLatest(ActionTypes.LOGOUT_REQUESTED, logout);
}

function* profile() {
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
    store.remove('auth_jwt');
    yield put(push('/'));
  }
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
    yield put({ type: ActionTypes.EDIT_SUCCEEDED, user: response });
    yield put(push('/profile'));
  } catch (error) {
    yield put({ type: ActionTypes.EDIT_FAILED, error: 'Could not update profile.' });
    store.remove('auth_jwt');
    yield put(push('/'));
  }
}

function* watchProfile() {
  yield takeLatest(ActionTypes.PROFILE_REQUESTED, profile);
}


export default function* rootSaga() {
  yield all([
    fork(watchLogin),
    fork(watchProfile),
    fork(watchRegistration),
    fork(watchEditProfile),
    fork(watchLogout),
  ]);
}
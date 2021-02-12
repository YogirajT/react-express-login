import React from 'react';
import Loadable from 'react-loadable';
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

export const AsyncEditView = Loadable({
  loader: () => import('./Edit'),
  loading: () => <Loading />,
});

export const AsyncProfileView = Loadable({
  loader: () => import('./Profile'),
  loading: () => <Loading />,
});

export const AsyncLoginView = Loadable({
  loader: () => import('./Login'),
  loading: () => <Loading />,
});

export const AsyncRegisterView = Loadable({
  loader: () => import('./Register'),
  loading: () => <Loading />,
});
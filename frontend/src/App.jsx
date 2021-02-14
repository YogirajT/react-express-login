import React, { Component } from 'react';
import Routes from './Routes';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import './App.css';

export class App extends Component {
  state = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { error, errorInfo } = this.state;
    return (
      <React.Fragment>
        {!error && <Routes />}
        {error && (
          <div className="Web_Title text-center mt-5">
            <h3>Something went wrong. Please reload the page.</h3>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default App;
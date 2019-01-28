import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import SignupPage from './components/SignupPage';
import SigninPage from './components/SigninPage';

class App extends Component {
  render() {

    if (this.props.location.pathname === '/') {

      if (localStorage.token)
        this.props.history.push('/users');

      else
        this.props.history.push('/signin');

    }

    return (
      <div className="App">

        <Route
          exact
          path='/signup'
          render={props => <SignupPage {...props} />}
        />

        <Route
          exact
          path='/signin'
          render={props => <SigninPage {...props} />}
        />

      </div>
    );
  }
}

export default withRouter(App);

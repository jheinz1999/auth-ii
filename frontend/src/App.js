import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import SignupPage from './components/SignupPage';

class App extends Component {
  render() {

    if (this.props.location.pathname === '/')
      this.props.history.push('/signin');

    return (
      <div className="App">

        <Route
          exact
          path='/signup'
          render={props => <SignupPage {...props} />}
        />

      </div>
    );
  }
}

export default withRouter(App);

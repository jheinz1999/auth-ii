import React from 'react';
import axios from 'axios';

export default class UsersPage extends React.Component {

  state = {

    users: null,
    signedIn: null,
    redirectLength: 5

  }

  componentDidMount() {

    if (!localStorage.token) {

      this.setState({signedIn: false});

    }

    else {

      const options = {
        headers: {
          Authorization: localStorage.token
        }
      }

      axios.get('http://localhost:5000/api/users', options)
        .then(res => this.setState({
          signedIn: true,
          users: res.data
        }))
        .catch(err => {

          this.setState({signedIn: false});
          setTimeout(this.redirect, 1000);

        });

    }

  }

  redirect = () => {

    this.setState({redirectLength: this.state.redirectLength - 1}, () => {

      if (this.state.redirectLength === 0)
        this.props.history.push('/signin');

      else
        setTimeout(this.redirect, 1000);

    });

  }

  render() {

    const { signedIn, users } = this.state;

    if (signedIn) {

      return (

        <div className='users'>

          {users.map(user => <h2>{user.username}</h2>)}

        </div>

      );

    }

    else if (signedIn === null) {

      return <h1>Signing in...</h1>

    }

    else {

      return <h1>You are not logged in. Redirecting you to login page in {this.state.redirectLength}</h1>

    }

  }

}

import React from 'react';
import axios from 'axios';

export default class SignupPage extends React.Component {

  state = {

    username: '',
    password: '',
    department: 'Marketing',
    errorMsg: null

  }

  handleChange = e => {

    this.setState({
      [e.target.name]: e.target.value,
      errorMsg: null
    });

  }

  handleSubmit = e => {

    e.preventDefault();

    const { username, password, department } = this.state;

    axios.post('http://localhost:5000/api/register', { username, password, department })
      .then(res => {

        const { user, token } = res.data;

        localStorage.user = user;
        localStorage.token = token;

        this.props.history.push('/users');

      })
      .catch(err => this.setState({errorMsg: err.response.data.message}))

  }

  render() {

    return (

      <form className='signup-form' onSubmit={this.handleSubmit}>

        <input
          type='text'
          name='username'
          placeholder='username'
          value={this.state.username}
          onChange={this.handleChange}
          required
        />

        <br />

        <input
          type='password'
          name='password'
          placeholder='password'
          value={this.state.password}
          onChange={this.handleChange}
          required
        />

        <br />

        <select
          name='department'
          value={this.state.department}
          onChange={this.handleChange}
        >

          <option value='Marketing'>Marketing</option>
          <option value='Administration'>Administration</option>
          <option value='QA'>QA</option>
          <option value='Tech'>Tech</option>

        </select>

        <br />

        {this.state.errorMsg && <p>{this.state.errorMsg}</p>}

        <button>Sign Up</button>

      </form>

    );

  }

}

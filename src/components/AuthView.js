import React, { Component } from 'react';
import { connect } from "react-redux";
import { login, signup } from "../actions/Actions";

import { Redirect } from "react-router-dom";

class AuthView extends Component {
  constructor(props) {
    super(props);

    let login = false;

    if (props.match.url == "/login") {
      login = true;
    }

    // Any number of links can be added here
    this.state = {
      login: login,
      email: '',
      user: '',
      password: ''
    }
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit = (event) => {
    event.preventDefault();

    if (this.state.login) {
      this.props.login({email: this.state.email, password: this.state.password});
    }
    else {
      this.props.signup({email: this.state.email, password: this.state.password, username: this.state.user});
    }
  }

  toggleMode = (event) => {
    event.preventDefault();
    this.setState({
      login: !this.state.login,
      user: ''
    });
  }

  render() {

      return this.props.redirect ? (<Redirect to="/" />) :
      (
        <div className='auth-container'>
          <div className='auth'>
            <a href='./'>Dismiss.</a>
            {this.state.login ? <h1>Login</h1> : <h1>Sign up</h1> }
            <form onSubmit={this.onSubmit}>
              {this.state.login ? '' : <input placeholder='Username...' name='user' value={this.state.user} onChange={this.onChange} /> }
              <input placeholder='Email...' name='email' value={this.state.email} onChange={this.onChange} />
              <input placeholder='Password...' name='password' value={this.state.password} onChange={this.onChange} />
              {this.state.login ? <button>Login</button> : <button>Signup</button> }
            </form>

            Not what you're lookin' for? {this.state.login ? <a href='./signup' >Sign up.</a> : <a href='./login' >Login</a>}
          </div>
        </div>
      )
  }
}

function mapStateToProps(state) {
  return {
    redirect: state.redirect,
    email: state.email,
    password: state.password,
    user: state.user
  };
}

export default connect(mapStateToProps, { login, signup })(AuthView);

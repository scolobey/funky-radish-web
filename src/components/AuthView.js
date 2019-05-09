import React, { Component } from 'react';
import { connect } from "react-redux";
import { login, signup } from "../actions/Actions";

class AuthView extends Component {
  constructor(props) {
    super(props);

    let loginProxy = false;

    if (props.login == null) {
      loginProxy = true;
    }

    // Any number of links can be added here
    this.state = {
      login: loginProxy,
      email: '',
      username: '',
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
      this.props.signup({email: this.state.email, password: this.state.password, username: this.state.username});
    }
  }

  toggleMode = (event) => {
    event.preventDefault();
    this.setState({
      login: !this.state.login,
      username: ''
    });
  }

  render() {
    return (
      <div className='auth-container'>
        <div className='auth'>
          <a href='./'>Dismiss.</a>
          {this.state.login ? <h1>Login</h1> : <h1>Sign up</h1> }
          <form onSubmit={this.onSubmit}>
            {this.state.login ? '' : <input placeholder='Username...' name='username' value={this.state.username} onChange={this.onChange} /> }
            <input placeholder='Email...' name='email' value={this.state.email} onChange={this.onChange} />
            <input placeholder='Password...' name='password' value={this.state.password} onChange={this.onChange} />
            {this.state.login ? <button>Login</button> : <button>Signup</button> }
          </form>

          Not what you're lookin' for? {this.state.login ? <a onClick={this.toggleMode}>Sign up.</a> : <a onClick={this.toggleMode}>Login</a>}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    email: state.email,
    password: state.password,
    username: state.username
  };
}

export default connect(mapStateToProps, { login, signup })(AuthView);

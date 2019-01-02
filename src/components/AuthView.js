import React, { Component } from 'react';

class AuthView extends Component {
  constructor(props) {
    super(props);
    // Any number of links can be added here
    this.state = {
      login: props.login || false,
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
    console.log(this.state.username);
    console.log(this.state.email);
    console.log(this.state.password);
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

export default AuthView;

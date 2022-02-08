import React, { Component } from 'react';
import { connect } from "react-redux";
import { login, signup, resendVerification, sendPasswordResetEmail } from "../actions/Actions";

// import { RealmApolloContext } from "../graphql/RealmApolloProvider";

class AuthView extends Component {
  constructor(props) {
    super(props);

    let login = false;

    if (props.match.url === "/login") {
      login = true;
    }

    // Any number of links can be added here
    this.state = {
      login: login,
      email: '',
      password: ''
    }
  }

  clearFields = (event) => {
    this.setState({ email: "", password: "" })
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  resendVerification = (event) => {
    event.preventDefault();
    console.log("Resending verification")

    if(this.state.email.length > 0 && this.state.email.includes('@')) {
      var emailPrompt = prompt("Is this your full email?", this.state.email);

      if (emailPrompt != null && emailPrompt.length > 0) {
        this.props.resendVerification(emailPrompt)
      }

      this.clearFields()
    }
    else {
      var emailPrompt = prompt("What's your email?");

      if (emailPrompt != null && emailPrompt.length > 0) {
        this.props.resendVerification(emailPrompt)
      }

      this.clearFields()
    }
  }

  forgotPassword = (event) => {
    event.preventDefault();
    console.log("clicked forgot password")

    if(this.state.email.length > 0 && this.state.email.includes('@')) {
      var emailPrompt = prompt("Is this your full email?", this.state.email);

      if (emailPrompt != null && emailPrompt.length > 0) {
        console.log(emailPrompt)
        this.props.sendPasswordResetEmail(emailPrompt)
      }
    }
    else {
      var emailPrompt = prompt("What's your email?");

      if (emailPrompt != null && emailPrompt.length > 0) {
        this.props.sendPasswordResetEmail(emailPrompt)
      }
    }

    this.clearFields()
  }

  onSubmit = (event) => {
    event.preventDefault();

    if (this.state.login) {
      this.props.login({email: this.state.email, password: this.state.password});
    }
    else {
      this.props.signup({email: this.state.email, password: this.state.password});
    }
  }

  toggleMode = (event) => {
    event.preventDefault();

    this.setState({
      login: !this.state.login
    });
  }

  render() {
      return (
        <div className='auth-container'>
          <div className='auth'>
            <a href='./'>Dismiss</a>
            {this.state.login ? <h1>Login</h1> : <h1>Sign up</h1> }
            <form onSubmit={this.onSubmit}>
              <input placeholder='Email...' name='email' value={this.state.email} onChange={this.onChange} />
              <input type='password' placeholder='Password...' name='password' value={this.state.password} onChange={this.onChange} />
              {this.state.login ? <button>Login</button> : <button>Signup</button> }
            </form>

            <div className='auth_options_header'>Not what you're lookin' for?</div>
            <br></br>

            {this.state.login ? <a className='auth_options' href='./signup' >Sign Up</a> : <a className='auth_options' href='./login' >Login</a>} •
             <a className='auth_options' onClick={this.resendVerification} >Resend Verification</a> •
             <a className='auth_options' onClick={this.forgotPassword}>Forgot Password?</a>
          </div>
        </div>
      )
  }
}

// AuthView.contextType = RealmApolloContext;

function mapStateToProps(state) {
  return {
    email: state.email,
    password: state.password
  };
}

export default connect(mapStateToProps, { login, signup, resendVerification, sendPasswordResetEmail })(AuthView);

import React, { Component } from 'react';
import Auth from '../Auth'
import { BrowserRouter as Link } from "react-router-dom";

const auth = new Auth();

class Menu extends Component {
  constructor(props) {
    super(props);

    let authUser = auth.getUser()
    let user = ""
    if (authUser != "undefined") {
      user = authUser;
    }

    this.state = {
      user: user
    }

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event) {
    event.preventDefault();

    console.log("clickety click");
    this.setState({user: ""});
    auth.logout();
  }

  renderUserState() {
    if (this.state.user && this.state.user.length > 0) {
        return (
          [
            <li key='1'><h2>{this.state.user}</h2></li>,
            <li key='2'><a href='/' onClick={this.handleLogout} >Logout</a></li>
          ]
        );
    }
    else {
      return(
        [
          <li key='3'><a href='./login'>Login</a></li>,
          <li key='4'><a href='./signup'>Signup</a></li>
        ]
      )
    }

  }

  render() {
    return (
      <div className={this.props.open ? 'open' : ''} id='menu'>
        <ul>
          {this.renderUserState()}
          <li key='5'>
            <a href='./roadmap'>Road Map</a>
          </li>
          <li key='6'>
            <a href='./about'>About</a>
          </li>
          <li key='7'>
            <a href='./privacy'>Privacy</a>
          </li>
        </ul>
      </div>
    )
  }
}

export default Menu;

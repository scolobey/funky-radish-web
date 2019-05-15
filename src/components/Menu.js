import React, { Component } from 'react';
import { connect } from "react-redux";
import { setUsername, recipesLoaded } from "../actions/Actions";

import Auth from '../Auth'

const auth = new Auth();

class Menu extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event) {
    event.preventDefault();

    let recipes = new Array();
    this.props.setUsername("");
    this.props.recipesLoaded(recipes);
    auth.logout();
  }

  renderUserState() {
    if (this.props.user && this.props.user.length > 0) {
        return (
          [
            <li key='1'>{this.props.user}</li>,
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

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, { setUsername, recipesLoaded })(Menu);

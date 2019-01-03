import React, { Component } from 'react';

class Menu extends Component {
  constructor(props) {
    super(props);
    // Any number of links can be added here
    this.state = {}
  }

  render() {
    return (
      <div className={this.props.open ? 'open' : ''} id='menu'>
        <ul>
          <li>
            <a href='./login'>Login</a>
          </li>
          <li>
            <a href='./roadmap'>Road Map</a>
          </li>
          <li>
            <a href='./about'>About</a>
          </li>
          <li>
            <a href='./privacy'>Privacy</a>
          </li>
        </ul>
      </div>
    )
  }
}

export default Menu;

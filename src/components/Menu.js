import React, { Component } from 'react';

class Menu extends Component {
  constructor(props) {
    super(props);
    // Any number of links can be added here
    this.state = {
      links: [{
        text: 'Log In',
        link: 'https://google.com'
      },{
        text: 'Sign Up',
        link: 'https://google.com'
      },{
        text: 'Privacy Policy',
        link: './privacy'
      }]
    }
  }

  render() {
    let links = this.state.links.map((link, i) => <li ref={i + 1}><i aria-hidden="true" className={`fa ${ link.icon }`}></i><a href={link.link}>{link.text}</a></li>);

    return (
      <div className={this.props.open ? 'open' : ''} id='menu'>
        <ul>
          { links }
        </ul>
      </div>
    )
  }
}

export default Menu;

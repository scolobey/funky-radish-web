import React, { Component } from 'react';
import { connect } from "react-redux";
import { toggleMenu } from "../actions/Actions";
import Menu from './Menu';
import SearchBar from "./SearchBar";

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(e) {
    e.stopPropagation();
    this.props.toggleMenu();
  }

  render() {
    return (
        <div className="App">
          <Menu/>

          <header className="header">
            <a href="/">
              <img
                className="icon"
                 srcset="/icon/icon-small.webp 1x, /icon/icon-medium.webp 2x"
                 src="/icon/icon-medium.webp"
                 alt="FunkyRadish Icon"
              />
            </a>

            <SearchBar/>

            <div id="Nav-Icon" className={this.props.menu ? 'open' : ''} onClick={this.toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </header>

        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    menu: state.menu
  };
}

export default connect(mapStateToProps, { toggleMenu })(Navigation);

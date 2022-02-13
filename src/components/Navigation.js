import React, { Component, Suspense, lazy } from 'react';
import { connect } from "react-redux";
import { toggleMenu } from "../actions/Actions";
const SearchBar = lazy(() => import('./SearchBar'));
const Menu = lazy(() => import('./Menu'));

const MenuLoading = () => <div></div>;
const SearchBarLoading = () => <div className="RecipeSearchField">
  <img src="/search_icon.svg" height="30" alt="Funky Radish"/>
  <input
    type="text"
    placeholder="Search.."
  />
</div>;

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
          <Suspense fallback={MenuLoading}>
            <Menu/>
          </Suspense>

          <header className="header">
            <a href="/">
              <img
                className="icon"
                 srcSet="/icon/icon-small.webp 1x, /icon/icon-medium.webp 2x"
                 src="/icon/icon-medium.webp"
                 alt="FunkyRadish Icon"
              />
            </a>

            <Suspense fallback={SearchBarLoading}>
              <SearchBar/>
            </Suspense>

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

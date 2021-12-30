import React, { Component } from 'react';
import { connect } from "react-redux";
import { debounce } from 'lodash';
import { useLocation, Switch } from 'react-router-dom';
import { search, autocomplete, setSearchSuggestions, externalRecipeSearch, setRedirect } from "../actions/Actions";

import { useHistory } from 'react-router-dom'

class SearchBar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      cursor: 0,
      suggestions: []
    };

    this.throttleHandleChange = debounce(this.throttleHandleChange.bind(this), 100)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)

    this.searchRef = React.createRef()
  }

  throttleHandleChange(event) {
    this.props.search(event.target.value)
  }

  handleChange(event) {
    this.throttleHandleChange(event)
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) { // Enter
      // TODO: It would be nice to have some more clarity in the indices here.
      // It gets confusing using index 0 to mean that no selection has been made.

      if (this.state.cursor === 0) {
        if (event.target.value === "") {
          return
        }
        else {
          // this.props.externalRecipeSearch(event.target.value.replace(/\s+/g, '-'))
          this.props.externalRecipeSearch()
          this.props.setSearchSuggestions([])

          // If you're not on home -> redirect
          console.log("query launched: " + window.location.pathname)
          if (window.location.pathname != "/") {
            console.log("on the rec page. Redirecting now.")
            this.props.setRedirect("/")
          }
        }
      }
      else {
        // this.props.externalRecipeSearch(this.props.suggestions[this.state.cursor-1].title.replace(/\s+/g, '-'))
        this.props.externalRecipeSearch()
        event.target.value = this.props.suggestions[this.state.cursor-1].title

        this.setState({
          cursor: 0
        });

        this.props.setSearchSuggestions([])
      }
    }
    else if (event.keyCode === 38) { // Up Arrow
      if(this.state.cursor === 0) {
        return
      }
      else {
        this.setState({
          cursor: this.state.cursor - 1
        })
      }
    }
    else if (event.keyCode === 40) { // Down Arrow
      if(this.state.cursor === this.props.suggestions.length) {
        return
      }
      else {
        this.setState({
          cursor: this.state.cursor + 1
        })
      }
    }
  }

  render() {
    return (
      <div className="RecipeSearchField">
        <img src="/search_icon.svg" height="30" alt="Funky Radish"/>
        <input
          type="text"
          placeholder="Search.."
          onChange={this.handleChange}
          onKeyDown={ this.handleKeyDown }
          ref={this.searchRef}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    suggestions: state.suggestions
  };
}

export default connect(mapStateToProps, { search, autocomplete, setSearchSuggestions, externalRecipeSearch, setRedirect } )(SearchBar);

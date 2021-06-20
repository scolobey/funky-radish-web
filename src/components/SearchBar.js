import React, { Component } from 'react';
import { connect } from "react-redux";
import { debounce } from 'lodash';
import { search, autocomplete, externalRecipeSearch } from "../actions/Actions";

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      suggestions: []
    };

    this.throttleHandleChange = debounce(this.throttleHandleChange.bind(this), 500);
    this.handleChange = this.handleChange.bind(this);
  }

  throttleHandleChange(event) {
    // TODO: find a way to cancel debounce and override here.
    if (event.target.value == "") {
      this.setState({ suggestions: [] })
    }
    else {
      this.props.autocomplete(event.target.value)
    }
  }

  handleChange(event) {
    this.throttleHandleChange(event)
  }

  render() {
    return (
      <div className="RecipeSearchField">
        <img src="/search_icon.svg" height="30" alt="Funky Radish"/>
        <input type="text" placeholder="Search.." onChange={this.handleChange} onSubmit={this.handleClick}/>

        { this.props.suggestions ?
          <ul>
            {this.props.suggestions.map((suggestion, index) => (
              <li key={index}>
                {suggestion.title}
              </li>
            ))}
          </ul>
        : <div></div>}

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    suggestions: state.suggestions
  };
}

export default connect(mapStateToProps, {search, autocomplete, externalRecipeSearch} )(SearchBar);

import React, { Component } from 'react';
import { connect } from "react-redux";
import { debounce } from 'lodash';
import { search, autocomplete, setSearchSuggestions, externalRecipeSearch } from "../actions/Actions";

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cursor: 0,
      suggestions: []
    };

    this.throttleHandleChange = debounce(this.throttleHandleChange.bind(this), 100);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  throttleHandleChange(event) {
    // TODO: finding a way to cancel debounce and override here may help performance
    this.props.autocomplete(event.target.value)
  }

  handleChange(event) {
    this.throttleHandleChange(event)
  }

  handleKeyDown(event) {
    // arrow up/down button should select next/previous list element
    if (event.keyCode === 13) {
      // search for recipes
      this.props.externalRecipeSearch(this.props.suggestions[this.state.cursor].title.replace(/\s+/g, '-'))

      event.target.value = this.props.suggestions[this.state.cursor].title

      this.setState({
        cursor: 0
      });

      this.props.setSearchSuggestions([])
    }
    else if (event.keyCode === 38) {
      if(this.state.cursor === 0) {
        return
      }
      else {
        console.log("setting state")
        this.setState({
          cursor: this.state.cursor - 1
        })
      }
    }
    else if (event.keyCode === 40) {
      if(this.state.cursor === this.props.suggestions.length - 1) {
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
        <input type="text" placeholder="Search.." onChange={this.handleChange} onKeyDown={ this.handleKeyDown } onSubmit={this.handleClick} />

        { this.props.suggestions && this.props.suggestions.length > 0 ?
          <div className="Suggestions">
            <ul>
              { this.props.suggestions.map((suggestion, index) => (
                <Suggestion index={index} key={index} cursor={this.state.cursor} suggestion={suggestion} />
              ))}
            </ul>
          </div>
        : <div></div> }

      </div>
    );
  }
}

function Suggestion(props) {
  let classLabel;

  if (props.cursor == props.index) {
    classLabel = "active-suggestion";
  }

  return (
    <li key={props.index} className={classLabel}>
      {props.suggestion.title}
    </li>
  )
}

function mapStateToProps(state) {
  return {
    suggestions: state.suggestions
  };
}

export default connect(mapStateToProps, { search, autocomplete, setSearchSuggestions, externalRecipeSearch } )(SearchBar);

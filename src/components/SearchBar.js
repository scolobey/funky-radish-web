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
    this.dismissSuggestions = this.dismissSuggestions.bind(this)
    this.clickSuggestion = this.clickSuggestion.bind(this)

    this.searchRef = React.createRef()
  }

  throttleHandleChange(event) {
    // TODO: finding a way to cancel debounce and override here may help performance?
    this.props.autocomplete(event.target.value)
  }

  handleChange(event) {
    console.log("handling change")
    this.throttleHandleChange(event)
  }

  handleKeyDown(event) {
    console.log("handling keydown")
    if (event.keyCode === 13) { // Enter
      // TODO: It would be nice to have some more clarity in the indices here.
      // It gets confusing using index 0 to mean that no selection has been made.

      if (this.state.cursor === 0) {
        if (event.target.value === "") {
          return
        }
        else {
          this.props.externalRecipeSearch(event.target.value.replace(/\s+/g, '-'))
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
        this.props.externalRecipeSearch(this.props.suggestions[this.state.cursor-1].title.replace(/\s+/g, '-'))
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

  dismissSuggestions(event) {
    const searchInput = this.searchRef.current;
    searchInput.value = ""
    this.props.setSearchSuggestions([])
  }

  clickSuggestion(index) {
    console.log("handling suggestion click")
    console.log("index: " + index)

    this.props.externalRecipeSearch(this.props.suggestions[index].title.replace(/\s+/g, '-'))

    const searchInput = this.searchRef.current;
    searchInput.value = this.props.suggestions[index].title

    this.setState({
      cursor: 0
    });

    this.props.setSearchSuggestions([])
  }

  render() {
    return (
      <div className="RecipeSearchField">
        <GhostComponent searchInput={this.dismissSuggestions}/>
        <img src="/search_icon.svg" height="30" alt="Funky Radish"/>
        <input
          type="text"
          placeholder="Search.."
          onChange={this.handleChange}
          onKeyDown={ this.handleKeyDown }
          ref={this.searchRef}
        />

        { this.props.suggestions && this.props.suggestions.length > 0 ?
          <div className="Suggestions">
          <div className="Suggestions-Dismiss" onClick={this.dismissSuggestions}><p>X</p></div>
            <ul>
              { this.props.suggestions.map((suggestion, index) => (
                <div onClick={() => this.clickSuggestion(index)}>
                  <Suggestion index={index} key={index} cursor={this.state.cursor} suggestion={suggestion}/>
                </div>
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

  if (props.cursor-1 == props.index) {
    classLabel = "active-suggestion";
  }

  return (
    <li key={props.index} className={classLabel}>
      {props.suggestion.title}
    </li>
  )
}

// The only purpose of this component is to receive the location hook so that the search input can be cleared when the url changes.
// This is a very ugly solution
const GhostComponent = (props) => {
  const location = useLocation();
  React.useEffect(() => {
    console.log('Location changed: ' + props.searchInput);
    props.searchInput()

  }, [location]);

  return <div />
};

function mapStateToProps(state) {
  return {
    suggestions: state.suggestions
  };
}

export default connect(mapStateToProps, { search, autocomplete, setSearchSuggestions, externalRecipeSearch, setRedirect } )(SearchBar);

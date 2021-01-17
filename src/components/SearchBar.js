import React, { Component } from 'react';
import { connect } from "react-redux";
import { search } from "../actions/Actions";

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.search(event.target.value);
  }

  render() {
    return (
      <div className="RecipeSearchField">
        <img src="/search_icon.svg" height="30" alt="Funky Radish"/>
        <input type="text" placeholder="Search.." onChange={this.handleChange}/>
      </div>
    );
  }
}

export default connect(null, {search} )(SearchBar);

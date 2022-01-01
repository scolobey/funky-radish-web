import React, { Component } from 'react';
import { connect } from "react-redux";
import Recipe from "../../components/Recipe.js";

import { externalRecipeSearch } from "../../actions/Actions";

class ImporterAdmin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: '',
      importQueue: []
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  onChange = (event) => {
    event.preventDefault();
    console.log(event.target.value)

    this.setState({ query: event.target.value })
  }


  handleClick(event) {
    event.preventDefault();
    this.props.externalRecipeSearch(this.state.query)
  }

  render() {

    return (
      <div>
        <form>
          <input type="text" onChange={this.onChange} placeholder="Query.."/>
          <button type="import" onClick={this.handleClick}>Search</button>
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    importQueue: state.importQueue
  };
}

export default connect(mapStateToProps, { externalRecipeSearch })(ImporterAdmin);

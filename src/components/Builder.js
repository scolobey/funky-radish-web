import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addRecipe } from "../actions/Actions";
import Recipes from "./Recipes";

class ConnectedForm extends Component {

  constructor(props) {
    super(props);

    // clientID comes from parameter, but in case of redirect from recipe view,
    // recipe data is already in recipe props.

    let clientID = props.match.params.clientID;

    if(clientID) {

      this.state = {
        ingredients: this.props.recipe.ingredients.join("\n"),
        directions: this.props.recipe.directions.join("\n"),
        title: this.props.recipe.title
      };
    }
    else {
      this.state = {
        ingredients: [],
        directions: [],
        title: ""
      };
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { title, ingredients, directions } = this.state;
    const clientID = uuidv1();

    this.props.addRecipe({
      ingredients: ingredients.split("\n"),
      directions: directions.split("\n"),
      clientID: clientID,
      title: title
    });
  }

  render() {
    const { title, ingredients, directions } = this.state;

    return (
      <div className="builder">
        <form onSubmit={this.handleSubmit}>

          <div className="title">
            <input
              type="text"
              className="form-control"
              placeholder="title"
              id="title"
              value={title}
              onChange={this.handleChange}
            />
          </div>

          <div className="ingredients">
            <textarea
              type="text"
              className="form-control"
              placeholder="ingredients"
              id="ingredients"
              value={ingredients}
              onChange={this.handleChange}
            />
          </div>

          <div className="directions">
            <textarea
              type="text"
              className="form-control"
              placeholder="directions"
              id="directions"
              value={directions}
              onChange={this.handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success btn-lg">
            SAVE
          </button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    recipe: state.recipe
  };
}

const Builder = connect(mapStateToProps, {addRecipe})(ConnectedForm);

export default Builder;

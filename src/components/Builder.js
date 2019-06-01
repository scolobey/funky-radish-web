import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addRecipe, deleteRemoteRecipe, viewRecipe } from "../actions/Actions";
import Recipes from "./Recipes";

import { Redirect } from "react-router-dom";

class ConnectedForm extends Component {

  constructor(props) {
    super(props);

    // clientID comes from parameter, but in case of redirect from recipe view,
    // recipe data is already in recipe props.
    let clientID = props.match.params.clientID;

    if(clientID) {
      this.state = {
        _id: this.props.recipe._id || '',
        clientID: this.props.recipe.clientID,
        ingredients: this.props.recipe.ingredients.join("\n"),
        directions: this.props.recipe.directions.join("\n"),
        title: this.props.recipe.title,
        redirect: false
      };

      this.props.viewRecipe(null);
    }
    else {
      this.state = {
        ingredients: [],
        directions: [],
        title: "",
        redirect: false
      };
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleDelete(event) {
    event.preventDefault();

    if (window.confirm("Are you sure!?")) {
      this.props.deleteRemoteRecipe(this.state);
    } else {
      console.log("You pressed Cancel!");
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const { _id, title, ingredients, directions } = this.state;
    const clientID = uuidv1();

    let recipe = {
      _id: _id,
      ingredients: ingredients.split("\n"),
      directions: directions.split("\n"),
      clientID: clientID,
      title: title
    }

    this.props.addRecipe(recipe);
  }

  render() {
    const { title, ingredients, directions } = this.state;

    return this.state.redirect ? ( <Redirect to={'/'} /> ) : (
      <div className="builder">
        <form onSubmit={this.handleSubmit}>

        <button type="delete" onClick={this.handleDelete}>
          Delete
        </button>

        <button type="submit" >
          SAVE
        </button>

        <div className="recipe">

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
        </div>
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

const Builder = connect(mapStateToProps, {addRecipe, deleteRemoteRecipe, viewRecipe})(ConnectedForm);

export default Builder;

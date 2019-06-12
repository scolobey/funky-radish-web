import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'

import uuidv1 from "uuid";
import { addRecipe, deleteRemoteRecipe, setRecipe, setRedirect } from "../actions/Actions";

class ConnectedForm extends Component {

  componentWillUnmount() {
    this.props.setRecipe(null);
  }

  constructor(props) {
    super(props);

    let clientID = props.match.params.clientID;
    let recipe = this.props.recipes.filter( recipe => recipe.clientID === clientID )[0]

    if(clientID && recipe) {
        this.state = {
          _id: recipe._id || '',
          clientID: recipe.clientID,
          ingredients: recipe.ingredients.join("\n") || "",
          directions: recipe.directions.join("\n") || "",
          title: recipe.title
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
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleDelete(event) {
    event.preventDefault();

    if (window.confirm("Are you sure!?")) {
      this.props.deleteRemoteRecipe(this.state);
      this.props.setRedirect("/");
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

    return (
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
    recipes: state.recipes
  };
}

const Builder = connect(mapStateToProps, {addRecipe, deleteRemoteRecipe, setRecipe, setRedirect})(ConnectedForm);

export default withRouter(Builder);

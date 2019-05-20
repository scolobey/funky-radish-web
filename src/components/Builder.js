import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addRecipe } from "../actions/Actions";
import Recipes from "./Recipes";

class ConnectedForm extends Component {

  constructor() {
    super();

    this.state = {
      ingredients: [],
      directions: [],
      title: ""
    };

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
    const { title } = this.state;

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
              onChange={this.handleChange}
            />
          </div>

          <div className="directions">
            <textarea
              type="text"
              className="form-control"
              placeholder="directions"
              id="directions"
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

const Builder = connect(null, {addRecipe})(ConnectedForm);

export default Builder;

import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addRecipe } from "../actions/Actions";
import List from "./List";


function mapDispatchToProps(dispatch) {
  return {
    addRecipe: recipe => dispatch(addRecipe(recipe))
  };
}

class ConnectedForm extends Component {

  constructor() {
    super();

    this.state = {
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

    const { title } = this.state;
    const id = uuidv1();
    this.props.addRecipe({ title, id });
  }

  render() {
    const { title } = this.state;

    return (
      [<div className="builder">
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
              value="this is where the ingredients should go."
              onChange={this.handleChange}
            />
          </div>

          <div className="directions">
            <textarea
              type="text"
              className="form-control"
              placeholder="directions"
              id="directions"
              value="this is where the directions should go."
              onChange={this.handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success btn-lg">
            SAVE
          </button>
        </form>
      </div>,
      <List/>
    ]
    );
  }
}

const Builder = connect(null, mapDispatchToProps)(ConnectedForm);

export default Builder;

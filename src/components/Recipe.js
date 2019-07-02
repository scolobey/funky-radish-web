import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { Helmet } from "react-helmet";

import uuidv1 from "uuid";
import { getRecipe, setRedirect } from "../actions/Actions";

class RecipeView extends Component {

  constructor(props) {
    super(props);

    let recipeTitle = props.match.params.recipeTitle;
    this.props.getRecipe(recipeTitle);
  }

  render() {

    return this.props.recipe ? (
      <div className="Recipe" key={this.props.recipe.clientID}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{this.props.recipe.title}</title>
          <meta name="description" content= {"Recipe for " + this.props.recipe.title + ". "} />
        </Helmet>

        <li key={this.props.recipe.clientID}>
          <div className="Title">
            <b>{this.props.recipe.title}</b>
          </div>
          <div className="Ingredients">
            <ul>
              {this.props.recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div className="Directions">
            <ol>
              {this.props.recipe.directions.map((direction, index) => (
                <li key={index}>
                  {direction}
                </li>
              ))}
            </ol>
          </div>
        </li>
      </div>
    ) : (
      <div />
    );
  }
}

function mapStateToProps(state) {
  return {
    recipe: state.recipe
  };
}

const Recipe = connect(mapStateToProps, { getRecipe, setRedirect })(RecipeView);

export default withRouter(Recipe);

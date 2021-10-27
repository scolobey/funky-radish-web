import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { Helmet } from "react-helmet";

import { getRecipe, setRedirect } from "../actions/Actions";

class RecipeView extends Component {

  constructor(props) {
    super(props);
    //TODO: This probably creates a problem where if recipes share a title, everything breaks.
    let recipeTitle = props.match.params.recipeTitle;

    this.state = {
      title: props.location.state.title,
      ingredients: props.location.state.ingredients,
      recID: recipeTitle
    };

    this.props.getRecipe(recipeTitle)
  }

  render() {
    return this.props.recipe ? (
      <div className="Recipe" key={this.state.recID}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{this.state.title} </title>
          <meta name="description" content= {"Recipe for: " + this.state.title + ". "} />
        </Helmet>

        <li>
          <div className="Title">
            <b>{this.state.title}</b>

          </div>
          <div className="Ingredients">
            {this.state.ingredients ? (
              <ul>
                {this.state.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            ):
            (<div></div>)}
          </div>
          <div className="Directions">
            <ul>
              {this.props.recipe.map((direction, index) => (
                <li key={index}>
                  {direction}
                </li>
              ))}
            </ul>
          </div>
        </li>
      </div>
    ) : (
      <div className="Recipe">

        <b>{this.state.title}</b>

        <div className="Ingredients">
          <ul>
            {this.state.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    recipe: state.recipe,
    title: state.title,
    ingredients: state.ingredients
  };
}

const Recipe = connect(mapStateToProps, { getRecipe, setRedirect })(RecipeView);

export default withRouter(Recipe);

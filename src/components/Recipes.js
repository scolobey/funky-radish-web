import React, { Component } from "react";
import { connect } from "react-redux";
import { getToken, viewRecipe } from "../actions/Actions";

import { Redirect } from "react-router-dom";

export class Recipes extends Component {

  componentDidMount() {
    this.props.getToken();
  }

  render() {
    return !this.props.user ? (
        <div className="not-logged-in-banner"><a href="./login">Login</a> or <a href="./signup">Signup</a> </div>
      ) : (

        <div className="RecipeListContainer">
          <div className="RecipeList">
            {this.props.recipe ? ( <Redirect to={'/builder/' + this.props.recipe.clientID} /> ) : (<div></div>) }
            {this.props.recipes.length > 0 ? <div></div> : <div className="no-recipes-banner">To add a recipe, click the '+' button below.</div> }
            <ul>
              {this.props.recipes.map(recipe => (
                <div className="Recipe" key={recipe.clientID} onClick={() => this.props.viewRecipe(recipe)}>
                  <li key={recipe.clientID}>
                    <div className="Title">
                      <b>{recipe.title}</b>
                    </div>
                    <div className="Ingredients">
                      <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index}>
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="Directions">
                      <ol>
                        {recipe.directions.map((direction, index) => (
                          <li key={index}>
                            {direction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    recipes: state.remoteRecipes,
    recipe: state.recipe,
    user: state.user
  };
}

export default connect(mapStateToProps, { getToken, viewRecipe })(Recipes);

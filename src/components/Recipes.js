import React, { Component } from "react";
import { connect } from "react-redux";
import { getToken } from "../actions/Actions";

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
            {this.props.recipes.length > 0 ? <div></div> : <div className="no-recipes-banner">To add a recipe, click the '+' button below.</div> }
            <ul>
              {this.props.recipes.map(recipe => (
                <div className="Recipe">
                  <li key={recipe._id}>
                    <div className="Title">
                      <b>{recipe.title}</b>
                    </div>
                    <div className="Ingredients">
                      <ul>
                        {recipe.ingredients.map(ingredient => (
                          <li>
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="Directions">
                      <ol>
                        {recipe.directions.map(direction => (
                          <li>
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
    recipes: state.remoteRecipes.slice(0, 10),
    user: state.user
  };
}

export default connect(mapStateToProps, { getToken })(Recipes);

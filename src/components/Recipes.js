import React, { Component } from "react";
import { connect } from "react-redux";
import { getToken } from "../actions/Actions";

export class Recipes extends Component {

  componentDidMount() {
    this.props.getToken();
  }

  render() {
    return (
      <div className="RecipeListContainer">
        <div className="RecipeList">
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
    recipes: state.remoteRecipes.slice(0, 10)
  };
}

export default connect(mapStateToProps, { getToken })(Recipes);

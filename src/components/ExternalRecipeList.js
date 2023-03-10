import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import RecipeRequestView from "./RecipeRequestView";

class ExternalRecipeListView extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return this.props.externalRecipes ? (
      <div className="ingredientRecipeList">

        {this.props.externalRecipes.map((recipe, index) => (
          <div className="ingredientRecipeListRecipe">

            <Link
              onClick={this.handleClick}
              to={{
                pathname: "/recipe/" + recipe.title.toLowerCase().replaceAll(' ', '-'),
                state: {
                  title: recipe.title,
                  ingredients: recipe.ingredients
                }
              }}
            >
              <div className="ingredientRecipeListing">
                {recipe.title}
                <ul className="featuredRecipeIngredients">
                  {recipe.ing.map((ingredientText, index) => (
                    <div className="recipeListIngredientList">
                      <li>
                        {ingredientText}
                      </li>
                    </div>
                  ))}
                </ul>
              </div>
            </Link>

          </div>
        ))}

      </div>
    ):(
      <div></div>
    );
  }
}

function mapStateToProps(state) {
  return {
    recipe: state.recipe
  };
}

export default connect(mapStateToProps)(ExternalRecipeListView);

import React, { Component } from "react";
import { connect } from "react-redux";

class ExternalRecipeListView extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return this.props.externalRecipes ? (
      <div class="externalRecipeView">
      <ul>
        {this.props.externalRecipes.map((recipe, index) => (
          <a href={"/recipes/sp-" + recipe._id}  class="externalRecipeListing">
            <li key={recipe._id}>
                {recipe.title}

                <ul>
                {recipe.missedIngredients.map((ingredient, index) => (
                  <li key={ingredient.id}>
                    {ingredient.originalStringß}
                  </li>
                ))}
                </ul>
            </li>
          </a>
        ))}
      </ul>
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

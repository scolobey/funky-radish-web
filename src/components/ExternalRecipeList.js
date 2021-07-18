import React, { Component } from "react";
import { connect } from "react-redux";

class ExternalRecipeListView extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return this.props.externalRecipes ? (
      <div className="externalRecipeView">
      <ul>
        {this.props.externalRecipes.map((recipe, index) => (
          // sp- is just a reference to sporctacular. If you ever add a different api, change this model.
          <a href={"/recipes/sp-" + recipe._id}  class="externalRecipeListing" key={recipe._id}>
            <li key={recipe._id}>
                {recipe.title}
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

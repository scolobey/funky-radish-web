import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

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
          <li key={recipe._id.toString()}>
            <Link
              className="externalRecipeListing"
              onClick={this.handleClick}
              to={{
                pathname: "/recipes/sp-" + recipe._id,
                state: {
                  title: recipe.title,
                  ingredients: recipe.ingredients
                }
              }}
            > {recipe.title} </Link>
          </li>
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

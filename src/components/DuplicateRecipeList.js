import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

class DuplicateRecipeListView extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return this.props.duplicateRecipes ? (
      <div className="externalRecipeView">
        <ul>
          {this.props.duplicateRecipes.map((recipe, index) => (
            // sp- is just a reference to sporctacular. If you ever add a different api, change this model.
            // But also, sporktacular is mostly deprecated.
            <li key={recipe._id.toString()}>
              <Link
                className="externalRecipeListing"
                onClick={this.handleClick}
                to={{
                  pathname: "/recipe/" + recipe._id.toString(),
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

export default connect(mapStateToProps)(DuplicateRecipeListView);

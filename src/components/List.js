// src/js/components/List.jsx
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { recipes: state.recipes };
};

const ConnectedList = ({ recipes }) => (
  <div className="RecipeListContainer">
    <div className="RecipeList">
      <ul>

      {recipes.map(recipe => (
        <div className="Recipe">
          <li className="Title" key={recipe.id}>
            <div className="Title">
              <b>{recipe.title}</b>
            </div>
          </li>
        </div>
      ))}

      </ul>
    </div>
  </div>
);

const List = connect(mapStateToProps)(ConnectedList);
export default List;

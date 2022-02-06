import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import useRecipeSearch from "../graphql/useRecipeSearch";

export default function RecipeSearchList(props) {

  // const redirector = useSelector((state) => state.redirect)

  //TODO: do something with the error?
  // const { loading, error, data } = useRecipeSearch(props.query);

  // if (loading) {
  //   return 'Loading...';
  // }
  //
  // if (error) {
  //   // graphQLErrors,networkError,message,extraInfo
  //   console.log("error: " + error.message)
  // }
  //
  // if (data) {
  //   console.log("data arrived")
  // }

  return (
    <div className="recipe-search-list">
      <ul>
          <li>here</li>

      </ul>
    </div>
  )
}

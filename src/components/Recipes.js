import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { getToken } from "../actions/Actions";
import { Helmet } from "react-helmet";

import RecipeList from "./RecipeList";
import ExternalRecipeList from "./ExternalRecipeList";

export class Recipes extends Component {

  constructor(props) {
    super(props);

    let user = localStorage.getItem('user');

    this.state = {
      recipes: [],
      externalRecipes: [],
      filteredRecipes: [],
      user: user
    };
  }

  componentDidMount() {
    this.props.getToken();
  }

  render() {
    return (this.state.user && this.state.user.length) > 0 ? (
      <div className="RecipeListContainer">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Funky Radish Professional Recipe Repository</title>
          <meta name="description" content= "A recipe app. Find, share and store your favorite culinary recipes." />
        </Helmet>

        <RecipeList/>

        <ExternalRecipeList externalRecipes={this.props.externalRecipes}/>

        <div className="create-button"><a href="./builder">+</a></div>
      </div>
    ):([
        <div><ExternalRecipeList externalRecipes={this.props.externalRecipes}/></div>,
        <ul className="not-logged-in-banner">
          <li>
            <a href="./login">
              <div className="login-text login-text--pushDown login-text--shadow">Login</div>
            </a>
          </li>
          <li>
            <a href="./signup">
              <div className="login-text login-text--pushDown login-text--shadow">Signup</div>
            </a>
          </li>
        </ul>,
        <div className="download-icons">
          <h2>Download the apps...</h2>
          <a href='https://play.google.com/store/apps/details?id=com.funkyradish.funky_radish&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='/play_store_badge.svg' height='75'/></a>
          <a href='https://apps.apple.com/us/app/funky-radish/id1447293832?ls=1'><img alt='Download on the App Store' src='/app_store_badge.svg' height='75'/></a>
        </div>
      ]);
  }
}

//TODO: Fixing this problem. Doing it right. User object get set on login and signup. getUser is a reducer
function mapStateToProps(state) {
  return {
    recipes: state.recipes,
    externalRecipes: state.externalRecipes,
    filteredRecipes: state.filteredRecipes,
    user: state.user
  };
}

export default withRouter(connect(mapStateToProps, { getToken })(Recipes));

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { getToken } from "../actions/Actions";
import { Helmet } from "react-helmet";

import RecipeList from "./RecipeList";
import ExternalRecipeList from "./ExternalRecipeList";

import { RealmApolloContext } from "../graphql/RealmApolloProvider";
import useRecipes from "../graphql/useRecipes";

import RealmService from '../services/RealmService'
const realmService = new RealmService();

export class Recipes extends Component {

  constructor(props) {
    super(props);

    let user = localStorage.getItem('user');
    let author = localStorage.getItem('realm_user');

    console.log("realm user: " + author)

    this.state = {
      recipes: [],
      externalRecipes: [],
      filteredRecipes: [],
      author: author
    };
  }

  componentDidMount() {
    console.log("mounting recipe page")

    let realmUser = realmService.getUser()
    let userObject = localStorage.getItem('realm_user');

    this.setState({ author: userObject })

    if (realmUser) {
      console.log("setting current user: " + realmUser)
      this.context.setCurrentUser(realmUser)
    }
    else {
      this.props.getToken();
    }


  }

  render() {
    return this.context.currentUser ? (
      <div className="RecipeListContainer">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Funky Radish Professional Recipe Repository</title>
          <meta name="description" content= "A recipe app. Find, share and store your favorite culinary recipes." />
        </Helmet>

        <RecipeList author={this.state.author}/>

        <ExternalRecipeList externalRecipes={this.props.externalRecipes}/>

        <div className="create-button"><a href="./builder">+</a></div>
      </div>
    ):([
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

Recipes.contextType = RealmApolloContext;

//TODO: Fixing this problem. Doing it right. User object get set on login and signup. getUser is a reducer
function mapStateToProps(state) {
  return {
    recipes: state.recipes,
    externalRecipes: state.externalRecipes,
    filteredRecipes: state.filteredRecipes,
    author: state.author
  };
}

export default withRouter(connect(mapStateToProps, { getToken })(Recipes));

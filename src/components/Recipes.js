import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { getToken } from "../actions/Actions";
import { Helmet } from "react-helmet";

import RecipeList from "./RecipeList";

export class Recipes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      recipes: [],
      filteredRecipes: []
    };
  }

  componentDidMount() {
    this.props.getToken();
  }

  render() {
    return !this.props.user ? ([
        <div><RecipeList/></div>,
        <ul className="not-logged-in-banner">
          <li>
            <a href="./login">
              <div class="login-text login-text--pushDown login-text--shadow">Login</div>
            </a>
          </li>
          <li>
            <a href="./signup">
              <div class="login-text login-text--pushDown login-text--shadow">Signup</div>
            </a>
          </li>
        </ul>,
        <div className="download-icons">
          <h2>Or download the apps...</h2>
          <a href='https://play.google.com/store/apps/details?id=com.funkyradish.funky_radish&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='/play_store_badge.svg' height='75'/></a>
          <a href='https://apps.apple.com/us/app/funky-radish/id1447293832?ls=1'><img alt='Download on the App Store' src='/app_store_badge.svg' height='75'/></a>
        </div>,
        <div>
          <ul>
            {this.props.filteredRecipes.map(recipe => (
              <li>{recipe.title}</li>
            ))}
          </ul>

        </div>
      ]
      ) : (
        <div className="RecipeListContainer">
          <Helmet>
            <meta charSet="utf-8" />
            <title>Funky Radish Professional Recipe Repository</title>
            <meta name="description" content= "A recipe app. Find, share and store your favorite culinary recipes." />
          </Helmet>

          <RecipeList/>

          <div className="RecipeList">
            {this.props.filteredRecipes.length > 0 ? <div></div> : <div className="no-recipes-banner">To add a recipe, click the '+' button below.</div> }
            <ul>
              {this.props.filteredRecipes.map(recipe => (
                <Link to= {"/builder/" + recipe.clientID}>
                  <div className="Recipe" key={recipe.clientID}>
                    <li key={recipe.clientID}>
                      <div className="Title">

                        <b>{recipe.title}</b>
                      </div>
                      <div className="Ingredients">
                        <ul>
                          {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="Directions">
                        <ol>
                          {recipe.directions.map((direction, index) => (
                            <li key={index}>
                              {direction}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </li>
                  </div>
                </Link>
              ))}
            </ul>

          </div>
          <div className="create-button"><a href="./builder">+</a></div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    recipes: state.recipes,
    filteredRecipes: state.filteredRecipes,
    user: state.user
  };
}

export default withRouter(connect(mapStateToProps, { getToken })(Recipes));

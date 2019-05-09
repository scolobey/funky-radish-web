import {
  ADD_RECIPE,
  GET_TOKEN,
  GET_RECIPES,
  RECIPES_LOADED,
  RECIPE_LOAD_FAILED,
  LOGIN,
  SIGNUP
} from "../constants/action-types";

import {
  flagRecipe,
  getRecipes,
  authFailed,
  getToken,
  warning
} from "../actions/Actions";

import Auth from '../Auth'
const auth = new Auth();

const forbiddenWords = ["123abc"];

export function loginMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {

      if (action.type === LOGIN) {

        switch (auth.validateCredentials(action.user.email, action.user.password)) {
          case 1:
            return dispatch(getToken({email: action.user.email, password: action.user.password}));
          case 2:
            return dispatch(warning({message: "Invalid password."}));
          case 3:
            return dispatch(warning({message: "Invalid email."}));
          default:
            return dispatch(warning({message: "Unidentified validation error."}));
        }

      }
      return next(action);
    };
  };
}

export function signupMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {

      if (action.type === SIGNUP) {

        switch (auth.validateCredentials(action.user.email, action.user.password)) {
          case 1:
            break;
          case 2:
            return dispatch(warning({message: "Invalid password."}));
          case 3:
            return dispatch(warning({message: "Invalid email."}));
          default:
            return dispatch(warning({message: "Unidentified validation error."}));
        }

        console.log(action.user)

        var params = {
          name: action.user.username,
          email: action.user.email,
          password: action.user.password,
          admin: false,
          recipes: []
        };

        fetch("https://funky-radish-api.herokuapp.com/users", {
          method: 'post',
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(params)
        })
        .then(res=>res.clone().json())
        .then(data => {
          console.log("wegotsomethinghere");
          console.log(data);

          if (data.message != "User created successfully.") {
            dispatch(warning({message: "Failed to retrieve token."}));
          } else {
            auth.setSession(data.token, action.user.email);
            return dispatch(getRecipes(data.token));
          }
        })
        .catch(err => console.log('Error: ' + err))
      }
      return next(action);
    };
  };
}

export function tokenCollectionMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      // do your stuff
      if (action.type === GET_TOKEN) {

        var params = {
          email: 'matador@gmail.com',
          password: 'matador123'
        };

        var formBody = [];
        for (var property in params) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(params[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        return fetch("https://funky-radish-api.herokuapp.com/authenticate", {
          method: 'post',
          headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
          }),
          body: formBody
        })
        .then(response => response.json())
        .then(data => {
          if (!data.success) {
            console.log("Failed to retrieve a token.")
            return dispatch(authFailed(data.message ));
          } else {
            console.log(data.token);
            console.log("sending token");
            return dispatch(getRecipes(data.token));
          }
        })
      }
      return next(action);
    };
  };
}

export function recipeLoadingMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      // do your stuff
      if (action.type === GET_RECIPES) {

        return fetch("https://funky-radish-api.herokuapp.com/recipes", {
          method: 'get',
          headers: new Headers({
            'x-access-token': action.token
          })
        })
        .then(response => response.json())
          .then(json => {
            console.log("recipes loaded I think");
            return dispatch({ type: RECIPES_LOADED, payload: json });
          })
          .catch(error => {
            console.log("recipe load failed");
            return dispatch({ type: RECIPE_LOAD_FAILED, payload: error });
          });

      }
      return next(action);
    };
  };
}

export function recipeModerationMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      // do your stuff
      if (action.type === ADD_RECIPE) {

        const foundWord = forbiddenWords.filter(word =>
          action.recipe.title.includes(word)
        );
        if (foundWord.length) {
          return dispatch(flagRecipe(action.recipe.id));
        }
      }
      return next(action);
    };
  };
}

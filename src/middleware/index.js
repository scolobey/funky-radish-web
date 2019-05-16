import {
  ADD_RECIPE,
  GET_TOKEN,
  GET_RECIPES,
  LOGIN,
  SIGNUP,
  WARNING
} from "../constants/action-types";

import {
  flagRecipe,
  getRecipes,
  authFailed,
  getToken,
  warning,
  recipesLoaded,
  setUsername,
  toggleLoader,
  warningToggle
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
            return dispatch(warning("Invalid password."));
          case 3:
            return dispatch(warning("Invalid email."));
          default:
            return dispatch(warning("Unidentified validation error."));
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
            return dispatch(warning("Password needs 8 characters and a number."));
          case 3:
            return dispatch(warning("Invalid email."));
          default:
            return dispatch(warning("Unidentified validation error."));
        }

        var params = {
          name: action.user.username,
          email: action.user.email,
          password: action.user.password,
          admin: false,
          recipes: []
        };

        dispatch(toggleLoader(true));

        fetch("https://funky-radish-api.herokuapp.com/users", {
          method: 'post',
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(params)
        })
        .then(res=> {
          return res.clone().json()
        })
        .then(data => {
          if (data.message != "User created successfully.") {
            dispatch(toggleLoader(false));
            dispatch(warning(data.message));
          } else {
            auth.setSession(data.token, action.user.email);
            dispatch(setUsername(action.user.email));
            dispatch(toggleLoader(false));
            // go to main recipe list.
            var recipes = new Array();
            return dispatch(recipesLoaded(recipes));
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

        let token = auth.getToken();

        if (token) {
          console.log("token exists.")
          console.log(token)
          return dispatch(getRecipes(token));
        }

        if (!action.authData || !action.authData) {
          return dispatch(authFailed("not logged in."));
        }

        var params = {
          email: action.authData.email,
          password: action.authData.password
        };

        var formBody = [];
        for (var property in params) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(params[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        dispatch(toggleLoader(true));
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
            dispatch(toggleLoader(false));
            return dispatch(warning(data.message ));
          } else {
            auth.setSession(data.token, action.authData.email);
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

        dispatch(toggleLoader(true));
        return fetch("https://funky-radish-api.herokuapp.com/recipes", {
          method: 'get',
          headers: new Headers({
            'x-access-token': action.token
          })
        })
        .then(response => response.json())
          .then(json => {
            let user = auth.getUser();
            dispatch(setUsername(user));
            dispatch(toggleLoader(false));
            return dispatch(recipesLoaded(json));
          })
          .catch(error => {
            dispatch(toggleLoader(false));
            return dispatch(warning("Recipe load failed."));
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

export function warningCycleMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      // do your stuff
      if (action.type === WARNING) {

        setInterval(() => {
          return dispatch(warningToggle());
        }, 3000);

      }
      return next(action);
    };
  };
}

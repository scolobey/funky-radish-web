import {
  ADD_RECIPE,
  GET_TOKEN,
  GET_RECIPES,
  DELETE_REMOTE_RECIPE,
  LOGIN,
  SIGNUP,
  WARNING
} from "../constants/action-types";

import {
  getRecipes,
  updateRecipe,
  deleteLocalRecipe,
  authFailed,
  getToken,
  warning,
  recipesLoaded,
  setUsername,
  toggleLoader,
  warningToggle,
  setRedirect
} from "../actions/Actions";

import uuidv1 from "uuid";

import Auth from '../Auth'
const auth = new Auth();

var moment = require('moment');

export function loginMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {

      if (action.type === LOGIN) {

        switch (auth.validateCredentials(action.user.email, action.user.password)) {
          case 1:
            return dispatch(getToken({email: action.user.email, password: action.user.password}));
          case 2:
            return dispatch("Invalid password.");
          case 3:
            return dispatch("Invalid email.");
          default:
            return dispatch("Unidentified validation error.");
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
            return dispatch("Password needs 8 characters and a number.");
          case 3:
            return dispatch("Invalid email.");
          default:
            return dispatch("Unidentified validation error.");
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
          if (data.message !== "User created successfully.") {
            dispatch(toggleLoader(false));
            dispatch(data.message);
          } else {
            auth.setSession(data.token, action.user.email);
            dispatch(setUsername(action.user.email));
            dispatch(toggleLoader(false));
            // go to main recipe list.
            var recipes = [];
            return dispatch(recipesLoaded(recipes));
          }
        })
        .catch(err => dispatch(warning('Error: ' + err)))
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
            return dispatch(data.message);
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
          if (json.message) {
            dispatch(warning(json.message))
            dispatch(toggleLoader(false));
            auth.setToken("");
            return dispatch(getToken());
          }

          let user = auth.getUser();
          dispatch(setUsername(user));
          dispatch(toggleLoader(false));

          json.forEach(recipe => recipe.clientID = uuidv1());
          return dispatch(recipesLoaded(json));
        })
        .catch(error => {
          dispatch(toggleLoader(false));
          return dispatch("Recipe load failed.");
        });
      }
      return next(action);
    };
  };
}

export function addRecipeMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      if (action.type === ADD_RECIPE) {
        let token = auth.getToken();

        if (!token) {
          return dispatch(warning("You're not logged in. Recipe will not be saved."));
        }

        var date = new Date();
        var formattedDate = moment.utc(date).format("YYYY-MM-DDTHH:mm:ss.sssz").replace(/UTC/, "Z");

        var params = {
          ingredients: action.recipe.ingredients,
          directions: action.recipe.directions,
          updatedAt: formattedDate,
          title: action.recipe.title,
          clientID: action.recipe.clientID
        }

        if(action.recipe._id) {
          let url = "https://funky-radish-api.herokuapp.com/recipe/" + action.recipe._id;

          fetch(url, {
            method: 'put',
            headers: new Headers({
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-access-token': token
            }),
            body: JSON.stringify(params)
          })
          .then(res=> {
            return res.clone().json()
          })
          .then(data => {
            if (data.message) {
              return dispatch(warning(data.message))
            }
            return dispatch(updateRecipe(data));
          })
          .catch(error => dispatch(warning(error)))
        }
        else {
          params = [params];

          fetch("https://funky-radish-api.herokuapp.com/recipes", {
            method: 'post',
            headers: new Headers({
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-access-token': token
            }),
            body: JSON.stringify(params)
          })
          .then(res=> {
            return res.clone().json()
          })
          .then(data => {
            if (data.message) {
              return dispatch(warning(data.message))
            }
            // update recipe to fill in ._id
            return dispatch(updateRecipe(data));
          })
          .catch(error => dispatch(warning(error)))
        }
      }
      return next(action);
    };
  };
}

export function deleteRecipeMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      if (action.type === DELETE_REMOTE_RECIPE) {

        let token = auth.getToken();

        if (!token) {
          return dispatch("You're not logged in. Recipe will not be removed.");
        }

        let id = action.recipe._id;
        let url = "https://funky-radish-api.herokuapp.com/recipe/" + id;

        // call to delete recipe.
        fetch(url, {
          method: 'delete',
          headers: new Headers({
            'x-access-token': token
          })
        })
        .then(res=> {
          return res.clone().json()
        })
        .then(data => {
          if (data.message === "Recipe deleted successfully!" || data.message === "Authentication failed. Recipe not found.") {
            return dispatch(deleteLocalRecipe(action.recipe.clientID))
          }
          else {
            return dispatch("Delete failed.")
          }
        })
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

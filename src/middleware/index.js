import {
  ADD_RECIPE,
  GET_TOKEN,
  GET_RECIPES,
  VERIFY_EMAIL,
  DELETE_REMOTE_RECIPE,
  LOGIN,
  SIGNUP,
  WARNING,
  GET_RECIPE
} from "../constants/action-types";

import {
  getRecipes,
  updateRecipe,
  deleteLocalRecipe,
  authFailed,
  getToken,
  setVerified,
  warning,
  recipesLoaded,
  setUsername,
  toggleLoader,
  warningToggle,
  setRedirect,
  setRecipe
} from "../actions/Actions";

import {v1 as uuid} from "uuid";

import Auth from '../Auth'
import RealmService from '../services/RealmService'
const auth = new Auth();
const realmService = new RealmService();

var moment = require('moment');

export function loginMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {

      if (action.type === LOGIN) {
        switch (auth.validateCredentials(action.user.email, action.user.password)) {
          case 1:
            return dispatch(getToken({email: action.user.email, password: action.user.password}));
          case 2:
            return dispatch(warning('Invalid password.'));
          case 3:
            return dispatch(warning('Invalid email.'));
          default:
            return dispatch(warning('Unidentified validation error.'));
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
            return dispatch(warning('Password needs 8 characters and a number.'));
          case 3:
            return dispatch(warning('Invalid email.'));
          default:
            return dispatch(warning('Unidentified validation error.'));
        }

        var params = {
          email: action.user.email,
          password: action.user.password
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
          if (data.message == "Verification email sent.") {
            dispatch(toggleLoader(false));
            return dispatch(warning("Check your email for a link to help complete your signup."))
          } else {
            dispatch(toggleLoader(false));
            return dispatch(warning(data.message))
          }
        })
        .catch(err => {
          dispatch(toggleLoader(false));
          return dispatch(warning('Error: ' + err))
        })
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

        if (!action.authData) {
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

        fetch("https://funky-radish-api.herokuapp.com/authenticate", {
          method: 'post',
          headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
          }),
          body: formBody
        })
        .then(res => {
          return res.clone().json()
        })
        .then(data => {
          if (data.message === "Enjoy your token, ya filthy animal!") {
            RealmService.authenticate(data.token)
            .then(user => {
              auth.setSession(data.token, action.authData.email);
              auth.setRealmUser(user);
              dispatch(setUsername(action.authData.email));
              dispatch(warning("Welcome! Hold on while we collect your recipes."));
              dispatch(setRedirect("/"));
              //TODO: We don't need to pass a parameter. Should be able to get user
              return dispatch(getRecipes(user.refresh_token));
            })
            .catch(error => {
              dispatch(toggleLoader(false));
              return dispatch(warning("Realm connect failed: " + error.message));
            });
          }
          else if (data.message === "Email not verified.") {
            dispatch(toggleLoader(false));
            dispatch(setRedirect("/login"));
            return dispatch(warning("Check your email to verify your account."));
          }
          else {
            dispatch(toggleLoader(false));
            dispatch(setRedirect("/login"));
            console.log("error: ", data);
            return dispatch(warning(data.message));
          }
        })
        .catch(error => {
          dispatch(toggleLoader(false));
          console.log("error: ", error.message);
          return dispatch(warning("Auth failed: " + error.message));
        });
      }
      return next(action);
    };
  };
}

export function emailVerificationMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {

      if (action.type === VERIFY_EMAIL) {
        dispatch(toggleLoader(true));
        const endpoint = "https://funky-radish-api.herokuapp.com/verify/" + action.token

        fetch(endpoint, { method: 'get' })
        .then(res=> {
          return res.clone().json()
        })
        .then(data => {
          console.log("fetch returned.")
          console.log(data)
          dispatch(toggleLoader(false));
          if ( data.message === "Email verified.") {
            return dispatch(setVerified("Welcome to Funky Radish! You can now login from any device."));
          }
          else {
            return dispatch(setVerified(data.message));
          }
        })
        .catch(error => {
          dispatch(toggleLoader(false));
          return dispatch(setVerified("Verification failed: " + error.message));
        });
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
        console.log("get recipes action called")
        return dispatch(warning("getting recipes"))

        // return fetch("https://funky-radish-api.herokuapp.com/recipes", {
        //   method: 'get',
        //   headers: new Headers({
        //     'x-access-token': action.token
        //   })
        // })
        // .then(response => response.json())
        // .then(json => {
        //   if (json.message) {
        //     dispatch(warning(json.message))
        //     dispatch(toggleLoader(false));
        //     auth.setToken("");
        //     return dispatch(getToken());
        //   }
        //
        //   let user = auth.getUser();
        //   dispatch(setUsername(user));
        //   dispatch(toggleLoader(false));
        //
        //   json.forEach(recipe => recipe.clientID = uuid());
        //   return dispatch(recipesLoaded(json));
        // })
        // .catch(error => {
        //   dispatch(toggleLoader(false));
        //   return dispatch(warning("Recipe load failed."));
        // });
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

export function getRecipeMiddleware({dispatch}) {
  return function(next) {
    return function(action) {
      if (action.type === GET_RECIPE) {
        fetch("https://funky-radish-api.herokuapp.com/recipes/" + action.recipeTitle , {
          method: 'get'
        })
        .then(response => response.json())
        .then(json => {
          if (json.message) {
            dispatch(warning(json.message))
            return dispatch(toggleLoader(false));
          }
          else {
            return dispatch(setRecipe(json));
          }
        })
        .catch(error => {
          return dispatch(warning("I can't find that recipe."));
        });
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
          return dispatch(warning("You're not logged in. Recipe will not be removed."));
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
            return dispatch(warning("Delete failed."))
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

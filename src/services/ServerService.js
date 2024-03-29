import { BASE_URL } from "../constants/api";
var path = require('path');

var dotenv = require('dotenv').config();
const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY

export default class ServerService {

  async generateRecipeToken(recipeID) {
    let token = localStorage.getItem('access_token');

    let endpoint = BASE_URL + "createRecipeToken/" + recipeID
    console.log("endpoint: " + endpoint)
    console.log("token"  + token)
    let response = await fetch(endpoint, {
      method: 'get',
      headers: new Headers({
        'x-access-token': token
      })
    })

    let data = await response.json()
    return data;
  }

  async importRecipe(address) {
    console.log("importing: ");
    let encoded = encodeURIComponent(address);
    let endpoint = BASE_URL + "collector/inspect/" + encoded
    console.log("importing: " + endpoint);

    let response = await fetch(endpoint, { method: 'get' })

    let data = await response.json()
    return data;
  }

  // https://funky-radish-api.herokuapp.com/ingredients/grated ginger
  async searchIngredients(query) {
    let endpoint = BASE_URL + "ingredients/" + query

    let response = await fetch(endpoint, {
      method: 'get',
      headers: new Headers({
        'x-access-token': REACT_APP_API_KEY
      })
    })

    let data = await response.json()
    return data;
  }

  // https://funky-radish-api.herokuapp.com/recipes/singapore-sling
  async searchRecipes(query) {
    let endpoint = BASE_URL + "recipes/" + query.replaceAll("-", " ")

    let response = await fetch(endpoint, {
      method: 'get',
      headers: new Headers({
        'x-access-token': REACT_APP_API_KEY
      })
    })

    let data = await response.json()
    return data;
  }

  // https://funky-radish-api.herokuapp.com/perfect/guacamole
  async perfectSearchRecipes(query) {
    let endpoint = BASE_URL + "perfect/" + query

    let response = await fetch(endpoint, {
      method: 'get',
      headers: new Headers({
        'x-access-token': REACT_APP_API_KEY
      })
    })

    let data = await response.json()
    return data;
  }

  // TODO: Probably deprecated
  searchAutocomplete(query) {
    return new Promise(function(resolve, reject) {

      // When the search input is removed,
      // there can exist a state where the autocomplete is set to "" before a previous autocomplete query returns.
      // my solution is to use setTimeout to delay setting to "" and wait for any hanging fetch returns.
      // I don't like this solution, but it works.

      let data

      if ( query === "") {
        setTimeout(function(){
          let obj = {message: "Here ya go, punk!", suggestions: [], error: ""}
          resolve(obj)
        }, 500);
      }
      else {
        let endpoint = BASE_URL + "collector/autocomplete?query=" + query

        fetch(endpoint, {
          method: 'GET'
        })
        .then(function(response) {
          console.log(response)
          resolve(response);
        })
        .catch(function(err) {
            reject(err);
        });
      }
    })
  }

  async createUser(user) {
    var params = {
      name: user.username,
      email: user.email,
      password: user.password,
      admin: false,
      recipes: []
    };

    let endpoint = "/users"

    let response = await fetch(endpoint, {
      method: 'post',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(params)
    })
    .catch(err => {
      console.log('Error: ' + err)
      return
    })

    let data = await response.json()
    return data;
  }

  async loginUser(user) {

    var params = {
      email: user.email,
      password: user.password
    };

    let endpoint = "/authenticate"

    let response = await fetch(endpoint, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: JSON.stringify(params)
    })
    .catch(err => {
      console.log('Error: ' + err)
      return
    })

    let data = await response.json()
    return data;
  }

}

function fetchWithTimeout(endpoint) {
  const FETCH_TIMEOUT = 8000;
  let didTimeOut = false;

  return new Promise(function(resolve, reject) {
    const timeout = setTimeout(function() {
      didTimeOut = true;
      reject(new Error('Request timed out'));
    }, FETCH_TIMEOUT);

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(function(response) {
        // Clear the timeout as cleanup
        clearTimeout(timeout);
        if(!didTimeOut) {
          console.log('fetch successfull: ', response);
          resolve(response);
        }
      })
      .catch(function(err) {
          console.log('fetch failed: ', err);
          // Rejection already happened with setTimeout
          if(didTimeOut) return;
          // Reject with error
          reject(err);
      });
  })

}

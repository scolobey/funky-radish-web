import { BASE_URL } from "../constants/api";
var path = require('path');

export default class ServerService {

  async searchRecipes(query) {
    let endpoint = BASE_URL + "collector?query=" + query

    console.log(endpoint)

    let response = await fetch(endpoint, { method: 'get' })

    let data = await response.json()
    return data;
  }

  async searchAutocomplete(query) {
    let endpoint = BASE_URL + "collector/autocomplete?query=" + query

    let response = await fetch(endpoint, { method: 'get' })

    let data = await response.json()
    return data;
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

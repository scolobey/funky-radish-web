import { BASE_URL } from "../constants/api";
var path = require('path');

export default class ServerService {

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

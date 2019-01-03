
import React, { Component } from 'react';
import Auth from '../Auth'

const auth = new Auth();

class RecipeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
  }

  componentWillMount() {
    let token = JSON.parse(auth.getToken());

    if (token) {
      fetch("https://funky-radish-api.herokuapp.com/recipes", {
        method: 'get',
        headers: new Headers({
          'x-access-token': token
        })
      })
      .then(results => {
        return results.json();
      })
      .then(recipes => {
        if (recipes.success === false) {
          console.log("Token expired. Will download a new token")

          var params = {
            email: 'scolobey@gmail.com',
            password: 'scolobey123'
          };

          var formBody = [];

          for (var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }

          formBody = formBody.join("&");

          fetch("https://funky-radish-api.herokuapp.com/authenticate", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: formBody
           })
          .then(results => {
            return results.json();
          })
          .then(data => {
            if (!data.success) {
              console.log("Failed to retrieve a token.")
            } else {
              return data.token
            }
          })
          .then(token => {
            auth.setSession(JSON.stringify(token))
            fetch("https://funky-radish-api.herokuapp.com/recipes", {
              method: 'get',
              headers: new Headers({
                'x-access-token': token
              })
            })
            .then(results => {
              return results.json();
            })
            .then(recipes => {
              this.setState({recipes: recipes})
            })
          })
        } else {
          this.setState({recipes: recipes})
        }

      })
    } else {
      console.log("Token not available. Will download a token")
      var params = {
        email: 'scolobey@gmail.com',
        password: 'scolobey123'
      };

      var formBody = [];

      for (var property in params) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(params[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }

      formBody = formBody.join("&");

      fetch("https://funky-radish-api.herokuapp.com/authenticate", {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: formBody
       })
      .then(results => {
        return results.json();
      })
      .then(data => {
        if (!data.success) {
          console.log("Failed to retrieve a token.")
        } else {
          return data.token
        }
      })
      .then(token => {
        auth.setSession(JSON.stringify(token))
        fetch("https://funky-radish-api.herokuapp.com/recipes", {
          method: 'get',
          headers: new Headers({
            'x-access-token': token
          })
        })
        .then(results => {
          return results.json();
        })
        .then(recipes => {
          this.setState({recipes: recipes})
        })
      })
    }
  }

  render() {
    return (
      <div className="RecipeListContainer">
        <div className="RecipeList">
          <ul>
            {this.state.recipes.map(recipe => (
              <div className="Recipe">
                <li key={recipe._id}>
                  <div className="Title">
                    <b>{recipe.title}</b>
                  </div>
                  <div className="Ingredients">
                    <ul>
                      {recipe.ingredients.map(ingredient => (
                        <li>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="Directions">
                    <ol>
                      {recipe.directions.map(direction => (
                        <li>
                          {direction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default RecipeList;

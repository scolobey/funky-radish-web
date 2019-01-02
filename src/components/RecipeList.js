
import React, { Component } from 'react';
import Auth from '../Auth'

const auth = new Auth();
// const recipe = new RecipeController();

class RecipeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
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
        this.setState({recipes: recipes})
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
                  <b>{recipe.title}</b>
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
                    <ul>
                      {recipe.directions.map(direction => (
                        <li>
                          {direction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>

        <form onSubmit={this.handleSubmit}>
          <label htmlFor="new-todo">
            What needs to be done?
          </label>
          <input
            id="new-todo"
            onChange={this.handleChange}
          />
          <button>
            Add Recipe
          </button>
        </form>
      </div>
    );
  }

  // handleChange(e) {
  //   this.setState({ title: e.target.value });
  // }
  //
  // handleSubmit(e) {
  //   e.preventDefault();
  //   if (!this.state.title.length) {
  //     return;
  //   }
  //   const newRecipe = {
  //     title: this.state.title,
  //     id: Date.now()
  //   };
  //   this.setState(state => ({
  //     recipes: state.recipes.concat(newRecipe),
  //     title: ''
  //   }));
  // }
}

export default RecipeList;

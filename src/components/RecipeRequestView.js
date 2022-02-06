import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux'
import { warning, requestRecipe } from "../actions/Actions";

export default function RecipeRequestView() {

  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');

  const dispatch = useDispatch()

  const submitRequest = (e) => {
    e.preventDefault()
    console.log("submitting request: " + query + ", " + email)

    // Here is where we need to send a recipe request.
    // Where I can easily find it
    // And easily create a recipe and send it to the user.
    let payload = {
      query: query,
      email: email
    }

    dispatch(requestRecipe(payload))


    dispatch(warning('Recipe requested. Thank You!'))
    setQuery('')
    setEmail('')
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value )
  }

  const onChangeQuery = (e) => {
    setQuery(e.target.value )
  }

  return (
    <div className="recipe-request-container">
      <h1>Request a recipe!</h1>
      <h3>We don't have a ton of recipes yet, but you can submit a request and get a custom recipe to your inbox.</h3>
      <form onSubmit={submitRequest}>
        <label >Recipe Title</label><br></br>
        <input placeholder='Recipe Title...' name='title' value={query} onChange={onChangeQuery} /><br></br>
        <label for="html">Email Address</label><br></br>
        <input placeholder='Email...' name='email' value={email} onChange={onChangeEmail} /><br></br>
        <button>Submit</button>
      </form>
    </div>
  );
}

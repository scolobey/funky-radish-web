import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux'
import { warning, requestRecipe } from "../actions/Actions";

import RealmService from '../services/RealmService'
const realmService = new RealmService();

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

  React.useEffect(() => {
    let em = realmService.getUser()
    let qu = query
     console.log("Set the things if they're there: " + em + " , " + qu)
  },[])

  return (
    <div className="recipe-request-container">
      <h1>Don't see what you're looking for? </h1>
      <h3>We don't have a ton of recipes yet. But we do take requests.</h3>
      <form onSubmit={submitRequest}>
        <label >Recipe Title</label><br></br>
        <input placeholder='Recipe Title...' name='title' value={query} onChange={onChangeQuery} /><br></br>
        <label for="html">Your Email Address</label><br></br>
        <input placeholder='Email...' name='email' value={email} onChange={onChangeEmail} /><br></br>
        <button>Submit</button>
      </form>
    </div>
  );
}

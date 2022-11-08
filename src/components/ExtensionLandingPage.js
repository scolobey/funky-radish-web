import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from 'react-redux'
import { subscribeToNewsletter, requestRecipe } from "../actions/Actions";

import Popover from "./Popover";

export default function ExtensionLandingPage() {

  const dispatch = useDispatch()

  const [ email, setEmail ] = useState(false)

  const submitEmail = (event) => {
    let subCode = 2

    dispatch(subscribeToNewsletter({
      email: email,
      code: subCode
    }))

    let payload = {
      query: "newsletter signup!",
      email: 'no email'
    }

    dispatch(requestRecipe(payload))
  };

  useEffect(() => {
    console.log("knock knock");
  });

  return <div className="extension-landing-page">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Welcome!</title>
        <meta name="description" content= "FunkyRadish browser extension landing page" />
      </Helmet>

      <div className="extension-view">
        <h1>Welcome to Funky Radish!</h1>
        <h2>First! Pin the extension for the full effect.</h2>
        <ol>
          <li><h3>Click the puzzle (<img src="/puzzle_icon.png" alt="puzzle"/>) icon next to your browser's address bar.</h3></li>
          <li><h3>Find the Funky Radish Extension in the dropdown and click the pin icon.</h3></li>
          <img src="/pin_icon.png" alt="puzzle" height="40px"/>
          <li><h3>The <img src="/tiny_fr_icon.png" alt="radish"/> icon will now light up when a recipe is detected.</h3></li>
        </ol>

        <h2>Then! Get on the mailing list!</h2>
        <div className="newsletter-signup">
          <form onSubmit={e => {
              e.preventDefault();
              submitEmail(e);
          }}>
            <label><input type="text" name="email" placeholder="email" onChange={(event) => { setEmail(event.target.value) }}/></label>
            <button type="clear">Sign me up</button>
          </form>
        </div>

        <ul>
          <li><h3>I'll send a couple of quick tricks to get the most out of FunkyRadish.</h3></li>
          <li><h3>Plus some custom recipes. I'll send simple, proven recipes based on what you are looking for.</h3></li>
        </ul>


      </div>

    </div>
}

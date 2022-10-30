import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from 'react-redux'

import Popover from "./Popover";

export default function ExtensionLandingPage() {

  const dispatch = useDispatch()

  const [ email, setEmail ] = useState(false)

  useEffect(() => {

  });

  return <div className="extension-landing-page">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Welcome!</title>
        <meta name="description" content= "FunkyRadish browser extension landing page" />
      </Helmet>

      <div className="extension-view">
        <h1>Two steps to get started with FunkyRadish!</h1>
        <h2>First! Pin the extension</h2>
        <ol>
          <li><h3>Click the <img src="/puzzle_icon.png" alt="puzzle"/> icon at the top of the browser.</h3></li>
          <li><h3>Find the Funky Radish Extension in the dropdown and click the pin icon.</h3></li>
          <img src="/pin_icon.png" alt="puzzle" height="40px"/>
          <li><h3>The <img src="/tiny_fr_icon.png" alt="radish"/> icon will now light up when a recipe is detected.</h3></li>
        </ol>

        <h2>Second... <a href='/signup' >Signup!</a></h2>
        <h3>You can use FR without an account, but claiming your free account will let you.</h3>
        <ol>
          <li><h3>Easily bookmark and edit recipes.</h3></li>
          <li><h3>Send recipes straight to your phone.</h3></li>
        </ol>
      </div>

    </div>
}

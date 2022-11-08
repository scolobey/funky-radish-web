import React, { Component } from 'react';
import { Helmet } from "react-helmet";

class About extends Component {
  render() {
    return (
      <div className="AboutContainer">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Funky Radish Recipe App - About</title>
          <meta name="description" content= "Funky Radish is a bare-bones recipe app, available on Google Play and the App Store." />
        </Helmet>

        <div className="Static-Info">

          <h2>
            I used to be a cook.
            But at some point I became obsessed with building tools for Cooks.
            Like this app for instance.
          </h2>

          <h2>
            This is a tool for cooks.
            You add recipes.
            Then you can use them on any device.
          </h2>

          <h2>
            Most recipe apps are weighed down by images, video and useless features.
            Funky Radish is just a lightweight and reliable recipe manager. So long as your phone has battery, it works.
          </h2>
        </div>
      </div>
    );
  }
}

export default About;

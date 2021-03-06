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
          <h2>Most recipe apps are weighed down by images, video and useless features. Funky Radish aims to be a lightweight and reliable recipe manager that can be easily accessed from all of your devices for free. Check out our <a href='./roadmap'>roadmap</a> to see development plans.</h2>
        </div>
      </div>
    );
  }
}

export default About;

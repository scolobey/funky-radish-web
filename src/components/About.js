import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div className="AboutContainer">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Funky Radish Recipe App - About</title>
          <meta name="description" content= "Funky Radish is a bare-bones recipe app, available on Google Play and the App Store." />
        </Helmet>

        <div className="About">
          <h1>
            About Funky Radish
          </h1>
          <p>Most recipe apps are weighed down by images, video and useless features. Funky Radish aims to be a lightweight and reliable recipe manager that can be easily accessed from all of your devices for free.</p>
          <p>Check out <a href='./roadmap'>roadmap</a> to see development plans. Or shoot me an email at minedied@gmail.com</p>
        </div>
      </div>
    );
  }
}

export default About;

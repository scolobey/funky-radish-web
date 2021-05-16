import React, { Component } from 'react';
import { Helmet } from "react-helmet";

class Support extends Component {
  render() {
    return (
      <div className="AboutContainer">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Funky Radish Recipe App - Support</title>
        </Helmet>

        <div className="Static-Info">
          <h2>For help or questions regarding any of the Funky Radish apps contact <i>chat@funkyradish.com</i>.</h2>
        </div>

      </div>
    );
  }
}

export default Support;

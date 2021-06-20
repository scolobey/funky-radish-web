import React, { Component } from 'react';
import { Helmet } from "react-helmet";

class Admin extends Component {
  render() {
    return (
      <div className="AdminContainer">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Funky Radish Recipe App - Admin</title>
        </Helmet>

        <a href='/admin/importer' >Importer</a>
        <br></br>
        <a href='/admin/graph' >Graph</a>
        <br></br>
        <a href='/admin/recipes' >Recipes</a>
        <br></br>
        <a href='/admin/users' >Users</a>
        <br></br>
      </div>
    );
  }
}

export default Admin;

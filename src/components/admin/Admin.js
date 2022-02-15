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
        <div className="admin_options">
          <a href='/admin/importer' >Importer</a>
          <a href='/admin/graph' >Graph</a>
          <a href='/admin/recipes' >Recipes</a>
          <a href='/admin/users' >Users</a>
        </div>
      </div>
    );
  }
}

export default Admin;

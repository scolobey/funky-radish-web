import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Redirector extends Component {

  componentWillUnmount() {
    console.log("unmounting redirect.")
  }

  render() {
    return (
          (this.props.redirect) ? ( <Redirect to={this.props.redirect} /> ) : (<div></div>)
    );
  }
}

function mapStateToProps(state) {
  return {
    redirect: state.redirect
  };
}

export default connect(mapStateToProps)(Redirector);

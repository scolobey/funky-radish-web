import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'

import { verifyEmail } from "../actions/Actions";

export class Verification extends Component {

  constructor(props) {
    super(props);

    let token = props.match.params.token;

    this.state = {
      token: token || '',
      verified: "Just a moment while we verify your account..."
    };
  }

  componentDidMount() {
    this.props.verifyEmail(this.state.token);
    // if(this.state.token.length > 0) {
    //   this.props.verifyEmail(this.state.token);
    // }
  }

  render() {

    return (
      <div className="verificationView">
        <b>{this.props.verified}</b>
      </div>
    );

  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
    verified: state.verified
  };
}

export default connect(mapStateToProps, { verifyEmail })(Verification);

// export default Verification;

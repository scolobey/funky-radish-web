import React, { Component } from 'react';
import { connect } from "react-redux";

class Warning extends Component {

  render() {
    return ( (this.props.warnings.length < 1) ? (<div></div>) : (
      <div className="warning-container">
        {this.props.warnings.map(warning => (
          <b>{warning.message}</b>
        ))}
      </div>
    ));
  }

}

function mapStateToProps(state) {
  return {
    warnings: state.warnings
  };
}

export default connect(mapStateToProps)(Warning);

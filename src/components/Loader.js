import React, { Component } from 'react';
import { connect } from "react-redux";

class Loader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: props.loader || false
    };
  }

  render() {
    return ( !this.props.loader ? (<div></div>) : (
      <div className="loader-container">
        <svg version="1.1"
        	className="svg-loader"
        	x="0px"
        	y="0px"
        	viewBox="0 0 80 80">

        	<path
        		id="spinner"
        		fill="rgb(168,168,168)"
        		d="M40,72C22.4,72,8,57.6,8,40C8,22.4,
        		22.4,8,40,8c17.6,0,32,14.4,32,32c0,1.1-0.9,2-2,2
        		s-2-0.9-2-2c0-15.4-12.6-28-28-28S12,24.6,12,40s12.6,
        		28,28,28c1.1,0,2,0.9,2,2S41.1,72,40,72z"
        	>

        		<animateTransform
        			attributeType="xml"
        			attributeName="transform"
        			type="rotate"
        			from="0 40 40"
        			to="360 40 40"
        			dur=".9s"
        			repeatCount="indefinite"
        		/>
        	</path>
        </svg>

      </div>

    ));
  }
}

function mapStateToProps(state) {
  return {
    loader: state.loader
  };
}

export default connect(mapStateToProps)(Loader);

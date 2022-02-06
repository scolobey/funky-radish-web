import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { toggleLoader } from "../actions/Actions";

export default function Loader(props) {

  const dispatch = useDispatch()
  var loader = useSelector((state) => state.loader)

  console.log("loader proxy: " + loader )

  if (props.loader) {
    if (props.loader == 'true') {
      console.log("props loader true: " + props.loader )

    }
    else {
      console.log("props loader false: " + props.loader )

    }
  } else {
    console.log("props loader no existe: " + props.loader )
    
  }

  return !loader ? (<div></div>) : (
    <div className="loader">
      Loading...
    </div>
  );
}

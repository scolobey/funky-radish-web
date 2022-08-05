import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { toggleLoader } from "../actions/Actions";

export default function Loader(props) {

  const dispatch = useDispatch()
  var loader = useSelector((state) => state.loader)

  return !loader ? (<div></div>) : (
    <div className="loader">
      Loading...
    </div>
  );
}

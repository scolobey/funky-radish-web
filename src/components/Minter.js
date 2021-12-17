import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux'

import { setRedirect } from "../actions/Actions";

import { Helmet } from "react-helmet";

export default function Minter(props) {

  const redirector = useSelector((state) => state.redirect)
  const dispatch = useDispatch()

  let preview = props.match.params.preview;

  const [ image, setImage ] = React.useState('')

  useEffect(() => {
      if (preview && preview.length > 0) {
        setImage(props.preview)
      }
      else {
        setImage('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect fill="#ddd" width="1920" height="1080"/><text fill="rgba(0,0,0,0.5)" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">1920×1080</text></svg>')
      }
  });

  return (
    <div className="minter">
      <div className="svg_preview">
        <img width='840' height='530' src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`} />
      </div>
    </div>
  );
}

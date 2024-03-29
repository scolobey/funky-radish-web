import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown';

export default function BlogPost(props) {


  const [ blogPost, setBlogPost ] = useState('')

  const getPosts = async() => {
    // await fetch(readMePath)
    // .then(response => {
    //   return response.text()
    // })
    // .then(text => {
    //   console.log(text)
    //   console.log(postTitle);
    //   setBlogPost(text)
    // })
  }

  useEffect(() => {
    console.log("useEffect on blog load");
    getPosts()
  });

  return <div className="blog">
    <ReactMarkdown>
      {props.markdown}
    </ReactMarkdown>
  </div>
}

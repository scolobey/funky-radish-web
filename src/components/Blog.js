import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from 'react-redux'

export default function Blog(props) {

  // let postTitle = props.match.params.post

  // const [ blogPost, setBlogPost ] = useState('')

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
    This is where the blog content will be.
  </div>
}

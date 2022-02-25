import React, { Component, Suspense, lazy, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { toggleMenu } from "../actions/Actions";

import Menu from './Menu';
import SearchBar from './SearchBar';

export default function Navigation(props) {

  var menu = useSelector((state) => state.menu)
  const dispatch = useDispatch()

  const toggle = (e) => {
    dispatch(toggleMenu())
  };

  return (
    <div className="App">
      <Menu/>

      <header className="header">
        <a href="/">
          <img
            className="icon"
             srcSet="/icon/icon-small.webp 1x, /icon/icon-medium.webp 2x"
             src="/icon/icon-medium.webp"
             alt="FunkyRadish Icon"
          />
        </a>

        <SearchBar/>

        <div id="Nav-Icon" className={menu ? 'open' : ''} onClick={toggle}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

    </div>
  )
}

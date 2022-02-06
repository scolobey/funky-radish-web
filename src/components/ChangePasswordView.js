// TODO: Remove useEffect
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import {useLocation} from "react-router-dom";

import { setRedirect, changePassword } from "../actions/Actions";

export default function ChangePasswordView(props) {
  const dispatch = useDispatch()

  const [ newPassword, setNewPassword ] = React.useState("")
  const [ token, setToken ] = React.useState("")

  React.useEffect(() => {
     setToken(props.match.params.token)
  },[])


  return (
    <div className="reset_password_view">
      <form onSubmit={e => {
          e.preventDefault();
          console.log("submitting with new password: " + newPassword)
        }}
      >
        <div className="reset_password_form">
          <div className="reset_password_header">
            <h2>Wanna change your password?</h2>
            <h1>Type the new one below.</h1>
          </div>

          <div className="new_password">
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              id="new_password"
              value={newPassword}
              onChange={(e) => {
                e.preventDefault();
                setNewPassword(e.target.value);
              }}
            />
          </div>

          <button className="submit" value="SUBMIT" onClick={e => {
              e.preventDefault();
              console.log("clicked")

              dispatch(changePassword({
                newPassword: newPassword,
                token: token
              }))

              setNewPassword("")
            }}>
            CHANGE PASSWORD
          </button>

        </div>
      </form>
    </div>
  )
}

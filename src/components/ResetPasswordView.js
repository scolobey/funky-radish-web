// TODO: Remove useEffect
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { setRedirect } from "../actions/Actions";

export default function ResetPasswordView(props) {
  let secret = props.match.params.secret

  const redirector = useSelector((state) => state.redirect)

  const [ newPassword, setNewPassword ] = React.useState("")
  const [ userEmail, setUserEmail ] = React.useState("")
  const [ token, setToken ] = React.useState("")

  React.useEffect(() => {
    setToken(props.match.params.token)

     console.log("setting token: " + token)
  },[])

  return (
    <div className="reset_password_view">
      <form onSubmit={e => {
          e.preventDefault();
          console.log("submitting with new password: " + newPassword)
          console.log("submitting with user email: " + userEmail)

        }}
      >

      <div className="reset_password_form">
        <div className="header">
          <h1>Reset Your Password</h1>
        </div>

        <div className="new_password">
          <input
            type="text"
            className="form-control"
            placeholder="New Password"
            id="new_password"
            value={newPassword? newPassword.title : ""}
            onChange={(event) => {
              setNewPassword(event.target.value);
            }}
          />
        </div>
      </div>

      <button type="submit" value="SUBMIT">
        SUBMIT
      </button>
      </form>
    </div>
  )
}

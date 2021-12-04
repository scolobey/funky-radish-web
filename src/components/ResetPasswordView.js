// TODO: Remove useEffect
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { setRedirect, changePassword } from "../actions/Actions";

import RealmService from '../services/RealmService'
const realmService = new RealmService();

export default function ResetPasswordView(props) {
  const dispatch = useDispatch()
  const redirector = useSelector((state) => state.redirect)

  const [ newPassword, setNewPassword ] = React.useState("")
  const [ userEmail, setUserEmail ] = React.useState("")
  const [ token, setToken ] = React.useState("")

  React.useEffect(() => {
    setToken(props.match.params.token)
  },[])

  return (
    <div className="reset_password_view">
      <form onSubmit={e => {
          e.preventDefault();
          console.log("submitting with new password: " + newPassword)
          console.log("submitting with token: " + token)

          dispatch(changePassword({
            newPassword: newPassword,
            token: token
          }))
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
              console.log("clicked: " + newPassword + ", " + userEmail + ", " + token)
              realmService.changePassword("minedied@gmail.com", newPassword)
            }}>
            BUTTON
          </button>

        </div>
      </form>
    </div>
  )
}

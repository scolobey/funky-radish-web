// TODO: Remove useEffect
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {useLocation} from "react-router-dom";

import { setRedirect, changePassword } from "../actions/Actions";

import RealmService from '../services/RealmService'
const realmService = new RealmService();

export default function ResetPasswordView(props) {
  const dispatch = useDispatch()
  const redirector = useSelector((state) => state.redirect)

  const search = useLocation().search;
  const token = new URLSearchParams(search).get('token');
  const tokenId = new URLSearchParams(search).get('tokenId');

  const [ newPassword, setNewPassword ] = React.useState("")

  return (
    <div className="reset_password_view">
      <form onSubmit={e => {
          e.preventDefault();
          console.log("submitting with new password: " + newPassword)
          console.log("submitting with token: " + token)
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

              // const theToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsInVzZXIiOiJtaW5lZGllZEBnbWFpbC5jb20iLCJzdWIiOiI2MGQ3OWNiMzhlNDQ2MjAwMTVlNjdlZWMiLCJhdWQiOiJmdW5reS1yYWRpc2gtdHdkeHYiLCJhdXRob3IiOiI2MGUxMzc2YjViM2VkNDM2NzdlYTU4ZDIiLCJpYXQiOjE2MzkxNzI1NDksImV4cCI6MTYzOTI1ODk0OX0.uBhnxcNP3bkD34kdUyJnX9BVlbuNrw0zeVhdW-NdSmahQby-xg6WbKGFH7m7WlXYUlNnIMG91_je0dwXVuFCzVRTR8fdWR_9NLiI5xMy69f8Tdb77nQip47KcCWK8TraZLrVt4g5zIKA-it3xAosuW8bnv7RB-Wzqj_TgNoFohE--T9Y1_OzDk7xQIGtZ1RZ-HaqQAThDhmyxn9xaH2kmB7zEKHTKT6erMRiH7YkkhhCmdJZVwh4LyKilJKaGl98ss-7umVNFDEyUkCuqUZ0r-qhWi83ZLmqn-SH3QgwYgNnJRrPUMKhrNF-h2-J7xfLN4NskweCH8ItBasZDJlT6w"
              //
              // realmService.jwtLogin(theToken)
              // .then(res => {
              //   console.log("Cool: " + JSON.stringify(res))
              // })
              // .catch(err => {
              //   console.log("err: " + err)
              // })

              realmService.changePassword(newPassword, token, tokenId)
              .then(res => {
                // Now login to Realm, get the user id, get a token
                dispatch(changePassword({
                  newPassword: newPassword,
                  token: token
                }))

                console.log("Cool. Try logging in with your new password.")
              })
              .catch(err => {
                console.log("err: " + err)
              })


            }}>
            BUTTON
          </button>

        </div>
      </form>
    </div>
  )
}

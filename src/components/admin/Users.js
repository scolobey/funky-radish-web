import React, { Component } from 'react';
import { useDispatch } from 'react-redux'
import useUsers from "../../graphql/useUsers";
import { warning } from "../../actions/Actions";

function UsersAdmin(props) {
  const dispatch = useDispatch()

  const { loading, error, data } = useUsers();

  if(error) {
    dispatch(warning(error.message))
  }

  if(data) {
    console.log(data)
  }

  return data?.users? (
    <div className="user_view">

    Total Users: {data.users.length}

    { data.users.length > 0 ?  (
      <table>
        <tr>
          <th>Email</th>
          <th>atlas _id</th>
          <th>realm _id</th>
          <th>Admin</th>
          <th>Verified</th>
        </tr>
        {data.users.map((user) =>
          <tr key={user._id.toString()}>
            <td>{user.email}</td>
            <td>{user._id}</td>
            <td>{user.author}</td>
            <td>{user.admin? ("true"):("false")}</td>
            <td>{user.verified? ("true"):("false")}</td>
          </tr>
        )}
      </table> ) :
      <div>
        No users.
      </div> }
    </div>
  ):(
    <div> Loading... </div>
  );

}

export default UsersAdmin;

import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import RealmService from '../services/RealmService'
const realmService = new RealmService();

const useUsers = () => {
  const { loading, error, data } = useAllUsersInProject();

  return { loading, error, data };
};

export default useUsers;

function useAllUsersInProject() {

  let USER_QUERY = gql`
    query Users {
      users {
        _id
        email
        author
        admin
        verified
      }
    }`;

  const { loading, error, data } = useQuery(USER_QUERY, {
    onCompleted: () => {console.log("query completed.")}
  });

  //TODO: Set the user and adjust the menu.
  return { loading, error, data};
}

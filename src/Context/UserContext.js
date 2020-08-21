import React from "react";
const UserContext = React.createContext({
  User: {
    value: [],
    updateUser: () => {},
}});

export default UserContext;

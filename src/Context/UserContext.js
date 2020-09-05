import React from "react";
const UserContext = React.createContext({
  user: {
    value: [],
    updateUser: () => {},
}});

export default UserContext;

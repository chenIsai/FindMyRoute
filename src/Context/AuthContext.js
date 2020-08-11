import React from "react";
const AuthContext = React.createContext({
  tokens: {
    accessToken: "",
    refreshToken: "",
    updateAccess: () => {},
    updateRefresh: () => {},
}});

export default AuthContext;

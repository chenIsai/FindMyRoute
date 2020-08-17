import React from "react";
const AuthContext = React.createContext({
  tokens: {
    accessToken: "",
    refreshToken: "",
    updateAccess: () => {},
    updateRefresh: () => {},
    refreshAccess: () => {},
}});

export default AuthContext;

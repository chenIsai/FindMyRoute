import React from "react";
const AuthContext = React.createContext({
  tokens: {
    accessToken: "",
    refreshToken: "",
    updateAccess: () => {},
    updateRefresh: () => {},
    refreshAccess: () => {},
    logout: () => {},
}});

export default AuthContext;

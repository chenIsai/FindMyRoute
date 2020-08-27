import React from "react";
const AuthContext = React.createContext({
  tokens: {
    accessToken: "",
    refreshToken: "",
    updateTokens: () => {},
    refreshAccess: () => {},
    logout: () => {},
}});

export default AuthContext;

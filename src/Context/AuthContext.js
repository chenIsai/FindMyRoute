import React from "react";
const AuthContext = React.createContext({
  tokens: {
    accessToken: "",
    refreshToken: "",
    setTokens: () => {},
    refreshAccess: () => {},
    logout: () => {},
}});

export default AuthContext;

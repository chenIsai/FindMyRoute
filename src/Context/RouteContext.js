import React from "react";
const RouteContext = React.createContext({
  route: {
    value: [],
    updateRoute: () => {},
    clearRoute: () => {},
}});

export default RouteContext;

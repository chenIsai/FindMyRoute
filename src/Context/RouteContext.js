import React from "react";
const RouteContext = React.createContext({
  unit: {
    value: null,
    updateRoute: () => {},
    clearRoute: () => {},
}});

export default RouteContext;

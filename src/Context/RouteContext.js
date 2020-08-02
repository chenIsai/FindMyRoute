import React from "react";
const RouteContext = React.createContext({
  unit: {
    value: null,
    updateUnit: () => {},
}});

export default RouteContext;

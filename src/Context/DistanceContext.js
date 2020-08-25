import React from "react";
const DistanceContext = React.createContext({
  distance: {
    value: [],
    total: 0,
    updateDistance: () => {},
    clearDistance: () => {},
}});

export default DistanceContext;

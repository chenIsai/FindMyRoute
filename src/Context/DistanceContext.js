import React from "react";
const DistanceContext = React.createContext({
  distance: {
    value: 0,
    updateDistance: () => {},
}});

export default DistanceContext;

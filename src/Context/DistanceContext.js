import React from "react";
const DistanceContext = React.createContext({
  distance: {
    value: [],
    total: 0,
    conversion: {
      km: 0,
      mi: 0,
    },
    updateDistance: () => {},
    clearDistance: () => {},
}});

export default DistanceContext;

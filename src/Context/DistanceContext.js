import React from "react";
const DistanceContext = React.createContext({
  distance: 0,
  updateDistance: () => {},
});

export default DistanceContext;

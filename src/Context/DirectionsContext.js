import React from "react";
const DirectionsContext = React.createContext({
  directions: {
    value: [],
    isRunning: false,
    updateDirections: () => {},
    setRunning: () => {},
}});

export default DirectionsContext;

import React from "react";
const RunContext = React.createContext({
  run: {
    distance: 0,
    directions: [],
    isRunning: false,
    updateDistance: () => {},
    updateDirections: () => {},
    setRunning: () => {},
    clearRun: () => {},
}});

export default RunContext;

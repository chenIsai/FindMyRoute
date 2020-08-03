import React from "react";
const DirectionsContext = React.createContext({
  directions: {
    value: [],
    updateDirections: () => {},
}});

export default DirectionsContext;

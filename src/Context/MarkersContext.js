import React from "react";
const MarkersContext = React.createContext({
  markers: {
    value: [],
    updateMarkers: () => {},
    clearMarkers: () => {},
}});

export default MarkersContext;

import React from "react";
const MarkersContext = React.createContext({
  markers: [],
  updateMarkers: () => {},
  clearMarkers: () => {},
});

export default MarkersContext;

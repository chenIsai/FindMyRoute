import React from "react";
const RouteContext = React.createContext({
  route: {
    value: [],
    updateRoute: () => {},
    clearRoute: () => {},
}});

export default RouteContext;

// Routes use:
// response.routes[0].overview_polyline.points
// response.routes[0].legs[0].distance

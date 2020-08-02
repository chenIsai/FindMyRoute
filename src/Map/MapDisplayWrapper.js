import React, {useContext} from "react";

import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import MarkersContext from "../Context/MarkersContext";
import RouteContext from "../Context/RouteContext";

import MapDisplay from "./MapDisplay";

function MapDisplayWrapper(props) {
  const unit = useContext(UnitContext);
  const distance = useContext(DistanceContext);
  const markers = useContext(MarkersContext);
  const route = useContext(RouteContext);
  return (
    <MapDisplay unit={unit} distance={distance} markers={markers} route={route} navigation={props.navigation} />
  )
}

export default MapDisplayWrapper;

import React, {useContext} from "react";

import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import MarkersContext from "../Context/MarkersContext";

import MapDisplay from "./MapDisplay";

function MapDisplayWrapper(props) {
  const unit = useContext(UnitContext);
  const distance = useContext(DistanceContext);
  const markers = useContext(MarkersContext);
  return (
    <MapDisplay unit={unit} distance={distance} markers={markers} navigation={props.navigation} />
  )
}

export default MapDisplayWrapper;

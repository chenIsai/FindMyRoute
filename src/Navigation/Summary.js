import React, {useContext} from "react";
import {View, Text} from "react-native";

import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import MarkersContext from "../Context/MarkersContext";

function Summary() {
  const distance = useContext(DistanceContext);
  const unit = useContext(UnitContext);
  return (
    <View>
      <Text>{distance.value}</Text>
      <Text>{unit.value}</Text>
    </View>
  )
}

export default Summary;

import React, {useContext} from "react";
import {View, Text, TouchableNativeFeedback} from "react-native";

import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import MarkersContext from "../Context/MarkersContext";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "./Header";

const Summary = (props) => {
  const distance = useContext(DistanceContext);
  const unit = useContext(UnitContext);
  const showDistance = unit.value === "m" ? distance.total : (
    unit.value === "km" ? distance.total/1000 : Math.round((distance.total/1609 + Number.EPSILON) * 100)/100);
  return (
    <View>
      <Header navigation={props.navigation} header={"Display"}/>
      <Text>{showDistance}</Text>
      <Text>{unit.value}</Text>
    </View>
  )
}

export default Summary;

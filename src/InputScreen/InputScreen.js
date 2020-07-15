import React from "react";
import {View, StyleSheet} from "react-native";
import DistanceInput from "./distanceInput.js";
import UnitInput from "./unitInput.js";

export default class InputScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View>
          <DistanceInput getDistance={this.props.getDistance} updateDistance={this.props.updateDistance}/>
        </View>
        <View>
          <UnitInput getUnit={this.props.getUnit} updateUnit={this.props.updateUnit}/>
        </View>
      </View>
    );
  }
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#F5FCFF"
  },
});

import React from "react";
import {Text, View, StyleSheet} from "react-native";
import {Picker} from "@react-native-community/picker";


export default class UnitPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unit: null
    }
  }

  updateUnit = (unitValue, unitIndex) => {
    this.setState({unit: unitValue});
    this.props.updateUnit(unitValue);
  };

  render() {
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.state.unit}
          style={{height:50, width:100}}
          onValueChange={this.updateUnit}
          >
            <Picker.Item label="km" value="km" />
            <Picker.Item label="m" value="m" />
            <Picker.Item label="mi" value ="mi" />
        </Picker>
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

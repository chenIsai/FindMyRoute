import React from "react";
import {Text, TextInput, View, StyleSheet} from "react-native";

export default class DistanceInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "1"
    }
  }

  updateText = (text) => {
    this.setState({text});
    this.props.updateDistance(text);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Distance"
          keyboardType="numeric"
          onChangeText={this.updateText}
          defaultValue={"1"}
          maxLength={10}
          />
      </View>
    )
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

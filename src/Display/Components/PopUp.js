import React, {useRef} from "react";
import {Animated, View, Text, StyleSheet, Button} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const BottomPopUp = (props) => {
  const popAnimation = useRef(new Animated.Value(0)).current;

  const showPopUp = () => {
    Animated.sequence([
      Animated.timing(popAnimation, {toValue: -50, duration: 100, useNativeDriver: true}),
      Animated.delay(3000),
      Animated.timing(popAnimation, {toValue: 0, duration: 100, useNativeDriver: true})
    ]).start();
  }

  return (
    <View style={{flex: 1}}>
      <Button title={"Show"} onPress={() => showPopUp()} />
      <Animated.View style={[styles.container, {transform: [{translateY: popAnimation}]}]}>
        <View>
          <Text>No Internet Connection! </Text>
        </View>
      </Animated.View>
    </View>

  )
}

export default BottomPopUp;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "grey"
  },
});

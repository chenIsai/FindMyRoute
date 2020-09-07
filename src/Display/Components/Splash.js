import React from "react";
import {View, Text, StyleSheet} from "react-native";

const Splash = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#67cfb3",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  }
})

export default Splash;

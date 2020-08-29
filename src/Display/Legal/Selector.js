import React from "react";
import Header from "../Components/Header";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";

const Selector = ({navigation}) => {
  const routes = ["Privacy Policy", "Terms of Service", "Licenses"];
  return (
    <View style={styles.container}>
      <Header navigation={navigation} header={"Legal"} />
      {routes.map((name) => {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate(name)}>
            <View style={styles.details}>
                <Text style={{fontSize: 16, fontWeight: "bold"}}>{name}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default Selector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  details: {
    padding: 20,
    marginTop: 5,
    flexDirection: "row",
    backgroundColor: "white",
  },
})

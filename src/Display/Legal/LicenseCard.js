import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Image, Linking} from "react-native";
import licenses from "./license-docs";

const LicenseCard = (props) => {
  var name, version;
  const loadLink = () => {
    Linking.openURL(props.item.licenseUrl);
  }
  const details = props.item.name.split("@");
  if (details.length === 2) {
    [name, version] = details;
  } else {
    [, name, version] = details;
  }

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <TouchableOpacity
          onPress={loadLink}>
          <Text>{name} v{version}</Text>
          <Text style={{color: "grey"}}>License: {props.item.licenses}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LicenseCard;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 5,
    flexDirection: "row",
    backgroundColor: "white",
  },
  details: {
    flex: 1,
    padding: 4,
  }
})

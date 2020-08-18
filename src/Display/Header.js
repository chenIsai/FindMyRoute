import React from "react";
import {View, Text, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Header = (props) => {
  return (
    <View style={{padding: 15, flexDirection: "row", backgroundColor: "white"}}>
      <View style={{flexDirection: "row", flex: 1}}>
        <View style={{flexDirection: "row", alignSelf: "flex-start"}}>
          <Icon
            name={"md-menu"}
            size={30}
            onPress={() => props.navigation.openDrawer()}
          />
        </View>
        <View style={styles.headerTextView}>
          <Text style={styles.headerText}>{props.header}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerTextView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 30
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold"
  },
})
export default Header;

import React from "react";
import {View, Text, TouchableNativeFeedback, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Profile = () => {
  return (
    <View style={styles.profileView}>
      <View style={styles.profileRow}>
        <Icon
          style={styles.iconStyle}
          name={"person"}
          size={50}/>
        <View style={styles.profileText}>
          <Text style={{fontWeight: "bold"}}>Name</Text>
          <Text style={{color: "grey"}}>Username</Text>
        </View>
      </View>
      <View style={styles.detailsView}>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Text style={{fontWeight: "bold"}}>Saved Routes</Text>
          <Text style={{color: "dimgrey"}}>69</Text>
        </View>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Text style={{fontWeight: "bold"}}>Distance Ran</Text>
          <Text style={{color: "dimgrey"}}>69</Text>
        </View>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Text style={{fontWeight: "bold"}}>Saved Routes</Text>
          <Text style={{color: "dimgrey"}}>69</Text>
        </View>
      </View>
    </View>
  )
}

// <View style={styles.detailsView}>
//   <Text style={{fontWeight: "bold"}}>Saved Routes</Text>
//   <Text style={{fontWeight: "bold"}}>Distance Ran</Text>
//   <Text style={{fontWeight: "bold"}}>Yeet</Text>
// </View>
// <View style={styles.detailsView}>
//   <Text style={{color: "dimgrey"}}>69</Text>
//   <Text style={{color: "dimgrey"}}>69</Text>
//   <Text style={{color: "dimgrey"}}>69</Text>
// </View>




const Options = () => {
  return (
    <View style={styles.optionsView}>
      <Text>Placeholder</Text>
    </View>
  )
}

const Settings = () => {
  return (
    <View style={styles.container}>
      <Profile />
      <Options />
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  profileView: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: "center",
  },

  profileRow: {
    borderWidth: .5,
    flexDirection: "row",
    borderColor: "lightgrey",
    padding: 10,
    alignSelf: "center",
  },

  profileText: {
    flex: 1,
    margin: 10,
    paddingLeft: 10,
    justifyContent: "center",
  },

  detailsView: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  optionsView: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },

  iconStyle: {
    borderRadius: 55,
    borderWidth: 1,
    padding: 8,
  }
})

export default Settings;

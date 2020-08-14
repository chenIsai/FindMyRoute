import React, {useContext} from "react";
import {View, Text, TouchableNativeFeedback, StyleSheet} from "react-native";
import UnitContext from "../Context/UnitContext";
import DistanceContext from "../Context/UnitContext";
import {Picker} from "@react-native-community/picker";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "./Header";

const Settings = (props) => {
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} header={"Profile"}/>
      <Profile />
      <Details />
      <Options />
    </View>
  )
}

const Profile = () => {
  return (
    <View style={styles.profile}>
      <Icon
        style={styles.iconStyle}
        name={"person"}
        size={80}/>
      <View style={styles.textStack}>
        <Text style={{fontWeight: "bold"}}>Name</Text>
        <Text style={{color: "grey"}}>Username</Text>
      </View>
    </View>
  )
}

const Details = () => {
  const unit = useContext(UnitContext);
  const distance = useContext(DistanceContext);
  return (
    <View style={styles.detailsView}>
      <View style={{alignSelf: "baseline", alignItems: "center"}}>
        <Text style={{fontWeight: "bold"}}>Saved Routes</Text>
        <Text style={{color: "dimgrey"}}>69</Text>
      </View>
      <View style={{alignSelf: "baseline", alignItems: "center"}}>
        <Text style={{fontWeight: "bold"}}>Distance Ran</Text>
        <Text style={{color: "dimgrey"}}>{distance.value}{unit.value}</Text>
      </View>
    </View>
  )
}

const Options = () => {
  return (
    <View style={styles.optionsView}>
      <Text style={{padding: 5, paddingLeft: 10, fontWeight: "bold"}}>Options</Text>
      <View>
        <OptionsRow name={"update"} />
        <UnitPicker />
        <OptionsRow name={"clearSaved"} hide={true} />
        <OptionsRow name={"logout"} hide={true}/>
      </View>
    </View>
  )
}

const OptionsRow = (props) => {
  const callbacks = {
    "logout": () => console.log("logout"),
    "clearSaved": () => console.log("Clear Saved Routes"),
    "update": () => console.log("update"),
  };
  const names = {
    logout: "Log Out",
    clearSaved: "Clear Saved Routes",
    update: "Update Profile",
  };
  if (props.hide) {
    return (
      <TouchableNativeFeedback style={{alignSelf: "strecth"}}onPress={callbacks[props.name]}>
        <View style={styles.optionsRow}>
          <Text style={{alignSelf: "center", color: props.name ==="logout" ? "red" : "black"}}>{names[props.name]}</Text>
          <View style={{marginLeft: "auto", paddingRight: 10}}>
            <Icon
              name={"chevron-forward-sharp"}
              size={20}
              onPress={callbacks[props.name]}
              />
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
  return (
    <TouchableNativeFeedback style={{alignSelf: "strecth"}}onPress={callbacks[props.name]}>
      <View style={styles.optionsRow}>
        <Text style={{alignSelf: "center", color: props.name ==="logout" ? "red" : "black"}}>{names[props.name]}</Text>
      </View>
    </TouchableNativeFeedback>
  )
}

const UnitPicker = () => {
  const unit = useContext(UnitContext);
  return (
    <View style={styles.optionsRow}>
      <Text style={{alignSelf: "center"}}>Unit</Text>
      <View style={{marginLeft: "auto"}}>
        <Picker
          selectedValue={unit.value}
          style={{width: 100, height: 20}}
          onValueChange={(value, index) =>
          unit.updateUnit(value)}
        >
          <Picker.Item label="Km" value="km" />
          <Picker.Item label="M" value="m" />
          <Picker.Item label="Mi" value="mi"/>
        </Picker>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: "center",
  },

  iconStyle: {
    borderRadius: 55,
    borderWidth: 1,
    padding: 8,
  },

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


  profile: {
    flex: 1,
    borderWidth: .5,
    borderColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#67cfb3",
  },

  textStack: {
    alignSelf: "center",
    alignItems: "center",
    padding: 10
  },

  detailsView: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  optionsView: {
    flex: 2,
    paddingTop: 10,
    paddingBottom: 10,
  },

  optionsRow: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 0.2,
    borderWidth: 0.3,
    backgroundColor: "white",
    borderColor: "silver",
  }

})

export default Settings;

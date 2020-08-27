import React, {useContext, useState} from "react";
import {View, Text, TouchableNativeFeedback, StyleSheet} from "react-native";

import UnitContext from "../Context/UnitContext";
import DistanceContext from "../Context/UnitContext";
import AuthContext from "../Context/AuthContext";
import UserContext from "../Context/UserContext";

import {Picker} from "@react-native-community/picker";
import Icon from "react-native-vector-icons/Ionicons";
import links from "../Authentication/link";
import Header from "./Header";
import Modal from "react-native-modal";
import {createStackNavigator} from "@react-navigation/stack";
import EditUsername from "./EditUsername";
import EditPassword from "./EditPassword";

const Stack = createStackNavigator();

const Settings = (props) => {
  return (
    <Stack.Navigator screenOptions = {{headerShown: false}}>
      <Stack.Screen name={"Profile"} component={MainScreen}/>
      <Stack.Screen name={"EditNames"} component={EditUsername} />
      <Stack.Screen name={"EditPass"} component={EditPassword} />
    </Stack.Navigator>
  )
}

const MainScreen = (props) => {
  const [modalVisible, setVisible] = useState(false);
  const [buttonID, updateID] = useState(0);
  const tokens = useContext(AuthContext);
  const logoutText = "Are you sure you want to log out?";
  const deleteText = "Are you sure you want to delete ALL routes?";

  const openModal = (id) => {
    updateID(id);
    setVisible(true);
  }

  const logout = () => {
    fetch(links.logout, {
      method: "DELETE",
      body: JSON.stringify({
        token: tokens.refreshToken}),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((response) => {
      tokens.logout();
    }).catch((error) => {
      console.log(error);
    });
  }

  const clearRoutes = () => {
    fetch(links.deleteALL, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      if (response.ok) {
        Alert.alert("Success!");
      } else if (response.status === 403) {
        tokens.refreshTokens;
        Alert.alert("Error occured while deleting! Please try again!");
      } else {
        Alert.alert("Unexpected Error " + response.status);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={modalVisible}
        onRequestClose={() => {
          setVisible(false);
        }}
        onBackdropPress={() => {
          setVisible(false);
        }}
        backdropOpacity={0}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={{fontSize: 20, padding: 10}}>{buttonID === 1 ? "Log Out " : "Delete "}Confirmation</Text>
            <Text style={{fontSize: 18, padding: 10, marginBottom: 30}}>{buttonID === 1 ? logoutText : deleteText }</Text>
            <View style = {{flexDirection: "row",}}>
              <TouchableNativeFeedback
                onPress={() => setVisible(false)}>
                <View style={styles.cancelButton}>
                  <Text style={{fontWeight: "bold", color: "grey"}}>Cancel</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={() => {
                  if (buttonID === 1) {
                    logout();
                  } else {
                    clearRoutes();
                    setVisible(false);
                  }
                }}>
                <View style={styles.negativeButton}>
                  <Text style={{color: "white"}}>{buttonID === 1 ? "Log me out!" : "Delete ALL Routes"}</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </Modal>
      <Header navigation={props.navigation} header={"Profile"}/>
      <Profile />
      <Details />
      <Options navigation={props.navigation} showModal={(id) => openModal(id)}/>
    </View>
  )
}

const Profile = () => {
  const user = useContext(UserContext);
  return (
    <View style={styles.profile}>
      <View style={styles.textStack}>
        <Text style={{fontWeight: "bold"}}>{user.value ? user.value.name : "Not connected"}</Text>
        <Text style={{color: "grey"}}>{user.value ? user.value.username : ""}</Text>
      </View>
    </View>
  )
}

const Details = () => {
  const unit = useContext(UnitContext);
  const user = useContext(UserContext);
  return (
    <View style={styles.detailsView}>
      <View style={{alignSelf: "baseline", alignItems: "center"}}>
        <Text style={{fontWeight: "bold"}}>Saved Routes</Text>
        <Text style={{color: "dimgrey"}}>{user.value ? user.value.routes : 0}</Text>
      </View>
      <View style={{alignSelf: "baseline", alignItems: "center"}}>
        <Text style={{fontWeight: "bold"}}>Distance Ran</Text>
        <Text style={{color: "dimgrey"}}>{user.value ? user.value.distance : 0} {unit.value}</Text>
      </View>
    </View>
  )
}

const Options = (props) => {
  return (
    <View style={styles.optionsView}>
      <Text style={{padding: 5, paddingLeft: 10, fontWeight: "bold"}}>Options</Text>
      <View>
        <OptionsRow name={"editName"} navigation={props.navigation}/>
        <OptionsRow name={"editPass"} navigation={props.navigation}/>
        <UnitPicker />
        <OptionsRow name={"clearSaved"} hide={true} showModal={props.showModal}/>
        <Logout showModal={props.showModal}/>
      </View>
    </View>
  )
}

const OptionsRow = (props) => {
  const user = useContext(UserContext)
  const callbacks = {
    "clearSaved": () => props.showModal(0),
    "editName": () => props.navigation.navigate("EditNames", {
      username: user.value.username,
      name: user.value.name,
    }),
    "editPass": () => props.navigation.navigate("EditPass"),
  };
  const names = {
    clearSaved: "Clear Saved Routes",
    editName: "Update Username or Name",
    editPass: "Update Password"
  };
  if (!props.hide) {
    return (
      <TouchableNativeFeedback style={{alignSelf: "strecth"}}onPress={callbacks[props.name]}>
        <View style={styles.optionsRow}>
          <Text style={{alignSelf: "center"}}>{names[props.name]}</Text>
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
    <TouchableNativeFeedback style={{alignSelf: "stretch"}}onPress={callbacks[props.name]}>
      <View style={styles.optionsRow}>
        <Text style={{alignSelf: "center", color: props.name ==="logout" ? "red" : "black"}}>{names[props.name]}</Text>
      </View>
    </TouchableNativeFeedback>
  )
}

const Logout = (props) => {
  return (
    <TouchableNativeFeedback onPress={() => props.showModal(1)}>
      <View style={styles.optionsRow}>
        <Text style={{alignSelf: "center", color: "red"}}>Log Out</Text>
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
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    width: 350,
    backgroundColor: "white",
    elevation: 6,
    overflow: "hidden"
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    marginTop: 0,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "grey"
  },

  negativeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    marginTop: 0,
    padding: 15,
    backgroundColor: "#ED4337",
    borderRadius: 5,
  },

})

export default Settings;

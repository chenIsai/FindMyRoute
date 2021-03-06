import React, {useContext, useState, useEffect} from "react";
import {View, Text, TouchableNativeFeedback, StyleSheet, Alert} from "react-native";

import UnitContext from "../../Context/UnitContext";
import AuthContext from "../../Context/AuthContext";
import UserContext from "../../Context/UserContext";

import {Picker} from "@react-native-community/picker";
import Icon from "react-native-vector-icons/Ionicons";
import links from "../../Authentication/link";
import Header from "../Components/Header";
import Modal from "react-native-modal";

const MainScreen = (props) => {
  const [modalVisible, setVisible] = useState(false);
  const [buttonID, updateID] = useState(0);
  const [clearPressed, setClear] = useState(false);
  const [deleteUser, setDelete] = useState(false);
  const tokens = useContext(AuthContext);
  const user = useContext(UserContext);
  const logoutText = "Are you sure you want to log out?";
  const clearText = "Are you sure you want to delete ALL routes?";
  const deleteText = "Are you sure you want to PERMANENTLY delete your account?";

  useEffect(() => {
    if (clearPressed) {
      clearRoutes();
      setClear(false);
    } else if (deleteUser) {
      deleteAccount();
    }
    if (tokens.accessToken !== "") {
      user.updateUser();
    }
  }, [tokens.accessToken]);

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

  const deleteAccount = () => {
    fetch(links.deleteAccount, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      if (response.status === 401) {
        tokens.refreshTokens();
        if (!deleteUser) {
          setDelete(true);
        }
      } else {
        tokens.logout();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  const clearRoutes = () => {
    fetch(links.deleteRoutes, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      if (response.ok) {
        Alert.alert("Success!");
      } else if (response.status === 401) {
        tokens.refreshTokens();
        setClear(true);
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
            <Text style={{fontSize: 20, padding: 10}}>{buttonID === 1 ? "Log Out " : (buttonID === 2 ? "Clear Routes " : "Delete Account ")}Confirmation</Text>
            <Text style={{fontSize: 18, padding: 10, marginBottom: 30}}>{buttonID === 1 ? logoutText : (buttonID === 2 ? clearText : deleteText) }</Text>
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
                  } else if (buttonID === 2){
                    clearRoutes();
                    setVisible(false);
                  } else {
                    deleteAccount();
                  }
                }}>
                <View style={styles.negativeButton}>
                  <Text style={{color: "white"}}>{buttonID === 1 ? "Log me out!" : (buttonID === 2 ? "Delete ALL Routes" : "Delete Account")}</Text>
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
        <Text style={{fontSize: 24}}>{user.value && user.value.name ? "Welcome back, " + user.value.name : ""}</Text>
        <Text style={{marginTop: 10, color: "gray"}}>{user.value ? user.value.username : ""}</Text>
      </View>
    </View>
  )
}

const Details = () => {
  const unit = useContext(UnitContext);
  const user = useContext(UserContext);
  const showDistance = !user.value ? 0 : (unit.value === "km" ? Math.round((user.value.distance/1000 + Number.EPSILON) * 1000)/1000  : Math.round((user.value.distance/1609 + Number.EPSILON) * 100)/100);
  return (
    <View style={styles.detailsView}>
      <View style={{alignSelf: "baseline", alignItems: "center"}}>
        <Text style={{fontWeight: "bold"}}>Saved Routes</Text>
        <Text style={{color: "dimgrey"}}>{user.value ? user.value.routes : 0}</Text>
      </View>
      <View style={{alignSelf: "baseline", alignItems: "center"}}>
        <Text style={{fontWeight: "bold"}}>Distance Ran</Text>
        <Text style={{color: "dimgrey"}}>{showDistance} {unit.value}</Text>
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
        <Delete showModal={props.showModal}/>
      </View>
    </View>
  )
}

const OptionsRow = (props) => {
  const user = useContext(UserContext)
  const callbacks = {
    "clearSaved": () => props.showModal(2),
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

const Delete = (props) => {
  return (
    <TouchableNativeFeedback onPress={() => props.showModal(3)}>
      <View style={[styles.optionsRow, {marginTop: 25}]}>
        <Text style={{alignSelf: "center", color: "red"}}>Delete Account</Text>
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
    backgroundColor: "#f5d0a6",
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

export default MainScreen;

import React, {useContext, useState, useRef, useEffect} from "react";
import {View, Text, TouchableNativeFeedback, StyleSheet, Alert} from "react-native";

import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import MarkersContext from "../Context/MarkersContext";
import DirectionsContext from "../Context/DirectionsContext";

import Geolocation from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "./Header";

const Summary = (props) => {
  const distance = useContext(DistanceContext);
  const unit = useContext(UnitContext);
  const showDistance = unit.value === "m" ? distance.total : (
    unit.value === "km" ? Math.round((distance.total/1000 + Number.EPSILON) * 100)/100 : Math.round((distance.total/1609 + Number.EPSILON) * 100)/100);
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} header={"Display"}/>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
        <Text>{showDistance} {unit.value}</Text>
      </View>
      <CurrentRun />
    </View>
  )
}

export default Summary;

const CurrentRun = () => {
  const directions = useContext(DirectionsContext);
  const [time, updateTime] = useState(0);
  const [latLonArr, updatelatLon] = useState([]);
  const timerRef = useRef();

  const startTimer = () => {
    const interval = setInterval(onTick, 1000);
    directions.setRunning();
    timerRef.current = interval;
  }
  const onTick = () => {
    updateTime(prevTime => {
      prevTime += 1;
      // Get user position every 5 seconds
      if (!(prevTime % 5)) {
        findPosition();
      }
      return prevTime;
    });
  }

  const stopTimer = () => {
    clearInterval(timerRef.current);
    directions.setRunning();
  }

  const findPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const latLon = [{latitude: position.coords["latitude"], longitude: position.coords["longitude"]}];
        updatelatLon(prevArr => {
          return prevArr.concat(latLon)
        });
      },
      error => {
        Alert.alert(error.message);
        throw error;
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 200 }
    );
  };

  const clearRun = () => {
    directions.updateDirections([]);
    updatelatLon([]);
    updateTime(0);
  }

  useEffect(() => {
    directions.updateDirections(latLonArr);
  }, [latLonArr]);

  return (
    <View style={styles.container}>
      <View style={styles.runDetails}>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Text style={{fontWeight: "bold"}}>Current Distance Ran</Text>
          <Text style={{color: "dimgrey"}}>Ye</Text>
        </View>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Text style={{fontWeight: "bold"}}>Average Speed</Text>
          <Text style={{color: "dimgrey"}}>Ye</Text>
        </View>
      </View>
      <TouchableNativeFeedback
        onPress={() => directions.isRunning ? stopTimer() : startTimer()}
        background={TouchableNativeFeedback.Ripple("grey")}
        >
        <View style={styles.startStopButton}>
          <Text style={{color: "white", fontSize: 24,}}>{directions.isRunning ? "Stop run" : "Start Run"}</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => clearRun()}
        background={TouchableNativeFeedback.Ripple("grey")}
        >
        <View style={styles.startStopButton}>
          <Text style={{color: "white", fontSize: 24,}}>Clear Run</Text>
        </View>
      </TouchableNativeFeedback>
      <Text style={{alignSelf: "center", marginTop: 50, fontSize: 20}}> {Math.floor(time/60)}:{time % 60 > 9 ? time % 60 : "0" + time % 60}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lime"
  },

  startStopButton: {
    alignSelf: "center",
    backgroundColor: "lightblue",
    padding: 10,
  },

  runDetails: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
})

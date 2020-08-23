import React, {useContext, useState, useRef, useEffect} from "react";
import {View, Text, TouchableWithoutFeedback, StyleSheet, Alert, Animated} from "react-native";
import getDistance from "geolib/es/getDistance";

import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import DirectionsContext from "../Context/DirectionsContext";

import Geolocation from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
  const distance = useContext(DistanceContext);

  const [time, updateTime] = useState(0);
  const [latLonArr, updatelatLon] = useState([]);
  const timerRef = useRef();

  const startButtonOpacity = useRef(new Animated.Value(1)).current;
  const buttonTrayOpacity = useRef(new Animated.Value(0)).current;

  const pauseButtonX = useRef(new Animated.Value(0)).current;
  const cancelButtonX = useRef(new Animated.Value(0)).current;
  const TouchableAnimated = Animated.createAnimatedComponent(TouchableWithoutFeedback)

  // TIMER RELATED FUNCTIONS
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

  const clearRun = () => {
    directions.updateDirections([]);
    updatelatLon([]);
    updateTime(0);
  }

  // GET USER POSITION
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

  // ANIMATIONS
const hideStartButton = () => {
  Animated.timing(startButtonOpacity, {toValue: 0, duration: 200, useNativeDriver: true}).start();
}

const showStartButton = () => {
    Animated.timing(startButtonOpacity, {toValue: 1, duration: 200, useNativeDriver: true}).start();
}

const showButtonTray = () => {
  Animated.timing(buttonTrayOpacity, {toValue: 1, duration: 200, useNativeDriver: true}).start();
}

const hideButtonTray = () => {
  Animated.timing(buttonTrayOpacity, {toValue: 0, duration: 200, useNativeDriver: true}).start();
}

const animateButtonTray = (button, value) => {
  Animated.timing(button, {toValue: value, duration: 200, useNativeDriver: true}).start();
}

const startButtonAnimations = () => {
  hideStartButton();
  showButtonTray();
  animateButtonTray(cancelButtonX, 25);
  animateButtonTray(pauseButtonX, -25)
}

const buttonTrayAnimations = () => {
  hideButtonTray();
  animateButtonTray(cancelButtonX, -30);
  animateButtonTray(pauseButtonX, 30)
  showStartButton();
}

  useEffect(() => {
    var oldDistance = distance.value;
    if (latLonArr.length > 1) {
      console.log(getDistance(latLonArr[latLonArr.length-2], latLonArr.length-1));
      oldDistance += getDistance(latLonArr[latLonArr.length-2], latLonArr[latLonArr.length-1]);
      distance.updateDistance(oldDistance);
    }
    directions.updateDirections(latLonArr);
  }, [latLonArr]);

  useEffect(() => {
    hideButtonTray();
  }, []);

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
      <Text style={{alignSelf: "center", marginTop: 50, fontSize: 20}}> {Math.floor(time/60)}:{time % 60 > 9 ? time % 60 : "0" + time % 60}</Text>
      <View>
        <View style={styles.buttonTray}>
          <TouchableAnimated style={[{opacity: buttonTrayOpacity},
            {transform: [{translateX: pauseButtonX}]}]}
            onPress={() => {
              stopTimer();
              buttonTrayAnimations();
            }}
            >
            <View>
              <Icon
                style={styles.buttonIcon}
                name={"pause"}
                size={50} />
            </View>
          </TouchableAnimated>
          <TouchableAnimated style={[{opacity: buttonTrayOpacity},
            {transform: [{translateX: cancelButtonX}]}]}
            onPress={() => {
              clearRun();
              stopTimer();
              buttonTrayAnimations();
            }}
            >
            <View>
              <Icon
                style={styles.buttonIcon}
                name={"close"}
                size={50}
                />
            </View>
          </TouchableAnimated>
        </View>
        <TouchableAnimated style={{opacity: startButtonOpacity}}>
          <View style={{alignSelf: "center", overflow: "hidden"}}>
            <Icon
              style={styles.buttonIcon}
              name={"play"}
              size={50}
              onPress={() => {
                startTimer();
                startButtonAnimations();
              }}
              />
          </View>
        </TouchableAnimated>
      </View>
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

  buttonIcon: {
    borderRadius: 60,
    alignSelf: "baseline",
    backgroundColor: "white",
    padding: 5,
  },

  buttonTray: {
    position: "absolute",
    flexDirection: "row",
    alignSelf: "center",
    bottom: 0,
  }
})

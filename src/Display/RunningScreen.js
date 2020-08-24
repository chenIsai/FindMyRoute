import React, {useContext, useState, useRef, useEffect} from "react";
import {View, Text, TouchableWithoutFeedback, StyleSheet, Alert, Animated} from "react-native";

import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import DirectionsContext from "../Context/DirectionsContext";

import Geolocation from "react-native-geolocation-service";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "./Header";

const RunningScreen = (props) => {
  const distance = useContext(DistanceContext);
  const unit = useContext(UnitContext);
  const showDistance = unit.value === "km" ? distance.total / 1000 : Math.round((distance.total/1609 + Number.EPSILON) * 100)/100;
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} header={"Display"}/>
      <CurrentRun />
    </View>
  )
}

export default RunningScreen;

const CurrentRun = () => {
  const directions = useContext(DirectionsContext);
  const distance = useContext(DistanceContext);
  const unit = useContext(UnitContext);

  const showDistance = unit.value === "km" ? distance.total/1000 : Math.round((distance.total/1609 + Number.EPSILON) * 100)/100;

  const [time, updateTime] = useState(0);
  const [latLonArr, updateArray] = useState([]);
  const [speed, setSpeed] = useState(0);
  const timerRef = useRef();

  // TIMER RELATED FUNCTIONS
  const startTimer = () => {
    const interval = setInterval(onTick, 1000);
    directions.setRunning();
    findPosition();
    timerRef.current = interval;
  }
  const onTick = () => {
    updateTime(prevTime => {
      const newTime = prevTime + 1;
      findPosition();
      return newTime;
    });
  }

  const stopTimer = () => {
    clearInterval(timerRef.current);
    directions.setRunning();
  }

  const clearRun = () => {
    directions.updateDirections([]);
    updateArray([]);
    updateTime(0);
  }

  // GET USER POSITION
  const findPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const latLon = [{latitude: position.coords["latitude"], longitude: position.coords["longitude"]}];
        setSpeed(Math.round(position.coords.speed * 100)/100);
        if (time % 5) {
          updateArray(prevArr => {
            return prevArr.concat(latLon)
          });
        }
      },
      error => {
        Alert.alert(error.message);
        throw error;
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 200 }
    );
  };

  // ANIMATIONS
  const startButtonOpacity = useRef(new Animated.Value(1)).current;
  const buttonTrayOpacity = useRef(new Animated.Value(0)).current;
  const pauseButtonX = useRef(new Animated.Value(0)).current;
  const cancelButtonX = useRef(new Animated.Value(0)).current;
  const TouchableAnimated = Animated.createAnimatedComponent(TouchableWithoutFeedback);

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

  // Display
  const currentSpeed = () => {
    if (time) {
      return speed + " m/s";
    } else {
      return 0 + " m/s";
    }
  }

  const averageSpeed = () => {
    if (time) {
      if (unit.value === "km") {
        return Math.round(distance.total / time * 3600)/100 + " km/h";
      } else {
        return Math.round(distance.total / time * 2237)/100 + " mi/h";
      }
    } else {
      return "0 " + unit.value + "/h";
    }
  }


  // EFFECTS
  useEffect(() => {
    if (directions.isRunning) {
      directions.updateDirections(latLonArr);
    }
  }, [latLonArr]);

  useEffect(() => {
    hideButtonTray();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: "center"}}>
      <View style={styles.runDetails}>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Icon
            name={"shoe-print"}
            color={"dimgrey"}
            size={30}
            />
          <Text style={{fontSize: 20}}>{showDistance} {unit.value}</Text>
        </View>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Icon
            name={"clock-fast"}
            color={"dimgrey"}
            size={30}
            />
          <Text style={{fontSize: 20}}>{averageSpeed()}</Text>
        </View>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Ionicons
            name={"speedometer-outline"}
            color={"dimgrey"}
            size={30}
            />
          <Text style={{fontSize: 20}}>{currentSpeed()}</Text>
        </View>
      </View>
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
      <View style={{flexDirection: "row", alignItems: "center", alignSelf: "center",}}>
        <Text style={{fontSize: 20}}>{Math.floor(time/60)}:{time % 60 > 9 ? time % 60 : "0" + time % 60}</Text>
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

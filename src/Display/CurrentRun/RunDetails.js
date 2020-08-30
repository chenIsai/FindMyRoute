import React, {useContext, useState, useRef, useEffect} from "react";
import {View, Text, TouchableWithoutFeedback, StyleSheet, Alert, Animated} from "react-native";
import getPreciseDistance from "geolib/es/getPreciseDistance";

import UnitContext from "../../Context/UnitContext";
import RunContext from "../../Context/RunContext";

import Geolocation from "react-native-geolocation-service";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import links from "../../Authentication/link";
import {encode} from "@mapbox/polyline"

const RunDetails = ({navigation}) => {
  const run = useContext(RunContext);
  const unit = useContext(UnitContext);

  const [time, updateTime] = useState(0);
  const [runCoordinates, updateRunCoordinates] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [lastUsedPosition, updateLastUsed] = useState(0);
  const [currentPos, updateCurrentPosition] = useState(0);
  const [buttonState, updateButton] = useState(0);
  const timerRef = useRef();

  const changeButton = () => {
    const nextButton = (buttonState + 1) % 3;
    updateButton(nextButton);
  }

  // EFFECTS
  useEffect(() => {
    if (run.isRunning) {
      run.updateRunDirections(runCoordinates);
    }
  }, [runCoordinates]);

  useEffect(() => {
    if (lastUsedPosition) {
      const distanceBetween = getPreciseDistance(lastUsedPosition, currentPos, 0.01);
      if (distanceBetween < 20) {
        return;
      } else {
        updateRunCoordinates(prevRun => prevRun.concat(currentPos));
        updateLastUsed(currentPos);
        run.updateRunDistance(distanceBetween);
      }
    } else {
      updateLastUsed(currentPos);
    }
  }, [currentPos])

  useEffect(() => {
    hideButtonTray();
  }, []);

  // TIMER RELATED FUNCTIONS
  const startTimer = () => {
    const interval = setInterval(onTick, 1000);
    run.setRunning();
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
    run.setRunning();
  }

  const clearRun = () => {
    run.clearRun();
    updateRunCoordinates([]);
    updateTime(0);
    setSpeed(0);
    updateLastUsed(0);
    updateCurrentPosition(0);
  }

  // GET USER POSITION
  const findPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const latLon = {latitude: position.coords["latitude"], longitude: position.coords["longitude"]};
        setSpeed(Math.round(position.coords.speed * 100)/100);
        updateCurrentPosition(prevPos => latLon);
      },
      error => {
        Alert.alert(error.message);
        throw error;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
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
        return Math.round((run.distance / time * 3.6 + Number.EPSILON) * 100)/100 + " km/h";
      } else {
        return Math.round((run.distance / time * 2.237 + Number.EPSILON) * 100)/100 + " mi/h";
      }
    } else {
      return "0 " + unit.value + "/h";
    }
  }

  const showDistance = unit.value === "km" ? Math.round((run.distance/1000 + Number.EPSILON) * 1000)/1000  : Math.round((run.distance/1609 + Number.EPSILON) * 100)/100;

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Icon
            name={"shoe-print"}
            color={"grey"}
            size={30}
            />
          <Text style={{fontSize: 20}}>{showDistance} {unit.value}</Text>
        </View>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Icon
            name={"clock-fast"}
            color={"grey"}
            size={30}
            />
          <Text style={{fontSize: 20}}>{averageSpeed()}</Text>
        </View>
        <View style={{alignSelf: "baseline", alignItems: "center"}}>
          <Ionicons
            name={"speedometer-outline"}
            color={"grey"}
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
              if (run.directions.length) {
                navigation.navigate("SaveScreen")
              } else {
                Alert.alert("No route detected!");
              }
            }}
            >
            <View>
              <Ionicons
                style={styles.buttonIcon}
                name={"save-outline"}
                size={50} />
            </View>
          </TouchableAnimated>
          <TouchableAnimated style={[{opacity: buttonTrayOpacity},
            {transform: [{translateX: cancelButtonX}]}]}
            onPress={() => {
              clearRun();
              buttonTrayAnimations();
              changeButton();
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
              name={!buttonState ? "play" : "stop"}
              size={50}
              onPress={() => {
                if (!buttonState && !run.isRunning) {
                  startTimer();
                  changeButton();
                } else if (buttonState === 1 && run.isRunning) {
                  stopTimer();
                  startButtonAnimations();
                  changeButton();
                }
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

export default RunDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },

  startStopButton: {
    alignSelf: "center",
    padding: 10,
  },

  details: {
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

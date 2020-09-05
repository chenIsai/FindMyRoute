import React, {useState, useContext} from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SplitsContext from "../../Context/SplitsContext";

import Collapsible from "react-native-collapsible";

const Splits = () => {
  const [isCollapsed, setCollapsed] = useState(true);
  const splits = useContext(SplitsContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setCollapsed(!isCollapsed)}
        >
        <View style={styles.titleView}>
          <Text style={{fontSize: 16}}>Show Splits</Text>
          <Icon
            style={{marginLeft: "auto", marginRight: 10, alignSelf: "center"}}
            name={isCollapsed ? "chevron-forward-outline" : "chevron-down-outline"}
            />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        {!splits.value.length ? (
          <Text style={{fontSize: 16, padding: 10}}>
            Start running or run further to get information on your splits!</Text>
        ) : (
          splits.value.map((split, index) => {
            const time = index > 0 ? split.time - splits.value[index-1].time : split.time;
            return (
              <View style={{flexDirection: "row"}} key={split.time}>
                <Text>Split {index + 1}</Text>
                <Text style={{marginLeft: "auto", marginRight: 10}}>{Math.floor(time/60)}:{time % 60 > 9 ? time % 60 : "0" + time % 60}</Text>
              </View>
            )
          })
        )
      }
      </Collapsible>
    </View>

  )
}

export default Splits;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleView: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 2,
    padding: 10,
  }
})

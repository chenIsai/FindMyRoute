import React from "react";
import {ScrollView, View, Text, StyleSheet} from "react-native";
import privacy from "./Docs/privacy-docs";

const PrivacyPolicy = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.headerText}>
          Privacy Policy
        </Text>
        <Text style={styles.dateText}>
          Last Updated: {privacy.date}
        </Text>
        <Text style={styles.infoText}>
          {privacy.policy}
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          What Information Do We Collect
        </Text>
        <Text style={styles.infoText}>
          {privacy.information}
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          Why and How do We Use Your Information
        </Text>
        <Text style={styles.infoText}>
          {privacy.geolocation}
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          Changes Made to the Privacy Policy
        </Text>
        <Text style={styles.infoText}>
          {privacy.changes}
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          Contact Us
        </Text>
        <Text style={[styles.infoText, {paddingBottom: 50}]}>
          {privacy.contact}
        </Text>
      </View>
    </ScrollView>
  )
}
export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  headerText: {
    fontSize: 20,
    paddingLeft: 10,
    marginTop: 5,
    fontWeight: "bold"
  },

  dateText: {
    paddingLeft: 20,
    color: "gray",
    fontSize: 16,
  },

  infoText: {
    padding: 10,
    fontSize: 14,
  }
})

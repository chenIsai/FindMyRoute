import React from "react";
import {ScrollView, View, Text, StyleSheet} from "react-native";
import tos from "./Docs/ToS-docs";

const TermsOfService = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.headerText}>
          Terms of Service
        </Text>
        <Text style={styles.dateText}>
          Last Updated: {tos.date}
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          Acceptance of Terms
        </Text>
        <Text style={styles.infoText}>
          {tos.terms}
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          User Accounts
        </Text>
        <Text style={styles.infoText}>
          {tos.accounts}
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          Your Information
        </Text>
        <Text style={styles.infoText}>
          {tos.location}
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          Privacy Policy
        </Text>
        <Text style={styles.infoText}>
          Read our {
            <Text
              style={{color: "blue"}}
              onPress={() => navigation.navigate("Privacy Policy")}
              >Privacy Policy</Text>
          }
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          Changes to the Terms of Service
        </Text>
        <Text style={styles.infoText}>
          {tos.changes}
        </Text>
        <Text style={[styles.headerText, {fontSize: 18}]}>
          Contact Us
        </Text>
        <Text style={[styles.infoText, {paddingBottom: 50}]}>
          {tos.contact}
        </Text>
      </View>
    </ScrollView>
  )
}
export default TermsOfService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  headerText: {
    fontSize: 22,
    paddingLeft: 10,
    marginTop: 5,
    fontWeight: "bold"
  },

  dateText: {
    padding: 10,
    color: "gray",
    fontSize: 14,
  },

  infoText: {
    padding: 10,
    fontSize: 14,
  }
})

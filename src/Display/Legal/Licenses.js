import React from "react";
import {View, Text, FlatList} from "react-native";
import LicenseCard from "./LicenseCard";
import Header from "../Components/Header";
import licenses from "./Docs/license-docs";

const Licenses = (props) => {
  const data = Object.keys(licenses).map(key => ({name: key, ...licenses[key]}));
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data}
        renderItem={({item}) => <LicenseCard item={item} />}
        keyExtractor={(item) => item.name}
        />
    </View>
  )
};

export default Licenses;

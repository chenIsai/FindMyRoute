import React from "react";
import {View, Text, FlatList} from "react-native";
import LicenseCard from "./LicenseCard";
import licenses from "./license-docs";

const Licenses = () => {
  const data = Object.keys(licenses).map(key => ({name: key, ...licenses[key]}));
  console.log(data);
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data}
        renderItem={({item}) => <LicenseCard item={item} />}
        keyExtractor={(item, index) => index}
        />
    </View>
  )
};

export default Licenses;

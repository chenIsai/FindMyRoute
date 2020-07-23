import React, {useState} from "react";
import {View, Text, StyleSheet} from "react-native";
import Dialog from "react-native-dialog";

function RequestName(props) {
    const [name, setName] = useState(0);

    return (
      <View>
        <Dialog.Container visible={this.props.showDialog}>
          <Dialog.Title>Route Name</Dialog.Title>
          <Dialog.Description>Please enter a name for the saved route</Dialog.Description>
          <Dialog.Input label="Route Name"
            onChangeText={text => setName({text})}
            value={name}
          <Dialog.Text></Dialog.Text>
          <Dialog.Button label="Save" onPress={this.props.handleSave(name)}/>
        </Dialog.Container>
      </View>
    )
}

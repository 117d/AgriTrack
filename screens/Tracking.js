import React, { Component } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

function Tracking() {
  const navigation = useNavigation();

  const [selectedTask, setSelectedTask] = useState();
  const [selectedField, setSelectedField] = useState();

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Choose parameters</Text>

      <Picker
        style={styles.pickerStyle}
        mode="dropdown"
        selectedValue={selectedTask}
        onValueChange={(itemValue, itemIndex) => setSelectedTask(itemValue)}
        prompt="Choose Task..."
      >
        <Picker.Item label="Tilling" value="tilling" />
        <Picker.Item label="Fertilizing" value="fertilizing" />
        <Picker.Item label="Add new..." value="new" />
      </Picker>

      <Picker
        style={styles.pickerStyle}
        mode="dropdown"
        selectedValue={selectedField}
        onValueChange={(itemValue, itemIndex) => setSelectedField(itemValue)}
        prompt="Choose Field..."
      >
        <Picker.Item label="Field1" value="id1" />
        <Picker.Item label="Field_Rice" value="id2" />
        <Picker.Item label="Add new..." value="new_field" />
      </Picker>

      <TouchableOpacity
        style={styles.buttons}
        onPress={() => navigation.navigate("Maps")}
      >
        <Text style={styles.buttonText}>START</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.text}>BACK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B8D1A9",
  },
  input: {
    width: "70%",
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  buttons: {
    width: 200,
    borderRadius: 25,
    height: 60,
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "#FFCC24",
    justifyContent: "center",
    padding: 10,
  },
  backButton: {
    backgroundColor: "black",
    justifyContent: "center",
    padding: 10,
    width: 200,
    borderRadius: 25,
    height: 60,
    alignItems: "center",
    marginTop: 20,
  },
  pickerStyle: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "white",
  },
  titleText: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
    padding: 20,
  },
  paramsContainer: {
    width: "80%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
export default Tracking;

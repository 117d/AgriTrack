import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";

import { addTask } from "../firebase/fb.methods";

export default function AddNewItem({ navigation }) {
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskProgress, setTaskProgress] = useState("");

  const emptyState = () => {
    setTaskName("");
    setTaskType("");
    setTaskProgress("0%");
  };
  /*
  const taskTypes = {
    1: "Tilling",
    2: "Fertilizing",
    3: "Spraying",
    4: "Planting",
    5: "Harvesting",
    6: "Other",
  };*/
  const taskTypes = [
    { taskId: "1", taskName: "Tilling" },
    { taskId: "2", taskName: "Fertilizing" },
    { taskId: "3", taskName: "Spraying" },
    { taskId: "4", taskName: "Planting" },
    { taskId: "5", taskName: "Harvesting" },
    { taskId: "6", taskName: "Other" },
  ];

  const onPress = () => {
    setTaskProgress("0%");
    addTask(taskName, taskType, taskProgress);
    navigation.navigate("Dashboard");
    emptyState();
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.welcomeContainer}></View>
      <View style={styles.addItemForm}>
        <Text style={styles.textTitle}>ADD NEW ITEM</Text>
        <TextInput
          style={styles.input}
          placeholder="Task Name"
          value={taskName}
          onChangeText={(taskName) => setTaskName(taskName)}
        />
        <Picker
          style={styles.pickerStyle}
          mode="dropdown"
          selectedValue={taskType}
          prompt="Choose Type..."
          //onValueChange={(itemValue, itemIndex) => setTaskType(itemValue)}
          onValueChange={(itemValue, itemIndex) => setTaskType(itemValue)}
        >
          {/*{Object.keys(taskTypes).map((key) => {*/}
          {taskTypes.map((option) => (
            <Picker.Item label={option.taskName} value={option.taskId} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.inputBtn} onPress={onPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#B8D1A9",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    //marginTop: 40,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
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
  textTitle: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 70,
  },
  pickerStyle: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 5,
  },
  inputBtn: {
    width: "50%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "black",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 50,
    padding: 15,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "black",
    marginBottom: 20,
  },
  addItemForm: {
    backgroundColor: "white",
    //margin: 20,
    flex: 1,
    height: "30%",
    //marginTop: 10,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  welcomeContainer: {
    width: "100%",
    height: "20%",
    /*backgroundColor: "#a7d199",*/
    justifyContent: "center",
  },
});

import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";

import { addTask } from "../firebase/fb.methods";

import {
  Input,
  Button,
  Text,
  Layout,
  SelectItem,
  Select,
  IndexPath,
} from "@ui-kitten/components";

export default function AddNewItem({ navigation }) {
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskStatus, setTaskStatus] = useState("TO DO");
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  const emptyState = () => {
    setTaskName("");
    setTaskType("");
    setTaskStatus("TO DO");
  };

  const taskTypes = [
    { taskId: 1, taskName: "Tilling" },
    { taskId: 2, taskName: "Fertilizing" },
    { taskId: 3, taskName: "Spraying" },
    { taskId: 4, taskName: "Planting" },
    { taskId: 5, taskName: "Harvesting" },
    { taskId: 6, taskName: "Other" },
  ];

  const clickedPress = () => {
    addTask(taskName, taskType, taskStatus);
    navigation.navigate("Dashboard");
    emptyState();
  };

  const handleTaskTypeSelection = (index) => {
    setSelectedIndex(index);
    setTaskType(taskTypes[selectedIndex.row].taskName);
    console.log("selected task type" + taskType);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.welcomeContainer}></View>
      <View style={styles.addItemForm}>
        <Text style={styles.textTitle}>ADD NEW ITEM</Text>
        <Layout level="1" style={styles.itemsContainer}>
          <Input
            style={styles.input}
            placeholder="Task Name"
            value={taskName}
            onChangeText={(taskName) => setTaskName(taskName)}
          />
          <Select
            value={taskTypes[selectedIndex.row].taskName}
            style={styles.pickerStyle}
            mode="dropdown"
            selectedIndex={selectedIndex}
            prompt="Choose Task..."
            onSelect={(index) => handleTaskTypeSelection(index)}
          >
            {taskTypes.map((type) => (
              <SelectItem
                title={type.taskName}
                value={type.taskId}
                key={type.taskId}
              />
            ))}
          </Select>
          <Button
            style={styles.inputBtn}
            onPress={() => clickedPress()}
            size="giant"
          >
            Add
          </Button>
        </Layout>
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
  itemsContainer: {
    padding: 20,
    height: "50%",
    alignItems: "center",
    width: "100%",
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
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "white",
  },
  inputBtn: {
    marginTop: 15,
  },
  input: {
    width: "100%",
    height: 50,
    padding: 15,
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

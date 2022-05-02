import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import firebase from "firebase/compat/app";
import tw from "twrnc";

export default function UserProfile({ navigation }) {
  let currUserId = firebase.auth().currentUser.uid;
  /*const [tasks, setTasks] = useState("");

  useEffect(() => {
    async function getUserInfo() {
      let doc = await firebase
        .firestore()
        .collection("users")
        .doc(currUserId)
        .get();

      if (!doc.exists) {
        alert("Not found!");
      } else {
        let dataObj = doc.data();
        setTasks(dataObj.tasks);
      }
    }
    getUserInfo();
  });*/
  const tasks = [
    { name: "demo1", type: "fertilizing", progress: "100%" },
    { name: "demo2", type: "tilling", progress: "59%" },
    { name: "demo3", type: "harvesting", progress: "74%" },
  ];
  console.log(tasks.map((task) => task.name));
  /*
   <ul className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <li key={task.name} className="py-4 flex">
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{task.progress}</p>
            <p className="text-sm font-medium text-gray-900">{task.type}</p>
          </div>
        </li>
      ))}
    </ul>*/
  return (
    <View style={styles.container}>
      <View style={styles.pageTitle}>
        <Text style={styles.textTitle}>Dashboard</Text>
      </View>
      <View style={styles.container}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  pageTitle: {
    marginTop: 80,
  },
  textTitle: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: "70%",
    aspectRatio: 1,
    marginBottom: 40,
    marginTop: 20,
  },
  input: {
    width: "80%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "black",
    marginBottom: 20,
  },
  inputBtn: {
    width: "50%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "black",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  textTitle: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
  },
  txtLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16,
  },
  txt: {
    fontSize: 16,
    lineHeight: 21,
    //fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});

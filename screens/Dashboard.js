import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { logOut } from "../firebase/fb.methods";
import firebase from "firebase/compat/app";
const { width, height } = Dimensions.get("window");
export default function Dashboard({ navigation }) {
  let currUserId = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [task, setTask] = useState();
  const [field, setField] = useState();
  // handle the tracking start
  const saveField = () => {
    console.log("Started");
    setModalVisible(!modalVisible);
    navigation.navigate("Maps");
  };
  const cancelSave = () => {
    console.log("Cancelled");
    setModalVisible(!modalVisible);
  };
  useEffect(() => {
    async function getUserInfo() {
      let doc = await firebase
        .firestore()
        .collection("users")
        .doc(currUserId)
        .get();

      if (!doc.exists) {
        //alert("Not found!");
        setFirstName("Admin");
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);
      }
    }
    getUserInfo();
  });
  const onLogOut = () => {
    logOut();
    navigation.replace("Home");
  };
  const pressedTracking = () => {
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modal}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Choose parameters</Text>
            <View style={styles.pickForm}>
              <Picker
                style={styles.pickerStyle}
                mode="dropdown"
                selectedValue={task}
                onValueChange={(itemValue, itemIndex) => setTask(itemValue)}
                prompt="Choose Task..."
              >
                <Picker.Item label="Tilling" value="tilling" />
                <Picker.Item label="Fertilizing" value="fertilizing" />
                <Picker.Item label="Other" value="new" />
              </Picker>

              <Picker
                style={styles.pickerStyle}
                mode="dropdown"
                selectedValue={field}
                onValueChange={(itemValue, itemIndex) => setField(itemValue)}
                prompt="Choose Field..."
              >
                <Picker.Item label="Demo" value="id1" />
                <Picker.Item
                  label="Add new..."
                  value="new_field"
                  //onPress={navigation.navigate("AddNewItem")}
                />
              </Picker>
            </View>
            <View style={styles.button}>
              <TouchableOpacity style={styles.inputBtn} onPress={saveField}>
                <Text style={styles.inputBtnTxt}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputBtn} onPress={cancelSave}>
                <Text style={styles.inputBtnTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.profileTop}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../assets/temp_logo.png")}
          />
        </View>
        <Text style={styles.text}>Hello, {firstName}</Text>
      </View>

      <View style={styles.dashboardContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("UserProfile")}
        >
          <Text style={styles.buttonText}>Go To Your Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          //onPress={() => navigation.navigate("Tracking")}
          onPress={pressedTracking}
        >
          <Text style={styles.buttonText}>Start Tracking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("AddNewItem")}
        >
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("AddNewField")}
        >
          <Text style={styles.buttonText}>Add Field</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.logoutText} onPress={onLogOut}>
        Log Out
      </Text>
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
  profileTop: {
    //backgroundColor: "#B8D1A9",
    backgroundColor: "blue",
    width: width,
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 300,
  },
  imageContainer: {
    //marginTop: 20,
    overflow: "hidden",
    borderColor: "black",
    borderWidth: 3,
    height: 160,
    width: 160,
    borderRadius: 80,
    backgroundColor: "white",
  },
  dashboardContainer: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    //borderRadius: 30,
    marginBottom: 200,
    marginTop: 20,
  },
  pageTitle: {
    marginTop: 80,
  },
  image: {
    width: "70%",
    aspectRatio: 1,
    marginBottom: 40,
    marginTop: 20,
  },
  textTitle: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  btn: {
    width: "100%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "black",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  textInput: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#ecf0f1",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  logoutText: {
    fontWeight: "bold",
    fontSize: 18,
    //fontFamily: "Inter-Black",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
    marginTop: 15,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  //modal
  modal: {
    width: "70%",
    height: "45%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: height / 3.5,
    left: width / 6.3,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingTop: 10,
  },

  inputBtn: {
    width: "40%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  inputBtnTxt: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
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
  button: {
    marginTop: 25,
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 15,
    color: "white",
  },
});

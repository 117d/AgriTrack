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
import { getFields, getTasks, logOut } from "../firebase/fb.methods";
import firebase from "firebase/compat/app";
const { width, height } = Dimensions.get("window");

export default function Dashboard({ navigation }) {
  let currUserId = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [task, setTask] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [field, setField] = useState(null);
  const [userFields, setUserFields] = useState([]);
  const [avatar, setAvatar] = useState(null);
  // handle the tracking start
  const saveField = () => {
    console.log("Started");
    setModalVisible(!modalVisible);
    navigation.navigate("Maps", { task: task, field: field });
  };
  const cancelSave = () => {
    console.log("Cancelled");
    setModalVisible(!modalVisible);
  };
  const handleTaskChange = () => {
    navigation.navigate("AddNewItem");
  };
  const handleFieldChange = () => {
    navigation.navigate("AddNewField");
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
        //navigation.navigate("Home");
      } else {
        let dataObj = doc.data();
        const tasksFromDb = await getTasks();
        const fieldsFromDb = await getFields();
        //console.log("user tasks: " + JSON.stringify(tasksFromDb));
        //console.log("user fields: " + JSON.stringify(fieldsFromDb));
        setUserTasks(...userTasks, tasksFromDb);
        setUserFields(...userFields, fieldsFromDb);
        console.log("user tasks: " + userTasks);
        userTasks.map((task) =>
          console.log("Task id: " + task.id + " and name: " + task.taskName)
        );
        setFirstName(dataObj.firstName);
        setAvatar(dataObj.profPicUrl);
        // console.log(await getTasks());
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
              {userTasks && userTasks.length > 0 ? (
                <Picker
                  style={styles.pickerStyle}
                  mode="dropdown"
                  selectedValue={task}
                  prompt="Choose Task..."
                  onValueChange={(itemValue, itemIndex) => setTask(itemValue)}
                >
                  {userTasks.map((task) => (
                    <Picker.Item
                      label={task.taskName}
                      value={task.id}
                      key={task.id}
                    />
                  ))}
                </Picker>
              ) : null}
              <Picker
                style={styles.pickerStyle}
                mode="dropdown"
                selectedValue={field}
                onValueChange={(itemValue, itemIndex) =>
                  handleFieldChange(itemValue, itemIndex)
                }
                prompt="Choose Field..."
              >
                {userFields && userFields.length > 0 ? (
                  userFields.map((field) => (
                    <Picker.Item
                      label={field.fieldName}
                      value={field.id}
                      key={field.id}
                    />
                  ))
                ) : (
                  <Picker.Item label="Add New" value="new" key={"new"} />
                )}
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
          {avatar != null ? (
            <Image style={styles.image} source={{ uri: avatar }} />
          ) : (
            <Image
              style={styles.image}
              source={require("../assets/default_user.png")}
            />
          )}
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
        <Text style={styles.logoutText} onPress={onLogOut}>
          Log Out
        </Text>
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
  profileTop: {
    //backgroundColor: "#B8D1A9",
    backgroundColor: "#8dc27e",
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
    //flex: 1,
    width: undefined,
    aspectRatio: 1,
    height: "100%",
    //paddingBottom: 10,
    //marginTop: 20,
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
    color: "black",
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

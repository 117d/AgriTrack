import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  //Modal,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getFields, getTasks, logOut } from "../firebase/fb.methods";
import {
  Layout,
  Button,
  Icon,
  Text,
  Modal,
  Card,
  Select,
  SelectItem,
  IndexPath,
} from "@ui-kitten/components";

import firebase from "firebase/compat/app";
const { width, height } = Dimensions.get("window");

export default function Dashboard(props) {
  const { navigation } = props;
  let currUserId = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [task, setTask] = useState(null);
  const [field, setField] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedIndex2, setSelectedIndex2] = useState(new IndexPath(0));
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(false);

  // handle the tracking start
  const startTracking = () => {
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
    navigation.navigate("New Field");
  };
  const handleAddingNewField = () => {
    setOptionsVisible(!optionsVisible);
  };

  useEffect(() => {
    async function getUserInfo() {
      console.log("get user info");
      let doc = await firebase
        .firestore()
        .collection("users")
        .doc(currUserId)
        .get();

      if (!doc.exists) {
        setFirstName("Admin");
        //navigation.navigate("Home");
      } else {
        setUser(doc);
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);
        setAvatar(dataObj.photoUrl);
      }
    }
    getUserInfo();
  }, []);

  const onLogOut = () => {
    logOut();
    navigation.replace("Home");
  };

  const pressedTracking = () => {
    setModalVisible(true);
  };

  const handleTaskSelection = (index) => {
    setSelectedIndex(index);
    setTask(props.tasks[selectedIndex.row]);
    console.log("task set => " + task);
  };

  const handleFieldSelection = (index) => {
    setSelectedIndex2(index);
    setField(props.fields[selectedIndex2.row]);
    console.log("field set => " + field);
  };

  const PeopleIcon = (props) => <Icon name="people" {...props} />;
  const PersonIcon = (props) => <Icon name="person" {...props} />;
  const MapIcon = (props) => <Icon name="map" {...props} />;
  const PlusIcon = (props) => <Icon name="plus" {...props} />;
  const NavigationIcon = (props) => <Icon name="navigation-2" {...props} />;

  const handleNavigatingToManual = () => {
    setOptionsVisible(!optionsVisible);
    navigation.navigate("New Field");
  };

  const handleNavigatingToTrackingField = () => {
    setOptionsVisible(!optionsVisible);
    navigation.navigate("New Tracked Field");
  };

  return (
    <Layout style={styles.container}>
      <StatusBar style="auto" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={optionsVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setOptionsVisible(false)}
        onRequestClose={() => {
          setOptionsVisible(!optionsVisible);
        }}
      >
        <Card>
          <Text style={styles.modalTitle}>Choose parameters</Text>
          <View style={styles.button}>
            <Button
              style={styles.inputBtn}
              onPress={() => handleNavigatingToManual()}
            >
              Manually
            </Button>
            <Button
              style={styles.inputBtn}
              onPress={() => handleNavigatingToTrackingField()}
            >
              By Tracking
            </Button>
          </View>
        </Card>
      </Modal>
      <Modal
        animationType="slide"
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalVisible(false)}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <Card>
          <Text style={styles.modalTitle}>Choose parameters</Text>
          <View style={styles.card}>
            {props.tasks && props.tasks.length > 0 ? (
              <Select
                value={props.tasks[selectedIndex.row].taskName}
                style={styles.pickerStyle}
                mode="dropdown"
                selectedIndex={selectedIndex}
                prompt="Choose Task..."
                // onSelect={(index) => setSelectedIndex(index)}
                onSelect={(index) => handleTaskSelection(index)}
              >
                {props.tasks.map((task) => (
                  <SelectItem
                    title={task.taskName}
                    value={task.id}
                    key={task.id}
                  />
                ))}
              </Select>
            ) : (
              <Text status={"warning"} style={styles.warningTxt}>
                No tasks available. Create one by clicking "Add Task" button
              </Text>
            )}
            {props.fields && props.fields.length > 0 ? (
              <Select
                value={props.fields[selectedIndex2.row].fieldName}
                style={styles.pickerStyle}
                mode="dropdown"
                selectedIndex={field}
                onSelect={(index) => handleFieldSelection(index)}
                prompt="Choose Field..."
              >
                {props.fields.map((field) => (
                  <SelectItem
                    title={field.fieldName}
                    value={field.id}
                    key={field.id}
                  />
                ))}
              </Select>
            ) : (
              <Text status={"warning"} style={styles.warningTxt}>
                No fields available. Create one by clicking "Add Field" button
              </Text>
            )}
          </View>
          <View style={styles.button}>
            {props.tasks.length > 0 && props.fields.length > 0 ? (
              <Button style={styles.inputBtn} onPress={startTracking}>
                Start
              </Button>
            ) : (
              <Button
                style={styles.inputBtn}
                onPress={() => setModalVisible(false)}
              >
                Ok
              </Button>
            )}

            <Button style={styles.inputBtn} onPress={cancelSave}>
              Cancel
            </Button>
          </View>
        </Card>
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

      <Layout style={styles.dashboardContainer}>
        <Button
          style={styles.btn}
          onPress={() => navigation.navigate("UserProfile")}
          accessoryLeft={PersonIcon}
        >
          Your Profile
        </Button>
        <Button
          style={styles.btn}
          onPress={pressedTracking}
          accessoryLeft={NavigationIcon}
        >
          Start Tracking
        </Button>
        <Button
          style={styles.btn}
          onPress={() => navigation.navigate("TeamScreen")}
          accessoryLeft={PeopleIcon}
        >
          Your Team
        </Button>
        <Button
          style={styles.btn}
          onPress={() => navigation.navigate("AddNewItem")}
          accessoryLeft={PlusIcon}
        >
          Add Task
        </Button>
        <Button
          style={styles.btn}
          onPress={() => handleAddingNewField()}
          accessoryLeft={MapIcon}
        >
          Add Field
        </Button>
        <Button
          style={styles.logOutBtn}
          status={"danger"}
          onPress={() => onLogOut()}
        >
          Log Out
        </Button>
      </Layout>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  modalTitle: {
    marginBottom: 20,
  },
  card: {
    flex: 1,
    margin: 2,
  },
  profileTop: {
    backgroundColor: "#3366FF",
    width: width,
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20%",
  },
  warningTxt: {
    fontWeight: "bold",
    alignSelf: "center",
  },
  logOutBtn: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: "red",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imageContainer: {
    overflow: "hidden",
    borderColor: "#3366FF",
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
    marginBottom: 200,
    marginTop: 20,
  },
  pageTitle: {
    marginTop: 80,
  },
  image: {
    width: undefined,
    aspectRatio: 1,
    height: "100%",
  },
  textTitle: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  btn: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "black",
    backgroundColor: "black",
    marginTop: 10,
    alignItems: "center",
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
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    marginTop: 15,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  modal: {
    width: "70%",
    maxHeight: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingTop: 10,
  },
  inputBtn: {
    width: "40%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
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
    justifyContent: "space-between",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 15,
    color: "black",
  },
});

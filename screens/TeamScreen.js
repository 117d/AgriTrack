import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  getFields,
  getTasks,
  getWorkers,
  deleteWorker,
  logOut,
} from "../firebase/fb.methods";
import {
  Layout,
  Button,
  Icon,
  Text,
  List,
  ListItem,
  Divider,
  Input,
  Card,
  Modal,
} from "@ui-kitten/components";

import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
const { width, height } = Dimensions.get("window");

export default function TeamScreen(props) {
  const { navigation } = props;
  let currUser = firebase.auth().currentUser;
  const [teamMembers, setTeamMembers] = useState(props.workers);
  const [avatar, setAvatar] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState(null);

  const handleDelete = (worker) => {
    setWorkerToDelete(worker);
    setModalVisible(true);
    console.log(workerToDelete + " worker to delete");
  };

  const removeWorker = () => {
    deleteWorker(workerToDelete.id);
    props.updated3();
    setModalVisible(false);
  };

  const renderItemAccessory = (props) => (
    <Button
      size="tiny"
      status={"danger"}
      onPress={() => handleDelete(props)}
      accessoryLeft={DeleteIcon}
    ></Button>
  );

  const ViewIcon = (props) => <Icon {...props} name="eye" />;
  const EditIcon = (props) => <Icon {...props} name="edit" />;
  const DeleteIcon = (props) => <Icon {...props} name="person-delete" />;
  const renderItemIcon = (props) => <Icon {...props} name="person" />;

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${index + 1} ${item.firstName} ${item.lastName}`}
      description={`${item.email}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory(item)}
    />
  );

  useEffect(() => {
    async function getUserInfo() {
      console.log("get user info");
      let doc = await firebase
        .firestore()
        .collection("users")
        .doc(currUser.uid)
        .get();

      if (!doc.exists) {
        //alert("Not found!");
        navigation.navigate("Home");
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);
        setAvatar(dataObj.photoUrl);
        console.log("photo uri of the current user is: " + avatar);
      }
    }
    getUserInfo();
    props.updated3();
  }, [teamMembers]);

  async function addUserToTeam() {
    var collectionRef = firebase.firestore().collection("users");
    var dbRef = firebase
      .firestore()
      .collection("users")
      .doc(currUser.uid)
      .collection("workers")
      .doc();
    const querySnapshot = await collectionRef
      .where("email", "==", userEmail)
      .get();
    querySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        ...doc.data(),
      };
      console.log(JSON.stringify(data));
      dbRef
        .set(data)
        .then(() => {
          console.log("Document successfully written!");
          props.updated3();
        })
        .catch((error) => {
          console.log("error adding new worker: " + error);
        });
    });
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        backdropStyle={styles.backdrop}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Card>
          <Text style={styles.modalTitle}>Confirm delete</Text>
          <Button status={"danger"} onPress={() => removeWorker()}>
            Ok
          </Button>
          <Button status={"info"} onPress={() => setModalVisible(false)}>
            Cancel
          </Button>
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
        <Text category="h3" style={{ marginBottom: 5 }}>
          Add new team member
        </Text>
        <Text status="info" style={{ marginBottom: 25 }}>
          Type email of the user to add them.
        </Text>
        <Input
          placeholder="Email"
          value={userEmail}
          style={{ marginBottom: 25 }}
          onChangeText={(email) => setUserEmail(email)}
        />
        <Button onPress={addUserToTeam}>Add</Button>
      </Layout>
      {props.workers ? (
        <Layout style={styles.listContainer}>
          <List
            style={styles.listList}
            data={props.workers}
            renderItem={renderItem}
          />
        </Layout>
      ) : (
        <View style={styles.container}>
          <Text category={"h4"}>No team to display</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    maxHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  listList: {
    flex: 1,
    padding: 10,
    width: 400,
    marginBottom: 20,
  },
  profileTop: {
    backgroundColor: "#3366FF",
    width: width,
    height: "40%",
    marginBottom: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  logOutBtn: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
  },
  imageContainer: {
    //marginTop: 20,
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
    //borderRadius: 30,
    marginBottom: 20,
    // marginTop: 20,
  },
  pageTitle: {
    //marginTop: 80,
  },
  image: {
    //flex: 1,
    width: undefined,
    aspectRatio: 1,
    height: "100%",
    //paddingBottom: 10,
    //marginTop: 20,
  },
  modal: {
    width: "40%%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    borderRadius: 300,
  },
  backdrop: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalTitle: {
    marginBottom: 20,
    fontSize: 24,
    alignSelf: "center",
    backgroundColor: "#3366FF",
    width: "100%",
    textAlign: "center",
    color: "white",
  },
  textTitle: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  btn: {
    width: "80%",
    //height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "black",
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
    color: "white",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

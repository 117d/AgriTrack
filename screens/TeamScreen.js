import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
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
} from "@ui-kitten/components";

import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
const { width, height } = Dimensions.get("window");

export default function TeamScreen({ navigation }) {
  let currUser = firebase.auth().currentUser;
  const [teamMembers, setTeamMembers] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState(null);
  const [reload, setReload] = useState(false);

  async function fetchWorkers() {
    let workers = await getWorkers();
    setTeamMembers(...teamMembers, workers);
  }

  async function handleDelete(id) {
    await deleteWorker(id);
    setReload(!reload);
  }

  const renderItemAccessory = (props) => (
    <Button size="tiny" onPress={(props) => handleDelete(props)}>
      REMOVE
    </Button>
  );

  const renderItemIcon = (props) => <Icon {...props} name="person" />;

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${index + 1} ${item.firstName} ${item.lastName}`}
      description={`${item.email}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory(item.id)}
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
        setFirstName("Admin");
        //navigation.navigate("Home");
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);

        setFirstName(dataObj.firstName);
        setAvatar(dataObj.photoUrl);
        console.log("photo uri of the current user is: " + avatar);
        // console.log(await getTasks());
      }
    }
    getUserInfo();
    //console.log(dataObj.firstName);
    fetchWorkers();
  }, [reload]);

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
          setReload(true);
        })
        .catch((error) => {
          console.log("error adding new worker: " + error);
        });
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileTop}>
        <View style={styles.imageContainer}>
          {currUser.photoURL != null ? (
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
      <Layout style={styles.listContainer}>
        <List
          style={styles.listList}
          data={teamMembers}
          renderItem={renderItem}
        />
      </Layout>
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
    //maxWidth: "100%",
    alignItems: "center",
    justifyContent: "center",
    //borderRadius: 30,
  },
  listList: {
    flex: 1,
    padding: 10,
    width: 400,
    //height: 120,
  },
  profileTop: {
    //backgroundColor: "#B8D1A9",
    backgroundColor: "#3366FF",
    width: width,
    height: "40%",
    marginBottom: 80,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: "20%",
    //marginBottom: 20,
  },
  logOutBtn: {
    width: "80%",
    //height: 50,
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
    marginTop: 15,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

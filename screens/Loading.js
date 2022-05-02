import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
//import * as firebase from "firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../config/firebase.config";

export default function Loading({ navigation }) {
  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Dashboard");
      } else {
        navigation.replace("Home");
      }
    }); /*.catch((error) => {
      alert(error);
      console.log("error onauthchanged");
    });*/
  }); /*.catch((error) => {
    alert(error);
    console.log("useeffect error");*/

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
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
});

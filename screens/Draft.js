import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image style={styles.image} source={require("./assets/temp_logo.png")} />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>WELCOME TO THE AgriTrack!</Text>
      </View>

      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>START TRACKING</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /*backgroundColor: "#E8EAED",*/
    backgroundColor: "#B8D1A9",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "70%",
    aspectRatio: 1,
    marginBottom: 40,
    marginTop: 20,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FFCC24",
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFF",
  },
  welcomeContainer: {
    width: "100%",
    height: "20%",
    /*backgroundColor: "#a7d199",*/
    justifyContent: "center",
  },
});

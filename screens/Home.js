import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
//import { useNavigation } from "@react-navigation/native";

export default function Home({ navigation }) {
  //const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image style={styles.image} source={require("../assets/temp_logo.png")} />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>WELCOME TO</Text>
        <Text style={styles.welcomeText}>AgriTrack!</Text>
        <Text style={styles.starterText}>
          Start Tracking by first registering or signing in if you have account
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Registration")}
      >
        <Text style={styles.text}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.text}>Sign In</Text>
      </TouchableOpacity>
      {/* FOR DEBUGGING */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Maps")}
      >
        <Text style={styles.text}>Map Debug</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("AddNewItem")}
      >
        <Text style={styles.text}>AddNewItem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /*backgroundColor: "#E8EAED",*/
    //backgroundColor: "#B8D1A9",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "70%",
    aspectRatio: 1,
    marginBottom: 40,
    marginTop: 20,
  },
  btn: {
    width: "70%",
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
  welcomeText: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#59963f",
    letterSpacing: 5,
  },
  starterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    padding: 30,
  },
  welcomeContainer: {
    width: "100%",
    height: "20%",
    /*backgroundColor: "#a7d199",*/
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

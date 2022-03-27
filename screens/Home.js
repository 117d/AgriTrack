import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image style={styles.image} source={require("../assets/temp_logo.png")} />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>WELCOME TO</Text>
        <Text style={styles.welcomeText}>AgriTrack!</Text>
      </View>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.text}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => navigation.navigate("Tracking")}
      >
        <Text style={styles.text}>START TRACKING</Text>
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
  text: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});

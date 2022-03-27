import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function Login() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/temp_logo.png")} />
      <TextInput placeholder={"Username"} style={styles.input} />
      <TextInput
        placeholder={"Password"}
        secureTextEntry={true}
        style={styles.input}
      />

      <Pressable
        style={styles.inputBtn}
        onPress={() => navigation.navigate("Tracking")}
      >
        <Text style={styles.text}>login</Text>
      </Pressable>
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
});

export default Login;

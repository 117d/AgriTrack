import React, { useState, Component } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signIn } from "../firebase/fb.methods";
function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const navigation = useNavigation();

  const login = () => {
    if (!email) {
      alert("required");
    }

    if (!password) {
      alert("required");
    }

    signIn(email, password);
    navigation.navigate("Loading");
    setEmail("");
    setPassword("");
  };
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/temp_logo.png")} />

      {/*<TextInput placeholder={"Username"} style={styles.input} />*/}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={(email) => setEmail(email)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.inputBtn} onPress={login}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
      <View style={styles.bottomText}>
        <Text style={styles.txt}>
          Don't have account yet?
          <Text> </Text>
          <Text
            onPress={() => navigation.navigate("Registration")}
            style={styles.txtLink}
          >
            Sign up
          </Text>
        </Text>
      </View>
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
    marginBottom: 80,
    //marginTop: 20,
  },
  inputContainer: {
    marginBottom: 5,
    width: "80%",
  },
  input: {
    width: "100%",
    height: 50,
    padding: 15,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "black",
    marginBottom: 20,
  },
  bottomText: {
    margin: 10,
    //justifyContent: "space-between",
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
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  txtLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16,
  },
  txt: {
    fontSize: 16,
    lineHeight: 21,
    //fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});

export default Login;

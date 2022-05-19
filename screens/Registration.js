import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { register, uploadImage } from "../firebase/fb.methods";
//** ADD PROFILE PICTURE UPLOAD */
export default function Registration({ navigation }) {
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pickedImage, setPickedImage] = useState(null);
  const emptyState = () => {
    setPickedImage(null);
    setAvatar(null);
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
  };

  const onRegister = async () => {
    if (!firstName) {
      alert("Required");
    } else if (!email) {
      alert("Required");
    } else if (!password) {
      alert("Required");
    } else if (!confirmPassword) {
      setPassword("");
      alert("Required");
    } else if (password !== confirmPassword) {
      alert("Password does not match!");
    } else {
      //setAvatar(uploadImage(pickedImage));
      setAvatar(await uploadImage(pickedImage));
      //setAvatar(pickedImage);
      register(email, password, lastName, firstName, avatar);
      navigation.navigate("Loading");
      emptyState();
    }
  };

  const onChooseImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!pickerResult.cancelled) {
      setPickedImage(pickerResult);
    }
  };

  return (
    <View style={styles.container}>
      {/*
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>BACK</Text>
      </TouchableOpacity>
      */}
      <Image style={styles.image} source={require("../assets/temp_logo.png")} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First name"
          value={firstName}
          onChangeText={(name) => setFirstName(name)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last name"
          value={lastName}
          onChangeText={(name) => setLastName(name)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
          autoCapitalize="none"
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.inputBtn} onPress={onChooseImage}>
          {avatar == null ? (
            <Text style={styles.text}>Choose image...</Text>
          ) : (
            <Text style={styles.text}>Change...</Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.inputBtn} onPress={onRegister}>
        <Text style={styles.text}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.bottomText}>
        <Text style={styles.txt}>
          Already have an account?
          <Text> </Text>
          <Text
            onPress={() => navigation.navigate("Login")}
            style={styles.txtLink}
          >
            Sign in
          </Text>
        </Text>
      </View>
      {/*<TouchableOpacity
        style={styles.inputBtn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.text}>Sign In</Text>
    </TouchableOpacity>*/}
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
    //marginTop: 20,
  },
  inputContainer: {
    marginBottom: 2,
    width: "80%",
    alignItems: "center",
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

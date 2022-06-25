import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button, Input, Layout, Text, Icon } from "@ui-kitten/components";
import { register, uploadImage } from "../firebase/fb.methods";

export default function Registration({ navigation }) {
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pickedImage, setPickedImage] = useState(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

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
      setAvatar(await uploadImage(pickedImage));
      console.log("link to the avatar picture is: " + avatar);
      register(email, password, lastName, firstName, avatar);
      navigation.navigate("Loading");
      emptyState();
    }
  };

  const AttachmentIcon = (props) => <Icon name="attach-2" {...props} />;
  const EmailIcon = (props) => <Icon name="email" {...props} />;
  const PersonIcon = (props) => <Icon name="person" {...props} />;
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
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text category="h1" status="control">
          Welcome!
        </Text>
        <Text style={styles.signInLabel} category="s1" status="control">
          Register
        </Text>
      </View>
      <Layout style={styles.formContainer} level="1">
        <Input
          placeholder="First name"
          style={styles.emailInput}
          value={firstName}
          onChangeText={(name) => setFirstName(name)}
          accessoryRight={PersonIcon}
        />
        <Input
          style={styles.emailInput}
          accessoryRight={PersonIcon}
          placeholder="Last name"
          value={lastName}
          onChangeText={(name) => setLastName(name)}
        />
        <Input
          style={styles.emailInput}
          placeholder="Email"
          value={email}
          accessoryRight={EmailIcon}
          onChangeText={(email) => setEmail(email)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          style={styles.passwordInput}
          placeholder="Enter password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
        />
        <Input
          style={styles.passwordInput}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
        />
        <Button
          style={styles.imgBtn}
          onPress={onChooseImage}
          accessoryLeft={AttachmentIcon}
          size={"medium"}
        >
          {avatar == null ? (
            <Text style={styles.text}>Choose image</Text>
          ) : (
            <Text style={styles.text}>Change...</Text>
          )}
        </Button>
        <Button style={styles.signUpButton} size="giant" onPress={onRegister}>
          SIGN UP
        </Button>
        <Button
          style={styles.signInButton}
          appearance="ghost"
          status="basic"
          onPress={() => navigation.navigate("Login")}
        >
          Already have an account? Sign in
        </Button>
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 216,
    backgroundColor: "#3366FF",
  },
  profileAvatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignSelf: "center",
  },
  editAvatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  emailInput: {
    marginTop: 16,
  },
  passwordInput: {
    marginTop: 16,
  },
  termsCheckBoxText: {
    marginLeft: 10,
  },
  signUpButton: {
    marginTop: 25,
    marginHorizontal: 16,
  },
  signInButton: {
    marginBottom: 25,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  imgBtn: {
    marginTop: 20,
    width: "50%",
    alignSelf: "center",
  },
});

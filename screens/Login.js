import React, { useState, Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signIn } from "../firebase/fb.methods";
import { Text, Button, Icon, Layout, Input } from "@ui-kitten/components";
function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  //const navigation = useNavigation();
  const EmailIcon = (props) => <Icon name="email" {...props} />;
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

  const renderInputIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={!secureTextEntry ? "eye" : "eye-off"} />
    </TouchableWithoutFeedback>
  );
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.image}
          source={require("../assets/temp_logo.png")}
        />
        <Text category="h1">Log in</Text>
        <Text category="h6">Welcome back!</Text>
      </View>
      <Layout style={styles.formContainer} level="1">
        <Input
          placeholder="Enter your email"
          value={email}
          onChangeText={(email) => setEmail(email)}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.emailInput}
          accessoryRight={EmailIcon}
        />
        <Input
          style={styles.passwordInput}
          placeholder="Enter password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          accessoryRight={renderInputIcon}
        />
      </Layout>
      <Layout style={styles.btnContainer}>
        <Button style={styles.btn} onPress={login} size="medium">
          Login
        </Button>
        <Button
          style={styles.signInButton}
          appearance="ghost"
          status="basic"
          onPress={() => navigation.navigate("Registration")}
        >
          Don't have an account yet? Sign up
        </Button>
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    width: "70%",
    aspectRatio: 1,
    //marginTop: 20,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 256,
    marginTop: 25,
    //backgroundColor: "white",
  },
  text: {
    marginBottom: 25,
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
  btnContainer: {
    flex: 1,
    //paddingTop: 32,

    paddingHorizontal: 16,
  },
});

export default Login;

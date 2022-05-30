import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Button, Input, Layout, Text, Icon } from "@ui-kitten/components";
//import { useNavigation } from "@react-navigation/native";

export default function Home({ navigation }) {
  //const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.welcomeContainer}>
        <Image
          style={styles.image}
          source={require("../assets/temp_logo.png")}
        />
        <Text style={styles.titleText} category="h1">
          WELCOME TO AgriTrack!
        </Text>
        <Text style={styles.infoText}>
          Start Tracking by first registering or signing in if you have account
        </Text>
      </View>
      <Layout style={styles.btnContainer}>
        <Button
          style={styles.btn}
          size="giant"
          onPress={() => navigation.navigate("Registration")}
        >
          Sign up
        </Button>
        <Button
          style={styles.btn}
          size="giant"
          onPress={() => navigation.navigate("Login")}
        >
          Sign in
        </Button>
      </Layout>
      {/* FOR DEBUGGING */}
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
    marginBottom: 10,
    marginTop: "20%",
  },
  titleText: {
    color: "#59963f",
    fontWeight: "bold",
    textAlign: "center",
  },
  infoText: {
    textAlign: "center",
    marginHorizontal: 16,
    marginTop: 14,
    color: "grey",
  },
  welcomeContainer: {
    flex: 1,
    width: "80%",
    height: "20%",
    /*backgroundColor: "#a7d199",*/
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 32,
  },
  btn: {
    backgroundColor: "black",
    borderRadius: 20,
    borderColor: "black",
    marginTop: 16,
    marginHorizontal: 16,
  },
  btnContainer: {
    flex: 1,
    marginTop: 36,
    paddingHorizontal: 16,
    width: "85%",
  },
});

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
import Home from "./screens/Home";
import Maps from "./screens/Maps";
//import MapFunction from "./screens/MapFunction";
import Login from "./screens/Login";
import AddNewItem from "./screens/AddNewItem";
import Tracking from "./screens/Tracking";
import Registration from "./screens/Registration";
import Dashboard from "./screens/Dashboard";
//import * as firebase from "firebase";
//import app from "../config/firebase.config";
import firebase from "firebase/compat/app";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Loading from "./screens/Loading";
import UserProfile from "./screens/UserProfile";
import AddNewField from "./screens/AddNewField";
import AccountScreen from "./screens/AccountScreen";

const Stack = createStackNavigator();

export default function App() {
  /*if (!firebase.apps.length) {
    console.log("Connected with Firebase");
    firebase.initializeApp(apiKeys.firebaseConfig);
  }
  */

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            //backgroundColor: "#B8D1A9",
            backgroundColor: "blue",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Tracking" component={Tracking} />
        {/*<Stack.Screen name="Maps" component={Maps} />*/}
        <Stack.Screen
          name="AddNewItem"
          component={AddNewItem}
          options={{ title: "Add New" }}
        />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: "Dashboard" }}
        />
        <Stack.Screen
          name="Loading"
          component={Loading}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="AddNewField"
          component={AddNewField}
          options={{ title: "Add New Field" }}
        />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen
          name="Maps"
          component={Maps}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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

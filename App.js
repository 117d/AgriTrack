import React, { useState, useEffect } from "react";
import Home from "./screens/Home";
import Maps from "./screens/Maps";
import Login from "./screens/Login";
import AddNewItem from "./screens/AddNewItem";
import Tracking from "./screens/Tracking";
import Registration from "./screens/Registration";
import Dashboard from "./screens/Dashboard";
//import * as firebase from "firebase";
import firebase from "firebase/compat/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./config/firebase.config";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Loading from "./screens/Loading";
import UserProfile from "./screens/UserProfile";
import AddNewField from "./screens/AddNewField";
import AccountScreen from "./screens/AccountScreen";
import { LogBox } from "react-native";
const Stack = createStackNavigator();
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import { default as theme } from "./assets/theme.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
export default function App() {
  /*if (!firebase.apps.length) {
    console.log("Connected with Firebase");
    firebas
    e.initializeApp(apiKeys.firebaseConfig);
  }
  */
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
  const [loggedIn, setLoggedIn] = useState(false);

  const authenticateUser = () => {
    // Detected if user is already logged in
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      console.log("user: " + JSON.stringify(user));
    });
  };

  useEffect(() => {
    if (!loggedIn) {
      authenticateUser();
    }
  }, [loggedIn]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                //backgroundColor: "#B8D1A9",
                backgroundColor: "#8dc27e",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            {!loggedIn ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Registration" component={Registration} />
                <Stack.Screen
                  name="Loading"
                  component={Loading}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
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
                <Stack.Screen name="Tracking" component={Tracking} />
                {/*<Stack.Screen name="Maps" component={Maps} />*/}
                <Stack.Screen
                  name="AddNewItem"
                  component={AddNewItem}
                  options={{ title: "Add New" }}
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
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}

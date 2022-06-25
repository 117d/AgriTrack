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
import TeamScreen from "./screens/TeamScreen";
import AddNewFieldByTracking from "./screens/AddNewFieldByTracking";
import { LogBox } from "react-native";
const Stack = createStackNavigator();
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { default as theme } from "./assets/theme.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import {
  getFields as GetFields,
  getTasks as GetTasks,
  getWorkers as GetWorkers,
  logOut,
} from "./firebase/fb.methods";

export default function App() {
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
  LogBox.ignoreAllLogs;
  const [loggedIn, setLoggedIn] = useState(false);
  const [userFields, setUserFields] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [userTeam, setUserTeam] = useState([]);

  const getFields = async () => {
    try {
      setUserFields(await GetFields());
      console.log("user fields in app.js: " + userFields);
    } catch (error) {
      console.log("Error getting fields in App.js: " + error);
    }
  };

  const getWorkers = async () => {
    try {
      setUserTeam(await GetWorkers());
      console.log("user team in app.js: " + JSON.stringify(userTeam));
    } catch (error) {
      console.log("Error getting fields in App.js: " + error);
    }
  };

  const getTasks = async () => {
    try {
      setUserTasks(await GetTasks());
    } catch (error) {
      console.log("getting tasks in App.js: " + error);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      console.log("called");
      if (user) {
        console.log("User name:  " + user.firstName);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
    getFields();
    getTasks();
    getWorkers();
  }, [loggedIn]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#3366FF",
              },
              headerTintColor: "#FFF",
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
                <Stack.Screen name="Dashboard" options={{ title: "Dashboard" }}>
                  {(props) => (
                    <Dashboard
                      {...props}
                      fields={userFields}
                      tasks={userTasks}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="Loading"
                  component={Loading}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Tracking" component={Tracking} />
                <Stack.Screen
                  name="AddNewItem"
                  component={AddNewItem}
                  options={{ title: "Add New" }}
                />

                <Stack.Screen name="UserProfile" options={{ title: "Profile" }}>
                  {(props) => (
                    <UserProfile
                      {...props}
                      fields={userFields}
                      tasks={userTasks}
                      updated={getTasks}
                      updated2={getFields}
                    />
                  )}
                </Stack.Screen>

                <Stack.Screen
                  name="New Field"
                  options={{ title: "Add New Field" }}
                >
                  {(props) => <AddNewField {...props} updated={getFields} />}
                </Stack.Screen>
                <Stack.Screen
                  name="Maps"
                  component={Maps}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="TeamScreen" options={{ title: "My Team" }}>
                  {(props) => (
                    <TeamScreen
                      {...props}
                      workers={userTeam}
                      updated3={getWorkers}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="New Tracked Field"
                  component={AddNewFieldByTracking}
                  options={{ headerShown: true }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}

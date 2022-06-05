import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { Modal, Button, Text, Card } from "@ui-kitten/components";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { editTask } from "../firebase/fb.methods";
import * as TaskManager from "expo-task-manager";
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const LOCATION_TASK_NAME = "background-location-task";

export default function Map({ navigation, route }) {
  const [field, setField] = useState(route.params.field);
  const [task, setTask] = useState(route.params.task);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currLocation, setCurrLocation] = useState({
    latitude: null,
    longitude: null,
    time: null,
  });
  const [startTime, setStartTime] = useState(0);
  const prevLocation = usePrevious(currLocation);
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(0);
  const [startTracking, setStartTracking] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [area, setArea] = useState(field.area);
  const [time, setTime] = useState(
    task.taskProgress
      ? task.taskProgress.time
      : {
          seconds: 0,
          minutes: 0,
          hours: 0,
        }
  );
  const [pathCoords, setPathCoords] = useState(
    task.taskProgress ? task.taskProgress.travelledPath : []
  );
  const [showUserLocation, setShowUserLocation] = useState(true);
  const mapView = React.createRef();

  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data;
      let currLocationData = {
        latitude: data.locations[0].coords.latitude,
        longitude: data.locations[0].coords.longitude,
        time: data.locations[0].timestamp,
      };
      if (currLocation != currLocationData) {
        setCurrLocation(currLocationData);
        if (
          startTracking &&
          currLocation.latitude != null &&
          currLocation.longitude != null
        ) {
          calculateTime();
          setPathCoords([
            ...pathCoords,
            {
              latitude: currLocation.latitude,
              longitude: currLocation.longitude,
            },
          ]);
        }
        console.log("Path coordinates: " + JSON.stringify(pathCoords));
        console.log(
          "curr loc data was logged: " + JSON.stringify(currLocationData)
        );
        //console.log("seconds: " + currLocationData.time / 1 000 000);
      }
    }
  });

  const emptyState = () => {
    setDistance(0);
    setSpeed(0);
    setArea(0);
    setTime({ seconds: 0, minutes: 0, hours: 0 });
  };

  //handle session saving
  const saveSession = () => {
    const progressData = {
      travelledPath: pathCoords,
      distanceTravelled: distance,
      time: time,
    };
    let progressChange = "IN PROGRESS";
    let dateFinished = null;
    let today = new Date();
    let date =
      today.getDate() +
      "." +
      (today.getMonth() + 1) +
      "." +
      today.getFullYear();
    // area == field.area
    //   ? ((progressChange = "DONE"), (dateFinished = date))
    //   : (progressChange = "IN PROGRESS");
    editTask(
      task.id,
      task.taskName,
      task.taskType,
      progressChange,
      progressData,
      task.dateCreated,
      dateFinished ? dateFinished : null
    );
    console.log("Saved");
    setModalVisible(!modalVisible);
    navigation.navigate("Dashboard");
  };

  const resumeSession = () => {
    setModalVisible(!modalVisible);
  };

  const deleteSession = () => {
    emptyState();
    setModalVisible(!modalVisible);
  };

  /* GET PREVIOUS VALUE OF THE LOCATION */
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    if (ref.current) {
      console.log(
        "REF.CURRENT.LAT: " +
          ref.current.latitude +
          " REF.CURRENT.LONG: " +
          ref.current.longitude
      );
    }
    return ref.current;
  }

  const clickedTracking = () => {
    setStartTracking(true);
    setShowUserLocation(false);
    setStartTime(new Date() * 1);
    console.log(
      "Clicked tracking and the current location is: " +
        JSON.stringify(currLocation)
    );
  };

  const followCamera = () => {
    if (startTracking) {
      console.log("follow camera called");
      mapView.current.animateCamera(
        {
          center: {
            latitude: currLocation.latitude,
            longitude: currLocation.longitude,
          },
          pitch: 65,
          heading: 180,
          altitude: 100,
          zoom: 80,
        },
        { duration: 1000 }
      );
    }
  };

  //** GET USER'S LOCATION **//
  const calculateDistance = () => {
    if (startTracking) {
      let distanceCalc = geolib.getDistance(
        { latitude: prevLocation.latitude, longitude: prevLocation.longitude },
        { latitude: currLocation.latitude, longitude: currLocation.longitude },
        100
      );
      console.log("calculated distance => " + distanceCalc);
      setDistance(distance + distanceCalc);
    }
  };

  const calculateSpeed = () => {
    if (startTracking) {
      let calcSpeed1 = prevLocation;
      //console.log("calcSpeed 1 object is: " + JSON.stringify(calcSpeed1));
      calcSpeed1.time = prevLocation.time;
      let calcSpeed2 = currLocation;
      calcSpeed2.time = currLocation.time;
      setSpeed(geolib.getSpeed(calcSpeed1, calcSpeed2));
      console.log("Speed: " + geolib.getSpeed(calcSpeed1, calcSpeed2));
    }
  };

  const calculateTime = () => {
    let newTime = new Date() * 1;
    let elapsedTime = ((newTime - startTime) / 1000).toFixed(0);

    setTime({
      hours: (elapsedTime / 3600).toFixed(0) % 24,
      minutes: (elapsedTime / 60).toFixed(0) % 60,
      seconds: elapsedTime % 60,
    });
  };

  const requestPermissions = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        //timeInterval: 10000,
        distanceInterval: 3,
      });
    }
  };

  useEffect(() => {
    console.log("useEffect was called");
    requestPermissions();
    followCamera();
    if (prevLocation) {
      calculateSpeed();
      calculateDistance();
    }
  }, [pathCoords]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Modal
        style={styles.modal}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        backdropStyle={styles.backdrop}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View>
          <Text style={styles.text}>Save Session?</Text>
          <View style={styles.button}>
            <Button style={styles.inputBtn} onPress={() => saveSession()}>
              Save
            </Button>
            <Button style={styles.inputBtn} onPress={() => deleteSession()}>
              Delete
            </Button>
            <Button style={styles.inputBtn} onPress={() => resumeSession()}>
              Resume
            </Button>
          </View>
        </View>
      </Modal>
      {currLocation.latitude != null ? (
        <MapView
          ref={mapView}
          style={[styles.map]}
          mapType="hybrid"
          showsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: currLocation.latitude,
            longitude: currLocation.longitude,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
          }}
          followsUserLocation={showUserLocation}
          showsCompass={true}
          loadingEnabled={true}
          provider={"google"}
          //onPress={(e) => console.log(e.nativeEvent.coordinate)}
        >
          {field.coordinates != null ? (
            <MapView.Polygon
              coordinates={field.coordinates}
              fillColor="rgba(255, 0, 0, 0.5)"
              strokeColor="red"
            />
          ) : null}
          {startTracking && pathCoords.length > 0 ? (
            <MapView.Polyline
              coordinates={pathCoords}
              strokeColor="rgba(25, 181, 254, 0.75)"
              strokeWidth={36}
              geodesic={true}
            />
          ) : null}
          {startTracking ? (
            <MapView.Marker
              coordinate={{
                latitude: currLocation.latitude,
                longitude: currLocation.longitude,
              }}
            />
          ) : null}
        </MapView>
      ) : null}
      <View style={styles.navBar}>
        <Text style={styles.navBarText}>
          Speed: {speed} km/h | Area: {area} Ha | Time:{" "}
          {time.hours < 10 ? "0" + time.hours : time.hours}:
          {time.minutes < 10 ? "0" + time.minutes : time.minutes}:
          {time.seconds < 10 ? "0" + time.seconds : time.seconds}
        </Text>
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarGroup}>
          <Text style={styles.bottomBarHeader}>DISTANCE</Text>
          <Text style={styles.bottomBarContent}>{distance} km</Text>
        </View>
      </View>
      {!startTracking ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => clickedTracking()}
        >
          <Image
            style={styles.image}
            source={require("../assets/start_icon.png")}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Image
            style={styles.image}
            source={require("../assets/save_icon.png")}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  navBar: {
    backgroundColor: "rgba(0,0,0,0.7)",
    //height: 64,
    height: 80,
    //width: width,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBarText: {
    color: "#19B5FE",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 30,
  },
  map: {
    //flex: 1,
    width: "100%",
    height: "100%",
    paddingTop: 81,
    //marginTop: 64,
  },
  bottomBar: {
    position: "absolute",
    height: 100,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "100%",
    padding: 20,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  bottomBarGroup: {
    flex: 1,
  },
  bottomBarHeader: {
    color: "#fff",
    fontWeight: "400",
    textAlign: "center",
  },
  bottomBarContent: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    color: "#19B5FE",
    textAlign: "center",
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    //flexWrap: "wrap",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    justifyContent: "space-between",
    alignContent: "center",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 50,
    borderColor: "white",
    height: 80,
    width: 80,
    right: 20,
    bottom: 20,
    alignContent: "center",
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: "#fff",
    elevation: 2, // Android
    overflow: "hidden",
  },
  buttonTxt: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: "60%",
    aspectRatio: 1,
    alignSelf: "center",
    margin: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    color: "white",
  },
  input: {
    paddingTop: 10,
    borderColor: "grey",
    borderBottomWidth: 2,
    color: "white",
  },
  button: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  modal: {
    width: "80%",
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: height / 2.5,
    left: width / 9,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingTop: 10,
  },
  inputBtn: {
    width: "30%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  inputBtnTxt: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});

/*
camera={{
            center: {
              latitude: currLocation.latitude,
              longitude: currLocation.longitude,
            },
            pitch: 90,
            heading: 45,
            altitude: 200,
            zoom: 30,
          }}
          */
/**
 * time presentation if have separate time values on each: 
 *  <Text style={styles.navBarText}>
          Speed: {speed} km/h | Area: {area} Ha | Time:{" "}
          {time.hours < 10 ? "0" + time.hours : time.hours}:
          {time.minutes < 10 ? "0" + time.minutes : time.minutes}:
          {time.seconds < 10 ? "0" + time.seconds : time.seconds}
        </Text>
 */

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Modal,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as geolib from "geolib";
import haversine from "haversine";
import { editTask } from "../firebase/fb.methods";
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function Map({ navigation, task, field, vehicleWidth }) {
  const [currLocation, setCurrLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const prevLocation = usePrevious(currLocation);
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(0);
  const [startTracking, setStartTracking] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [area, setArea] = useState(0);
  const [time, setTime] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
  });
  const [initialCoords, setInitialCoords] = useState({
    latitude: null,
    longitude: null,
  });
  const mapView = React.createRef();
  //dummy values
  const dummyCoords = [
    { latitude: 52.23982496430413, longitude: 20.996974892914295 },
    { latitude: 52.23964963014553, longitude: 20.996877998113632 },
    { latitude: 52.23963115226643, longitude: 20.99720422178507 },
  ];
  const plgnCoordinates = dummyCoords;
  const emptyState = () => {
    setDistance(0);
    setSpeed(0);
    setArea(0);
    setTime({ seconds: 0, minutes: 0, hours: 0 });
  };
  //handle session saving
  const saveSession = () => {
    const progressData = {
      distanceTravelled: distance,
      areaCovered: area,
      time: time,
    };
    const progressChange = "IN PROGRESS";
    const dateFinished = null;
    let today = new Date();
    let date =
      today.getDate() +
      "." +
      (today.getMonth() + 1) +
      "." +
      today.getFullYear();
    area == field.area
      ? ((progressChange = "DONE"), (dateFinished = date))
      : (progressChange = "IN PROGRESS");
    editTask(task.id, null, null, progressChange, progressData);
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

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    if (ref.current) {
      console.log(
        "REF.CURRENT.LAT: " +
          ref.current.latitude +
          "REF.CURRENT.LONG: " +
          ref.current.longitude
      );
    }
    return ref.current;
  }

  const clickedTracking = () => {
    setStartTracking(!startTracking);
    console.log(JSON.stringify(currLocation));

    console.log(typeof currLocation.latitude);
    mapView.current.animateCamera(
      {
        center: {
          latitude: 51.1597185,
          longitude: 71.455235,
        },
        pitch: 45,
        heading: 200,
        altitude: 200,
        zoom: 50,
      },
      { duration: 1000 }
    );
  };

  //** GET USER'S LOCATION **//
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      if (currLocation.latitude != null) {
        let prevLocation = usePrevious(currLocation);
        console.log("previous location" + prevLocation);
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
      });
      setCurrLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (prevLocation) {
        setDistance(
          distance + geolib.getDistance(prevLocation, currLocation, 10)
        );
      }
      if (startTracking) {
        calcSpeed1 = prevLocation;
        calcSpeed1.time = prevLocation.timestamp;
        calcSpeed2 = currLocation;
        calcSpeed2.time = currLocation.timestamp;
        setSpeed(getSpeed(calcSpeed1, calcSpeed2));
        console.log("SPeed: " + speed);
        mapView.current.animateCamera(
          {
            center: {
              latitude: currLocation.latitude,
              longitude: currLocation.longitude,
            },
            pitch: 90,
            heading: 45,
            altitude: 200,
            zoom: 15,
          },
          1000
        );
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modal}>
          <View style={styles.modalView}>
            <Text style={styles.text}>Save Session?</Text>

            <View style={styles.button}>
              <TouchableOpacity style={styles.inputBtn} onPress={saveSession}>
                <Text style={styles.inputBtnTxt}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputBtn} onPress={deleteSession}>
                <Text style={styles.inputBtnTxt}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputBtn} onPress={resumeSession}>
                <Text style={styles.inputBtnTxt}>Resume</Text>
              </TouchableOpacity>
            </View>
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
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
          }}
          followsUserLocation={true}
          showsCompass={true}
          //onPress={(e) => console.log(e.nativeEvent.coordinate)}
        >
          {plgnCoordinates != null ? (
            <MapView.Polygon
              coordinates={plgnCoordinates}
              fillColor="rgba(255, 0, 0, 0.5)"
              strokeColor="red"
            />
          ) : null}
          {clickedTracking ? (
            <MapView.Polyline
              coordinates={currLocation}
              strokeColor="rgba(255, 246, 84, 0.75)"
              strokeWidth={12}
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
      <TouchableOpacity style={styles.addButton} onPress={clickedTracking}>
        <Image
          style={styles.image}
          source={require("../assets/start_icon.png")}
        />
      </TouchableOpacity>
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
    //top: 0,
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
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 50,
    borderColor: "white",
    height: 80,
    width: 80,
    right: 20,
    bottom: 20,
    //alignContent: "center",
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: "#fff",
    elevation: 2, // Android
  },
  buttonTxt: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: "60%",
    aspectRatio: 1,
    //marginBottom: 80,
    //marginTop: 20,\
    marginLeft: 15,
    marginTop: 15,
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
    justifyContent: "center",
  },
  modal: {
    width: "70%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: height / 2.5,
    left: width / 6.3,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingTop: 10,
  },
  inputBtn: {
    width: "40%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
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

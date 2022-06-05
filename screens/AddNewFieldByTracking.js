import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as geolib from "geolib";
import haversine from "haversine";
import { addField } from "../firebase/fb.methods";
import { Card, Input, Modal, Text } from "@ui-kitten/components";
import * as TaskManager from "expo-task-manager";
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const crops = [
  "Wheat",
  "Rice",
  "Corn",
  "Legumes",
  "Potatoes",
  "Tomatoes",
  "Barley",
  "Beets",
  "Grass",
  "Hemp",
  "Cotton",
  "Flax",
  "Sunflower",
  "Other",
];

const LOCATION_TASK_NAME = "background-location-task";

export default function AddNewFieldByTracking({ navigation }) {
  const [stoppedTtacking, setStoppedTracking] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [cropType, setCropType] = useState("");
  const [currLocation, setCurrLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const prevLocation = usePrevious(currLocation);
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(0);
  const [startTracking, setStartTracking] = useState(false);
  const [plgnArea, setPlgnArea] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [time, setTime] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
  });
  const [fieldCoords, setFieldCoords] = useState([]);

  const mapView = React.createRef();
  //dummy values
  const dummyCoords = [
    { latitude: 52.23982496430413, longitude: 20.996974892914295 },
    { latitude: 52.23964963014553, longitude: 20.996877998113632 },
    { latitude: 52.23963115226643, longitude: 20.99720422178507 },
  ];
  //const plgnCoordinates = dummyCoords;
  const saveField = () => {
    addField(fieldName, fieldCoords, plgnArea, cropType);
    console.log("Saved");
    setModalVisible(!modalVisible);
    navigation.navigate("Dashboard");
  };
  const cancelSave = () => {
    console.log("Cancelled");
    setModalVisible(!modalVisible);
  };
  const clearFields = () => {
    setPlgnCoords([]);
    setFieldName("");
    setPlgnArea("");
    setCropType("");
    console.log("Cleared");
    setModalVisible(!modalVisible);
  };

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
          setPlgnCoords([
            ...plgnCoords,
            {
              latitude: currLocation.latitude,
              longitude: currLocation.longitude,
            },
          ]);
        }
        console.log("Polygon coordinates: " + JSON.stringify(plgnCoords));
        console.log(
          "curr loc data was logged: " + JSON.stringify(currLocationData)
        );
      }
    }
  });

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
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

  const clickedTracking = () => {
    setStartTracking(true);
    console.log(
      "Clicked tracking and the current location is: " +
        JSON.stringify(currLocation)
    );
  };

  const clickedStop = () => {
    setStoppedTracking(true);
    setStartTracking(false);
    console.log("Stopped tracking");
  };

  const pressedSave = () => {
    setModalVisible(true);
    const areaInM2 = geolib.getAreaOfPolygon(fieldCoords);
    setPlgnArea((areaInM2 / 1000).toFixed(3));
  };
  //** GET USER'S LOCATION **//
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
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <Card>
          <Text style={styles.text}>Save Field</Text>
          <Text style={styles.text}>Enter Field Name</Text>
          <Input
            style={styles.input}
            placeholder="Name"
            value={fieldName}
            onChangeText={(name) => setFieldName(name)}
          />
          <Picker
            style={{
              color: "white",
              borderBottomColor: "white",
              borderWidth: 2,
            }}
            mode="dropdown"
            selectedValue={cropType}
            prompt="Choose Type..."
            onValueChange={(itemValue, itemIndex) => setCropType(itemValue)}
          >
            {crops.map((crop, index) => (
              <Picker.Item label={crop} value={crop} key={index} />
            ))}
          </Picker>
          <Text style={styles.text}>Area: {plgnArea} ha</Text>
          <View style={styles.button}>
            <TouchableOpacity style={styles.inputBtn} onPress={saveField}>
              <Text style={styles.inputBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputBtn} onPress={clearFields}>
              <Text style={styles.inputBtnTxt}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputBtn} onPress={cancelSave}>
              <Text style={styles.inputBtnTxt}>Resume</Text>
            </TouchableOpacity>
          </View>
        </Card>
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
          zoomEnabled={true}
          followsUserLocation={true}
          showsCompass={true}
          //onPress={(e) => console.log(e.nativeEvent.coordinate)}
        >
          {
            (stoppedTtacking = false ? (
              <MapView.Polygon
                coordinates={fieldCoords}
                fillColor="rgba(255, 0, 0, 0.5)"
                strokeColor="red"
              />
            ) : null)
          }
          {startTracking && fieldCoords.length > 0 ? (
            <MapView.Polyline
              coordinates={fieldCoords}
              strokeColor="rgba(25, 181, 254, 0.75)"
              strokeWidth={36}
              geodesic={true}
            />
          ) : null}
        </MapView>
      ) : null}
      <View style={styles.navBar}>
        <Text style={styles.navBarText}>
          Speed: {speed} km/h | Area: {plgnArea} Ha | Time:{" "}
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
      {startTracking == false ? (
        <TouchableOpacity style={styles.addButton} onPress={clickedTracking}>
          <Image
            style={styles.image}
            source={require("../assets/start_icon.png")}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={pressedSave}>
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
    //justifyContent: "space-between",
    alignItems: "stretch",
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
    fontWeight: "700",
    textAlign: "center",
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
  image: {
    width: "60%",
    aspectRatio: 1,
    //marginBottom: 80,
    //marginTop: 20,\
    marginLeft: 14,
    marginTop: 14,
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

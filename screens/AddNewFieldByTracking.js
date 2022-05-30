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
export default function AddNewFieldByTracking({ navigation }) {
  const [fieldName, setFieldName] = useState("");
  const [cropType, setCropType] = useState("");
  const [currLocation, setCurrLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [plgnCoords, setPlgnCoords] = useState([]);
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
  const plgnCoordinates = dummyCoords;
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

  const pressedSave = () => {
    setModalVisible(true);
    const areaInM2 = geolib.getAreaOfPolygon(fieldCoords);
    setPlgnArea((areaInM2 / 1000).toFixed(3));
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
        timeInterval: 1000,
      });
      setCurrLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (prevLocation) {
        setDistance(
          distance + geolib.getDistance(prevLocation, currLocation, 10)
        );
        setFieldCoords(...fieldCoords, prevLocation);
      }
      if (startTracking) {
        calcSpeed1 = prevLocation;
        calcSpeed1.time = prevLocation.timestamp;
        calcSpeed2 = currLocation;
        calcSpeed2.time = currLocation.timestamp;
        setSpeed(getSpeed(calcSpeed1, calcSpeed2));
        console.log("Speed: " + speed);
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
          /*region={{
            latitude: currLocation.latitude,
            longitude: currLocation.longitude,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
          }}*/
          zoomEnabled={true}
          followsUserLocation={true}
          showsCompass={true}
          //onPress={(e) => console.log(e.nativeEvent.coordinate)}
        >
          {plgnCoordinates != null ? (
            <MapView.Polygon
              coordinates={fieldCoords}
              fillColor="rgba(255, 0, 0, 0.5)"
              strokeColor="red"
            />
          ) : null}
          {clickedTracking ? (
            <MapView.Polyline
              coordinates={fieldCoords}
              strokeColor="rgba(255, 246, 84, 0.75)"
              strokeWidth={3}
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

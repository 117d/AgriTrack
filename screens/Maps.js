import React, { useState, useEffect } from "react";
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

const { width, height } = Dimensions.get("window");
export default function Map({ navigation }) {
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState("");
  const [initialCoords, setInitialCoords] = useState({});
  const [startTracking, setStartTracking] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [area, setArea] = useState(0);
  const [time, setTime] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
  });

  //dummy values
  const dummyCoords = [
    { latitude: 52.23982496430413, longitude: 20.996974892914295 },
    { latitude: 52.23964963014553, longitude: 20.996877998113632 },
    { latitude: 52.23963115226643, longitude: 20.99720422178507 },
  ];

  //handle session saving
  const saveSession = () => {
    console.log("Saved");
    //setModalVisible(!modalVisible);
    navigation.navigate("Dashboard");
  };
  const cancelSession = () => {
    console.log("Cancelled");
    setModalVisible(!modalVisible);
  };
  /*
  const calcDistance = () => {
    const tempLoc = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    const tempCalc = geolib.getDistance(
      tempLoc.latitude,
      tempLoc.longitude,
      0.01
    );
    console.log("temporary calculations: " + tempCalc);
    //setDistance(parseFloat(tempCalc).toFixed(2))
    setDistance(distance + tempCalc);
  };
*/

  //calculate distance travelled:
  //second variant
  /*
  useEffect(() => {
    async function calcDistance() {
      const tempLoc = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      const tempCalc = geolib.getDistance(tempLoc, initialCoords, 0.01);
      console.log("temporary calculations: " + tempCalc);
      //setDistance(parseFloat(tempCalc).toFixed(2))
      setDistance(distance + tempCalc);
    }
    calcDistance();
  }, []);
*/
  const clickedTracking = () => {
    /*
    setStartTracking(true);
    const tempIniti = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    console.log("initial coords: ", tempIniti);
    setInitialCoords(tempIniti);*/
    const dummyArea = geolib.getAreaOfPolygon(dummyCoords);
    const tempConvertArea = geolib.convertArea(dummyArea, "ha");
    setArea(tempConvertArea.toFixed(3));
    const dummySpeed = geolib.getSpeed(
      { latitude: 51.567294, longitude: 7.38896, time: 1360231200880 },
      { latitude: 52.54944, longitude: 13.468509, time: 1360245600880 }
    );
    setSpeed(geolib.convertSpeed(dummySpeed, "kmh").toFixed(2));
    setTime({ seconds: 10, minutes: 3, hours: 0 });
    setDistance(0);
    setModalVisible(true);
  };

  //calculate time
  /*
  useEffect(() => {
    let isCancelled = false;

    const advanceTime = () => {
      setTimeout(() => {
        let nSeconds = time.seconds;
        let nMinutes = time.minutes;
        let nHours = time.hours;

        nSeconds++;

        if (nSeconds > 59) {
          nMinutes++;
          nSeconds = 0;
        }
        if (nMinutes > 59) {
          nHours++;
          nMinutes = 0;
        }
        if (nHours > 24) {
          nHours = 0;
        }

        !isCancelled &&
          setTime({ seconds: nSeconds, minutes: nMinutes, hours: nHours });
      }, 1000);
    };
    advanceTime();

    return () => {
      //final time:
      //console.log(time);
      isCancelled = true;
    };
  }, [time]);
*/

  //get user's location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
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
              <TouchableOpacity style={styles.inputBtn} onPress={cancelSession}>
                <Text style={styles.inputBtnTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <MapView
        style={styles.map}
        mapType="hybrid"
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={location}
        //maxZoomLevel={5}
        //minZoomLevel={40}
        followsUserLocation={true}
        //onPress={(e) => console.log(e.nativeEvent.coordinate)}
        onPress={(e) => getPolygonCoordinates(e)}
      >
        <MapView.Polygon
          //key={polygon.id}
          //coordinates={plgnCoordinates}
          coordinates={dummyCoords}
          fillColor="rgba(255, 0, 0, 0.5)"
          strokeColor="red"
          /*onPress={setPlgnArea(geolib.getAreaOfPolygon(dummyCoords))}*/
        />
      </MapView>
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
    flex: 1,
    width: "100%",
    height: "100%",
    paddingTop: 64,
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

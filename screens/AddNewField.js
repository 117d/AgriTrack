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
//import * as Permissions from "expo-permissions";

const { width, height } = Dimensions.get("window");
export default function AddNewField({ navigation }) {
  const [location, setLocation] = useState(null);
  const [plgnCoordinates, setPlngCoordinates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [plgnArea, setPlgnArea] = useState("");
  // handle the field saving
  const saveField = () => {
    console.log("Saved");
    setModalVisible(!modalVisible);
    navigation.navigate("Dashboard");
  };
  const cancelSave = () => {
    console.log("Cancelled");
    setModalVisible(!modalVisible);
  };
  //Get user's location
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
  /*
    <MapView.Polygon
          //key={polygon.id}
          coordinates={[
            { latitude: 37.8025259, longitude: -122.4351431 },
            { latitude: 37.7896386, longitude: -122.421646 },
            { latitude: 37.7665248, longitude: -122.4161628 },
            { latitude: 37.7734153, longitude: -122.4577787 },
            { latitude: 37.7948605, longitude: -122.4596065 },
            { latitude: 37.8025259, longitude: -122.4351431 },
          ]}
          fillColor="red"
          strokeColor="red"
        />
        */

  //onPress={ e => console.log(e.nativeEvent.coordinate) }
  /*Object {
  "latitude": 52.23994814948134,
  "longitude": 20.996913202106956,
}*/
  //let plgnCoordinates = [];
  const pressedSave = () => {
    setModalVisible(true);
    const areaInM2 = geolib.getAreaOfPolygon(dummyCoords);
    setPlgnArea((areaInM2 / 1000).toFixed(3));
  };
  const getPolygonCoordinates = (e) => {
    const newCoord = {
      latitude: parseFloat(e.nativeEvent.coordinate.latitude),
      longitude: parseFloat(e.nativeEvent.coordinate.longitude),
    };
    //console.log("new" + newCoord.longitude);
    //plgnCoordinates.push(newCoord);
    /*
    prevCoordinates = plgnCoordinates;
    setPlngCoordinates((prevCoordinates) => [...prevCoordinates, newCoord]);
    plgnCoordinates.map((plgnCoordinate) =>
      console.log(
        "lat: " + plgnCoordinate.latitude + " Long: " + plgnCoordinate.longitude
      )
    );*/
    console.log("lat: " + newCoord.latitude + " Long: " + newCoord.longitude);
    //e.nativeEvent.coordinate
  };
  /*
  useEffect(()=> {
    getPolygonCoordinates();
  }, [plgnCoordinates])
  */
  //calculateZoomLevel
  /*
  <MapView.Polygon
          //key={polygon.id}
          //coordinates={plgnCoordinates}
          coordinates={[
            { latitude: 52.23982496430413, longitude: 20.996974892914295 },
            { latitude: 52.23964963014553, longitude: 20.996877998113632 },
            { latitude: 52.23963115226643, longitude: 20.99720422178507 }
          ]}
          fillColor="red"
          strokeColor="red"
        />*/
  //const [zoom, setZoom] = useState(15);
  const dummyCoords = [
    { latitude: 52.23982496430413, longitude: 20.996974892914295 },
    { latitude: 52.23964963014553, longitude: 20.996877998113632 },
    { latitude: 52.23963115226643, longitude: 20.99720422178507 },
  ];
  return (
    <View style={styles.container}>
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
            <Text style={styles.text}>Enter Field Name</Text>
            <TextInput style={styles.input} placeholder="Name" />
            <Text style={styles.text}>Area: {plgnArea} ha</Text>
            <View style={styles.button}>
              <TouchableOpacity style={styles.inputBtn} onPress={saveField}>
                <Text style={styles.inputBtnTxt}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputBtn} onPress={cancelSave}>
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
      <TouchableOpacity style={styles.addButton} onPress={pressedSave}>
        <Image
          style={styles.image}
          source={require("../assets/save_icon.png")}
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
    height: 64,
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
    //flex: 0.7,
    width: "100%",
    height: "100%",
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
    marginLeft: 14,
    marginTop: 14,
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

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
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { addField } from "../firebase/fb.methods";

const dummyCoords = [
  { latitude: 52.23982496430413, longitude: 20.996974892914295 },
  { latitude: 52.23964963014553, longitude: 20.996877998113632 },
  { latitude: 52.23963115226643, longitude: 20.99720422178507 },
];

const { width, height } = Dimensions.get("window");
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
export default function AddNewField({ navigation }) {
  const [fieldName, setFieldName] = useState("");
  const [cropType, setCropType] = useState("");
  const [currLocation, setCurrLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [plgnCoords, setPlgnCoords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [plgnArea, setPlgnArea] = useState(null);
  const [mapClicked, setMapClicked] = useState(false);
  const [markers, setMarker] = useState([]);
  // handle the field saving
  const saveField = () => {
    addField(fieldName, plgnCoords, plgnArea, cropType);
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
    setMarker([]);
    setFieldName("");
    setPlgnArea("");
    setCropType("");
    console.log("Cleared");
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
      setCurrLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const pressedSave = () => {
    setModalVisible(true);
    const areaInM2 = geolib.getAreaOfPolygon(plgnCoords);
    setPlgnArea((areaInM2 / 1000).toFixed(3));
  };

  const onMapClick = (e) => {
    setMapClicked(true);
    setMarker([...markers, { latlng: e.nativeEvent.coordinate }]);
    setPlgnCoords([
      ...plgnCoords,
      {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
    ]);
  };
  //check for polygon array
  console.log("array of plgn coords: " + JSON.stringify(plgnCoords));

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
            <TextInput
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
              <TouchableOpacity style={styles.inputBtn} onPress={cancelSave}>
                <Text style={styles.inputBtnTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputBtn} onPress={clearFields}>
                <Text style={styles.inputBtnTxt}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {currLocation.latitude != null ? (
        <MapView
          style={styles.map}
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
          //onPress={(e) => console.log(e.nativeEvent.coordinate)}
          onPress={(e) => onMapClick(e)}
        >
          {markers.map((marker, i) => (
            <MapView.Marker coordinate={marker.latlng} key={i} />
          ))}
          {markers.length > 1 ? (
            <MapView.Polyline
              coordinates={plgnCoords}
              strokeColor={"black"}
              strokeWidth={3}
            />
          ) : null}
          {markers.length >= 3 ? (
            <MapView.Polygon
              coordinates={plgnCoords}
              fillColor="rgba(255, 0, 0, 0.5)"
              strokeColor="red"
            />
          ) : null}
        </MapView>
      ) : null}
      {mapClicked ? (
        <TouchableOpacity style={styles.addButton} onPress={pressedSave}>
          <Image
            style={styles.image}
            source={require("../assets/save_icon.png")}
          />
        </TouchableOpacity>
      ) : null}
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
    width: "80%",
    height: "30%",
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

//polyline
/*
{markers.length > 0
            ? markers.map((marker, i) => (
                <MapView.Polyline
                  coordinates={marker.latlng}
                  key={i}
                  strokeColor="black"
                  strokeWidth={3}
                />
              ))
            : null}
            */

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { addField } from "../firebase/fb.methods";
import {
  Button,
  Text,
  Modal,
  Card,
  Icon,
  Input,
  Spinner,
  Select,
  SelectItem,
  IndexPath,
} from "@ui-kitten/components";

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
export default function AddNewField(props) {
  const { navigation } = props;
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
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
    props.updated();
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

  const renderLoading = () => (
    <View style={styles.loading}>
      <Spinner size="giant" />
    </View>
  );
  const handleCropTypeSelection = (index) => {
    setSelectedIndex(index);
    setCropType(crops[selectedIndex.row]);
  };

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

  const SaveIcon = (props) => <Icon name="save-outline" {...props} />;

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        backdropStyle={styles.backdrop}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <Card style={{ minHeight: "70%" }}>
          <Text style={styles.text}>Enter Field Name</Text>
          <Input
            style={styles.input}
            placeholder="Name"
            value={fieldName}
            onChangeText={(name) => setFieldName(name)}
          />
          <Select
            style={styles.pickerStyle}
            mode="dropdown"
            value={crops[selectedIndex.row]}
            selectedIndex={selectedIndex}
            prompt="Choose Type..."
            onSelect={(index) => handleCropTypeSelection(index)}
          >
            {crops.map((crop, index) => (
              <SelectItem title={crop} value={crop} key={index} />
            ))}
          </Select>
          <Text style={styles.text}>Area: {plgnArea} ha</Text>
          <View style={styles.button}>
            <Button style={styles.inputBtn} onPress={saveField}>
              Save
            </Button>
            <Button style={styles.inputBtn} onPress={cancelSave}>
              Cancel
            </Button>
            <Button style={styles.inputBtn} onPress={clearFields}>
              Clear
            </Button>
          </View>
        </Card>
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
          zoomEnabled={true}
          followsUserLocation={true}
          onPress={(e) => onMapClick(e)}
        >
          {markers.map((marker, i) => (
            <MapView.Marker coordinate={marker.latlng} key={i} />
          ))}
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
        <TouchableOpacity onPress={pressedSave} style={styles.addButton}>
          <Image
            style={styles.image}
            source={require("../assets/save_icon.png")}
          />
        </TouchableOpacity>
      ) : (
        renderLoading()
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
    height: 64,
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  input: {
    paddingTop: 10,
    marginBottom: 15,
  },
  button: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
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
  pickerStyle: {
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "white",
  },
});

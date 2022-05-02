import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBarIOS,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView from "react-native-maps";
import haversine from "haversine";
//import Geolocation from "@react-native-community/geolocation";

const { width, height } = Dimensions.get("window");
//const navigation = useNavigation();
//import Geolocation from "@react-native-community/geolocation";
import Geolocation from "react-native-geolocation-service";
//navigator.geolocation = require("@react-native-community/geolocation");
export default class MapFunction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      speed: 0,
    };
  }

  componentDidMount() {
    /* TO FIX */
    //StatusBarIOS.setStyle("light-content");
    //navigator.geolocation = require("@react-native-community/geolocation");
    //navigator.geolocation.getCurrentPosition(
    Geolocation.getCurrentPosition(
      (position) => {},
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    //this.watchID = navigator.geolocation.watchPosition((position) => {
    this.watchID = Geolocation.watchPosition((position) => {
      const { routeCoordinates, distanceTravelled } = this.state;
      const newLatLngs = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      const positionLatLngs = pick(position.coords, ["latitude", "longitude"]);
      const newSpeed = position.coords.speed;
      this.setState({
        routeCoordinates: routeCoordinates.concat(positionLatLngs),
        distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
        prevLatLng: newLatLngs,
        speed: newSpeed,
      });
    });
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  calcDistance(newLatLng) {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          mapType="satellite"
          showsUserLocation={true}
          followUserLocation={true}
          provider={"google"}
          overlays={[
            {
              coordinates: this.state.routeCoordinates,
              strokeColor: "#19B5FE",
              lineWidth: 10,
            },
          ]}
        />
        <View style={styles.navBar}>
          <Text style={styles.navBarText}>Run Rabbit Run</Text>
        </View>
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarGroup}>
            <Text style={styles.bottomBarHeader}>DISTANCE</Text>
            <Text style={styles.bottomBarContent}>
              {parseFloat(this.state.distanceTravelled).toFixed(2)} km;
              {this.state.speed} km/h
            </Text>
          </View>
        </View>
      </View>
    );
  }
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
    width: width,
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
    flex: 0.7,
    width: width,
    height: height,
  },
  bottomBar: {
    position: "absolute",
    height: 100,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: width,
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
});

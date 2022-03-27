import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AddNewItem() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>WILL BE IMPLEMENTED LATER</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>BACK</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B8D1A9",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    marginTop: 40,
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  textTitle: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
  },
});

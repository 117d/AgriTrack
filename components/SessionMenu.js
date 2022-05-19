import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
// to do later
export default function SessionMenu(props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.displayMode}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!props.modalVisible);
      }}
    >
      <View style={styles.modal}>
        <View style={styles.modalView}>
          <Text style={styles.text}>Save Session?</Text>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.inputBtn}
              onPress={props.saveSession}
            >
              <Text style={styles.inputBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.inputBtn}
              onPress={props.cancelSession}
            >
              <Text style={styles.inputBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    color: "white",
  },
  button: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
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

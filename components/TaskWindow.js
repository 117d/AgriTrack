import { Card, Modal } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";
/** MODAL FOR VIEWING COMPONENTS INFO */
export const TaskWindow = (props) => {
  return (
    <Modal
      style={styles.modal}
      visible={props.modalVisible}
      backdropStyle={styles.backdrop}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Card>
        <Text style={styles.modalTitle}>View</Text>
        <View style={styles.listOfValues}>
          <Text>Name: {props.task.taskName}</Text>
          <Text>Type: {props.task.type}</Text>
          <Text>Date created: {props.task.dateCreated}</Text>
          <Text>Progress: {props.task.taskProgress}</Text>
        </View>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: "70%",
    maxHeight: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingTop: 10,
  },
  backdrop: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalTitle: { marginBottom: 20 },
  listOfValues: { flex: 1, alignItems: "center", justifyContent: "center" },
});

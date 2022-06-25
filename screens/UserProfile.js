import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import firebase from "firebase/compat/app";
import {
  Button,
  Icon,
  ListItem,
  List,
  Text,
  ButtonGroup,
  Layout,
  TabView,
  Tab,
  Modal,
  Card,
  Input,
  IndexPath,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import { TaskWindow } from "../components/TaskWindow";
import {
  deleteField,
  deleteTask,
  editField,
  editTask,
} from "../firebase/fb.methods";

export default function UserProfile(props) {
  let currUserId = firebase.auth().currentUser.uid;
  const { navigation } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [task, setTask] = useState({
    id: null,
    taskName: "",
    taskType: "",
    taskStatus: "",
    dateCreated: "",
  });
  const [field, setField] = useState({
    id: null,
    fieldName: "",
    coordinates: [],
    area: "",
    cropType: "",
  });
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("");
  const [newTaskType, setNewTaskType] = useState("");
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldCropType, setNewFieldCropType] = useState("");
  const DeleteIcon = (props) => <Icon name="close" {...props} />;
  const EditIcon = (props) => <Icon name="edit" {...props} />;
  const ClipboardIcon = (props) => <Icon name="clipboard" {...props} />;
  const LayersIcon = (props) => <Icon name="layers" {...props} />;
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedIndex2, setSelectedIndex2] = useState(new IndexPath(0));
  const [selectedIndex3, setSelectedIndex3] = useState(new IndexPath(0));

  const taskTypes = [
    { taskId: 1, taskName: "Tilling" },
    { taskId: 2, taskName: "Fertilizing" },
    { taskId: 3, taskName: "Spraying" },
    { taskId: 4, taskName: "Planting" },
    { taskId: 5, taskName: "Harvesting" },
    { taskId: 6, taskName: "Other" },
  ];
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
  const taskStatuses = ["TO DO", "IN PROGRESS", "DONE"];

  const handleEdit = (chosenTask) => {
    console.log("clicked edit button");
    console.log("task passed is: " + JSON.stringify(chosenTask));
    setTask({
      id: chosenTask.id,
      taskName: chosenTask.taskName,
      taskType: chosenTask.taskType,
      taskStatus: chosenTask.taskStatus,
      dateCreated: chosenTask.dateCreated,
    });
    setModalVisible(true);
  };

  const handleEdit2 = (chosenField) => {
    setField({
      id: chosenField.id,
      fieldName: chosenField.fieldName,
      coordinates: chosenField.coordinates,
      area: chosenField.area,
      cropType: chosenField.cropType,
    });
    setModalVisible2(true);
  };
  const saveEdittedTask = () => {
    editTask(
      task.id,
      newTaskName == "" ? task.taskName : newTaskName,
      newTaskType == "" ? task.taskType : newTaskType,
      newTaskStatus == "" ? task.taskStatus : newTaskStatus,
      null,
      task.dateCreated,
      null
    );
    setModalVisible(false);
    props.updated();
  };

  const renderItemAccessory = (props) => (
    <Button
      accessoryLeft={EditIcon}
      size={"tiny"}
      onPress={() => handleEdit(props)}
    ></Button>
  );

  const renderItemIcon = (props) => (
    <Icon {...props} name="checkmark-square-2-outline" />
  );

  const renderFieldAccessory = (props) => (
    <Button
      accessoryLeft={EditIcon}
      size={"tiny"}
      onPress={() => handleEdit2(props)}
    ></Button>
  );

  const renderFieldIcon = (props) => <Icon {...props} name="compass" />;

  useEffect(() => {
    props.updated();
    props.updated2();
  }, []);

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${index + 1} ${item.taskName} `}
      description={`${item.taskStatus} |  ${item.taskType}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory(item)}
    />
  );

  const handleTaskTypeSelection = (index) => {
    setSelectedIndex(index);
    setNewTaskType(taskTypes[selectedIndex.row].taskName);
  };
  const handleCropTypeSelection = (index) => {
    setSelectedIndex3(index);
    setNewFieldCropType(crops[selectedIndex3.row]);
  };

  const saveEdittedField = () => {
    editField(
      field.id,
      newFieldName == "" ? field.fieldName : newFieldName,
      field.coordinates,
      field.area,
      newFieldCropType == "" ? field.cropType : newFieldCropType
    );
    setModalVisible2(false);
    props.updated2();
  };

  const renderFieldItem = ({ item, index }) => (
    <ListItem
      title={`${index + 1} ${item.fieldName} `}
      description={`Crop type: ${item.cropType} | Area: ${item.area}`}
      accessoryLeft={renderFieldIcon}
      accessoryRight={renderFieldAccessory(item)}
    />
  );
  const handleTaskStatus = (index) => {
    setSelectedIndex2(index);
    setNewTaskStatus(taskStatuses[selectedIndex2.row]);
  };
  const handleTaskRemoval = () => {
    deleteTask(task.id);
    setModalVisible(false);
    props.updated();
  };
  const handleFieldRemoval = () => {
    deleteField(field.id);
    setModalVisible2(false);
    props.updated2();
  };
  return (
    <View style={styles.container}>
      <Modal
        style={styles.modal}
        visible={modalVisible}
        backdropStyle={styles.backdrop}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Card>
          <Text style={styles.modalTitle}>Edit</Text>
          <View style={styles.listOfValues}>
            <Text style={styles.itemsText}>Name: </Text>
            <Input
              style={{ width: "100%" }}
              value={newTaskName ? newTaskName : task.taskName}
              onChangeText={(newName) => setNewTaskName(newName)}
            ></Input>

            <Text style={styles.itemsText}>Type:</Text>
            <Select
              value={
                task.taskType == null && newTaskType == ""
                  ? "Not set"
                  : taskTypes[selectedIndex.row].taskName
              }
              style={styles.pickerStyle}
              mode="dropdown"
              selectedIndex={selectedIndex}
              prompt="Choose Task..."
              onSelect={(index) => handleTaskTypeSelection(index)}
            >
              {taskTypes.map((type) => (
                <SelectItem
                  title={type.taskName}
                  value={type.taskName}
                  key={type.taskId}
                />
              ))}
            </Select>
            <Text style={styles.itemsText}>
              Date created:{" "}
              {new Date(task.dateCreated.seconds * 1000).getDate() +
                "." +
                (new Date(task.dateCreated.seconds * 1000).getMonth() + 1) +
                "." +
                new Date(task.dateCreated.seconds * 1000).getFullYear()}
            </Text>
            <Text style={styles.itemsText}>Status: </Text>

            <Select
              value={task.taskStatus[selectedIndex2.row]}
              selectedIndex={selectedIndex2}
              onSelect={(index) => handleTaskStatus(index)}
              style={styles.pickerStyle}
            >
              {taskStatuses.map((status, index) => (
                <SelectItem title={status} value={status} key={index} />
              ))}
            </Select>
            <View style={styles.buttonContainer}>
              <Button style={styles.btns} onPress={saveEdittedTask}>
                Save
              </Button>
              <Button
                style={styles.btns}
                status={"danger"}
                onPress={handleTaskRemoval}
              >
                Delete
              </Button>
              <Button
                style={styles.btns}
                status={"warning"}
                onPress={() => setModalVisible(false)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Card>
      </Modal>
      <Modal
        style={styles.modal}
        visible={modalVisible2}
        backdropStyle={styles.backdrop}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
        }}
      >
        <Card>
          <Text style={styles.modalTitle}>Edit</Text>
          <View style={styles.listOfValues}>
            <Text style={styles.itemsText}>Name: </Text>
            <Input
              style={{ width: "100%" }}
              value={newFieldName ? newFieldName : field.fieldName}
              onChangeText={(newName) => setNewFieldName(newName)}
            ></Input>
            <Text style={styles.itemsText}>Crop Type:</Text>
            <Select
              value={crops[selectedIndex3.row]}
              style={styles.pickerStyle}
              mode="dropdown"
              selectedIndex={selectedIndex3}
              prompt="Choose Task..."
              onSelect={(index) => handleCropTypeSelection(index)}
            >
              {crops.map((type, index) => (
                <SelectItem title={type} value={type} key={index} />
              ))}
            </Select>
            <View style={styles.buttonContainer}>
              <Button style={styles.btns} onPress={saveEdittedField}>
                Save
              </Button>
              <Button
                style={styles.btns}
                status={"danger"}
                onPress={handleFieldRemoval}
              >
                Delete
              </Button>
              <Button
                style={styles.btns}
                status={"warning"}
                onPress={() => setModalVisible2(false)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Card>
      </Modal>
      <Text category={"h2"}>Your Tasks</Text>
      {props.tasks ? (
        <List
          style={styles.container}
          data={props.tasks}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.container}>
          <Text category={"h4"}>No tasks to display</Text>
        </View>
      )}

      <Text category={"h2"}>Your Fields</Text>
      {props.fields && props.fields.length > 0 ? (
        <List
          style={styles.container}
          data={props.fields}
          renderItem={renderFieldItem}
        />
      ) : (
        <View style={styles.container}>
          <Text category={"h4"}>No fields to display</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    maxHeight: "100%",
  },
  listContainer: {
    height: 200,
    width: 300,
  },
  pickerStyle: {
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginBottom: 10,
  },
  modal: {
    width: "80%",
    maxHeight: "70%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    borderRadius: 300,
  },
  backdrop: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalTitle: {
    marginBottom: 20,
    fontSize: 24,
    alignSelf: "center",
    backgroundColor: "#3366FF",
    width: "100%",
    textAlign: "center",
    color: "white",
  },
  listOfValues: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 15,
  },
  itemsText: { fontWeight: "700", margin: 10 },
  buttonContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btns: { margin: 5, alignSelf: "center" },
});

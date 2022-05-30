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
} from "@ui-kitten/components";

export default function UserProfile(props) {
  let currUserId = firebase.auth().currentUser.uid;
  const { navigation } = props;

  const DeleteIcon = (props) => <Icon name="close" {...props} />;
  const EditIcon = (props) => <Icon name="edit" {...props} />;
  const ClipboardIcon = (props) => <Icon name="clipboard" {...props} />;
  const LayersIcon = (props) => <Icon name="layers" {...props} />;

  const renderItemAccessory = (props) => (
    <Button accessoryLeft={DeleteIcon} size={"tiny"}></Button>
  );

  const renderItemIcon = (props) => (
    <Icon {...props} name="checkmark-square-2-outline" />
  );

  const renderFieldAccessory = (props) => (
    <ButtonGroup style={{ margin: 5 }} size="tiny">
      <Button accessoryLeft={DeleteIcon}></Button>
      <Button accessoryLeft={EditIcon}></Button>
    </ButtonGroup>
  );

  const renderFieldIcon = (props) => <Icon {...props} name="compass" />;

  useEffect(() => {}, []);

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${index + 1} ${item.taskName} `}
      description={`${item.taskStatus} |  ${item.taskType}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory(item.id)}
    />
  );

  const renderFieldItem = ({ item, index }) => (
    <ListItem
      title={`${index + 1} ${item.fieldName} `}
      description={`Crop type: ${item.cropType} | Area: ${item.area}`}
      accessoryLeft={renderFieldIcon}
      accessoryRight={renderItemAccessory(item.id)}
    />
  );

  return (
    // <TabView
    //   selectedIndex={selectedIndex}
    //   onSelect={(index) => setSelectedIndex(index)}
    // >
    //   <Tab title="Tasks" icon={ClipboardIcon}>
    <View style={styles.container}>
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
    /* </Tab>
      <Tab title="Fields" icon={LayersIcon}>
        <View style={styles.container}>
          <Text category={"h2"}>Your Fields</Text>
          <List
            style={styles.container}
            data={props.fields}
            renderItem={renderFieldItem}
          />
        </View>
      </Tab>
    </TabView> */
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
});

import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Layout, Text } from "@ui-kitten/components";

const Header = (props) => (
  <View {...props}>
    <Text category="h6">{task.taskName}</Text>
    <Text category="s1">{task.status}</Text>
  </View>
);

const Footer = (props) => (
  <View {...props} style={[props.style, styles.footerContainer]}>
    <Button style={styles.footerControl} size="small" status="basic">
      CANCEL
    </Button>
    <Button style={styles.footerControl} size="small">
      ACCEPT
    </Button>
  </View>
);

export const TaskCard = (task) => {
  <>
    <Card style={styles.card} header={Header} footer={Footer}>
      <Text>{task.taskType}</Text>
    </Card>
  </>;
};

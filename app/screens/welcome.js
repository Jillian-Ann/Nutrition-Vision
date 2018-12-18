import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";

export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.handlePress = this.handlePress.bind(this);
  }
  static navigationOptions = {
    header: null
  };

  handlePress() {
    const { navigate } = this.props.navigation;
    navigate("Camera");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>NUTRI-VISION</Text>
        <Button onPress={this.handlePress} title="Capture Menu" />
        <Image source={require("../../image/capture.gif")} />
      </View>
    );
  }
}

//STYLE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    fontSize: 40,
    color: "navy",
    fontWeight: "bold",
    alignItems: "flex-start"
  },
  image: {
    flex: 2
  }
});

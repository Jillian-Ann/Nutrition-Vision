import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";

//SCREENS
import WelcomeScreen from "./app/screens/welcome";
import CameraScreen from "./app/screens/camera";
import NutritionScreen from "./app/screens//nutrition";

//STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

//RENDER
export default class App extends React.Component {
  render() {
    return <AppStackNavigator style={styles.container} />;
  }
}

const AppStackNavigator = createStackNavigator({
  Welcome: WelcomeScreen,
  Camera: CameraScreen,
  Nutrition: NutritionScreen
});

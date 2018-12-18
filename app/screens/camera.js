import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from "react-native";
import { Camera, Permissions } from "expo";
import axios from "axios";

const cloudVision =
  "https://vision.googleapis.com/v1/images:annotate?key=" +
  process.env.cloudVisionKey;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back
    };
    this.toggleLoader = this.toggleLoader.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.searchAPI = this.searchAPI.bind(this);
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  }

  toggleLoader() {
    this.setState({
      showLoader: !this.state.showLoader
    });
  }

  async searchAPI(dishes) {
    try {
      this.toggleLoader();
      const dishNutritions = await dishes.map(async dish => {
        if (dish.length) {
          const dishSearchName = dish.split(" ").join("+");
          const isADishres = await axios.get(
            `https://dishdetails.herokuapp.com/api/dishes/check?title=${dishSearchName}`
          );
          if (isADishres.data.dishes.length) {
            const res = await axios.get(
              `https://dishdetails.herokuapp.com/api/dishes?title=${dishSearchName}`
            );
            const nutrition = res.data;
            if (nutrition.calories !== undefined) {
              const dishWithNutrition = {
                name: dish.toUpperCase(),
                calories: nutrition.calories.value + "kcal",
                carbs: nutrition.carbs.value + nutrition.carbs.unit,
                fat: nutrition.fat.value + nutrition.fat.unit,
                protein: nutrition.protein.value + nutrition.protein.unit
              };
              return dishWithNutrition;
            }
          }
        }
      });
      Promise.all(dishNutritions).then(loaded => {
        this.toggleLoader();
        this.props.navigation.navigate("Nutrition", {
          nutritionArray: loaded
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  showAlert(title, message) {
    this.toggleLoader();
    Alert.alert(title, "Dishes Detected", [
      { text: "Retake", onPress: () => console.log("OK Pressed") },
      {
        text: "Nutrition",
        onPress: () => {
          const dishNames = message.split("\n");
          this.searchAPI(dishNames, message);
        }
      }
    ]);
  }

  _takeImage() {
    if (this.camera) {
      let _this = this;
      this.toggleLoader();
      this.camera
        .takePictureAsync({ base64: true })
        .then(data => {
          axios
            .post(cloudVision, {
              requests: [
                {
                  image: {
                    content: data.base64
                  },
                  features: [
                    {
                      type: "TEXT_DETECTION",
                      maxResults: 1
                    }
                  ]
                }
              ]
            })
            .then(function(response) {
              if (response.data.responses[0].textAnnotations == undefined) {
                _this.showAlert(
                  "Notice",
                  "There is no character on image or you need to take photo more clearly"
                );
              } else {
                let textAnnotations =
                  response.data.responses[0].textAnnotations[0];
                console.log(textAnnotations);
                let textContent = textAnnotations.description;
                _this.showAlert("Analyzed", textContent);
              }
            });
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    const { hasCameraPermission, showLoader } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to Camera</Text>;
    } else if (showLoader) {
      return (
        <View style={styles.loader}>
          {" "}
          <Image source={require("../../image/foodLoader.gif")} />{" "}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.camera}
            type={this.state.type}
          >
            <View style={styles.bottom}>
              <TouchableOpacity onPress={this._takeImage.bind(this)}>
                <Image
                  source={require("../../image/take.png")}
                  style={styles.take}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  loader: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  bottom: {
    width: Dimensions.get("window").width,
    position: "absolute",
    flexDirection: "row",
    bottom: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  take: {
    width: 80,
    height: 80
  },
  rebase: {
    position: "absolute",
    right: 10
  },
  rebaseImage: {
    width: 40,
    resizeMode: "contain"
  }
});

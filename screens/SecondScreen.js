import React from "react";
import { Button, Text, View, ImageBackground, Image } from "react-native";

import { styles } from "../styles/styles";

const SecondScreen = (props) => {
  return (
    <ImageBackground
      source={require("../assets/background1.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.form}>
        <Text style={styles.headerText}>About Us</Text>
        <View style={styles.welcomeImageContainer}>
          <Image
            source={require("../assets/about.png")}
            style={styles.welcomeImage}
          />
        </View>

        <View style={styles.aboutContainer}>
          <Text style={styles.textValue}> Agnita Paul </Text>
          <Text style={styles.textValue}>Saeed Alsabawi</Text>
          <Text style={styles.textValue}> Ivan Sahnga Kepseu</Text>
        </View>

        <View style={styles.WelcomeButtonFull}>
          <Button
            color="black"
            title="Go Back"
            onPress={() => {
              props.navigation.goBack();
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

SecondScreen.navigationOptions = {
  headerTitle: "Add Place",
};

export default SecondScreen;

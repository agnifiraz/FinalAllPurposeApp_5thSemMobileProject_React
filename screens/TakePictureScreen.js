import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  Icon,
} from "react-native";

import ImageSelector from "../components/ImageSelector";

const TakePictureScreen = () => {
  const [selectedImage, setSelectedImage] = useState();

  const imageSelectedHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };

  return (
    <View>
      <View style={styles.form}>
        {/* <TouchableOpacity>
          <View style={styles.box}>
            <Text style={styles.label}>Lets Take a picture!</Text>
          </View>
        </TouchableOpacity> */}

        {/* <Text style={styles.label}>Lets Take a picture!</Text> */}

        <ImageSelector onImageSelected={imageSelectedHandler} />
        <View>
          <Image style={styles.image} source={{ uri: selectedImage }} />
        </View>

        {/* {!selectedImage && (
          <ImageSelector onImageSelected={imageSelectedHandler} />
        )}
        {selectedImage && (
          <View>
            <Image style={styles.image} source={{ uri: selectedImage }} />
            <Button
              title="Reset"
              onPress={() => {
                setSelectedImage(null);
              }}
            />
          </View>
        )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderColor: "red",
    borderWidth: 1,
  },
  box: {
    width: 150,
    height: 150,
    borderColor: "black",
    borderWidth: 1,
  },
});

export default TakePictureScreen;

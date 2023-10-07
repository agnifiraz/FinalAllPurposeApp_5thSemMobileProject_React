import React, { useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  Alert,
  CameraRoll,
  TouchableOpacity,
  Image,
  Text,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

// The following are required for access to the camera:
// expo install expo-image-picker
// expo install expo-permissions

const ImageSelector = ({ onImageUriChange }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const handleActionSelection = (action) => {
    setSelectedAction(action);
    setIsModalVisible(false);
  };

  const verifyPermissions = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    const libraryResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraResult.status !== "granted" &&
      libraryResult.status !== "granted"
    ) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const retrieveImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return false;
    }

    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!image.cancelled) {
      setSelectedImage(image.uri);
      // props.onImageSelected(image.uri);
      onImageUriChange(image.uri);
    }
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return false;
    }

    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!image.cancelled) {
      setSelectedImage(image.uri);
      onImageUriChange(image.uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          title="Take Image"
          onPress={() => setIsModalVisible(true)}
        >
          <View style={[styles.box, { borderRadius: 125 }]}>
            {selectedImage ? (
              <Image
                style={[styles.image, { flex: 1 }]}
                resizeMode="contain"
                source={{ uri: selectedImage }}
              />
            ) : (
              <Text style={styles.text}>Add Picture</Text>
            )}
          </View>
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={retrieveImageHandler}
              >
                <Text style={styles.modalButtonText}>
                  Retrieve from Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={takeImageHandler}
              >
                <Text style={styles.modalButtonText}>Take Picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: 250,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
    minHeight: 100,
  },
  button: {
    paddingVertical: 25,
    width: "100%",
  },
  box: {
    width: 220,
    height: 220,
    borderColor: "blue",
    borderWidth: 1,
    backgroundColor: "black",
    overflow: "hidden",
    marginLeft: 70,
  },
  text: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "orange",
    marginTop: 95,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#F5FCFF80",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalButton: {
    backgroundColor: "#010125",
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#042446",
    borderRadius: 10,
    padding: 60,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ImageSelector;

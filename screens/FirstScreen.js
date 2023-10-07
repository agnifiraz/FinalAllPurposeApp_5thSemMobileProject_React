import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  TextInput,
  Button,
  ImageBackground,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../components/CustomHeaderButton";
import { styles } from "../styles/styles";
import { db, auth } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const FirstScreen = (props) => {
  const [isModalVisibleRegister, setIsModalVisibleRegister] = useState(false);
  const [isModalVisibleLogin, setIsModalVisibleLogin] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [userName, setUserName] = useState("");

  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [confirmPassword, setConfirmPassword] = React.useState("");
  let [validationMessage, setValidationMessage] = React.useState("");

  const titleChangeHandler = (text) => {
    setTitleValue(text);
  };

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconSize={40}
            title="Screen 2"
            iconName={
              Platform.OS === "android"
                ? "information-circle"
                : "information-circle"
            }
            onPress={() => props.navigation.navigate("ScreenTwo")}
          />
        </HeaderButtons>
      ),
    });
  }, []);

  let validateAndSet = (value, valueToCompare, setValue) => {
    if (value !== valueToCompare) {
      setValidationMessage("Passwords do not match.");
    } else {
      setValidationMessage("");
    }

    setValue(value);
  };

  let signUp = () => {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          sendEmailVerification(auth.currentUser);
          props.navigation.navigate("ScreenThree", {
            userName,
          });
          setIsModalVisibleRegister(false);
        })
        .catch((error) => {
          setValidationMessage(error.message);
        });
    }
  };

  let login = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          props.navigation.navigate("ScreenThree", {
            userName,
          });
          setIsModalVisibleLogin(false);
          setErrorMessage("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          setErrorMessage(error.message);
          Alert.alert("Error", "Incorrect login information.");
        });
    } else {
      setErrorMessage("Please enter an email and password");
      Alert.alert("Error", "Please enter an email and password. ");
    }
  };

  let [errorMessage, setErrorMessage] = React.useState("");
  let [emailLog, setEmailLog] = React.useState("");
  let [passwordLog, setPasswordLog] = React.useState("");

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.form}>
        <Text style={styles.headerText}>Welcome!</Text>
        <Text style={styles.label}>WELCOME TO OUR APP...</Text>
        <Text style={styles.label}>Make a beautiful Note for your day</Text>
        <View style={styles.welcomeImageContainer}>
          <Image
            source={require("../assets/note.png")}
            style={styles.welcomeImage}
          />
        </View>
        <TextInput
          style={styles.textInput}
          //   onChangeText={titleChangeHandler}
          //   value={titleValue}
          value={userName}
          onChangeText={(username) => setUserName(username)}
          placeholder="Enter your Name..."
          placeholderTextColor="#49494c"
        ></TextInput>

        <View style={styles.welcomeButtonContainer}>
          <View style={styles.WelcomeButton}>
            <Button
              color="black"
              title="Register"
              onPress={() => setIsModalVisibleRegister(true)}
            />
          </View>
          <View style={styles.WelcomeButton}>
            <Button
              color="black"
              title="Login"
              onPress={() => setIsModalVisibleLogin(true)}
            />
          </View>
        </View>

        <Modal
          visible={isModalVisibleRegister}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              style={styles.registerInput}
              placeholderTextColor="#49494c"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Password"
              style={styles.registerInput}
              placeholderTextColor="#49494c"
              secureTextEntry={true}
              value={password}
              onChangeText={(value) =>
                validateAndSet(value, confirmPassword, setPassword)
              }
            />

            <TextInput
              placeholder="Confirm Password"
              style={styles.registerInput}
              placeholderTextColor="#49494c"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={(value) =>
                validateAndSet(value, password, setConfirmPassword)
              }
            />

            <View style={styles.WelcomeButtonFull}>
              <Button color="black" title="Register" onPress={signUp} />
            </View>

            <TouchableOpacity
              style={styles.textModalButton}
              onPress={() => setIsModalVisibleRegister(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          visible={isModalVisibleLogin}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              style={styles.registerInput}
              placeholderTextColor="#49494c"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Password"
              style={styles.registerInput}
              placeholderTextColor="#49494c"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.WelcomeButtonFull}>
              <Button color="black" title="Log In" onPress={login} />
            </View>

            {/* <View style={styles.WelcomeButtonFull}>
              <Button
                color="black"
                title="Make your own note"
                onPress={() => {
                  props.navigation.navigate("ScreenThree", {
                    userName,
                  });
                  setIsModalVisibleLogin(false);
                }}
              />
            </View> */}

            <TouchableOpacity
              style={styles.textModalButton}
              onPress={() => setIsModalVisibleLogin(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

export default FirstScreen;

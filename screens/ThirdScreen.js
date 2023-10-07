import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "../styles/styles";
import { Entypo } from "@expo/vector-icons";
import ImageSelector from "../components/ImageSelector";
import * as SMS from "expo-sms";
import * as MailComposer from "expo-mail-composer";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const ThirdScreen = (props) => {
  const [isModalVisibleChat, setIsModalVisibleChat] = useState(false);
  const [isModalVisibleText, setIsModalVisibleText] = useState(false);
  const [isModalVisibleLocation, setIsModalVisibleLocation] = useState(false);
  const [isAddPictureVisible, setIsAddPictureVisible] = useState(false);
  const { userName } = props.route.params;
  [message, setMessage] = useState();
  [subject, setSubject] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [dataForDatabase, setDataForDatabase] = useState({});
  const [dataFromDatabase, setDataFromDatabase] = useState("");
  const [saveOrUpdateText, setSaveOrUpdateText] = useState("Save");
  const [successMessage, setSuccessMessage] = useState("");
  const [messageForFile, setMessageForFile] = useState("");
  const [watchLocation, setWatchLocation] = useState();
  const [currentLocation, setCurrentLocation] = useState();
  const [isFetching, setIsFetching] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [SqlDataPass, setSqlDataPass] = useState("");
  const [noteFromDatabase, setNoteFromDatabase] = useState([]);
  const [messageFromFile, setMessageFromFile] = useState(
    "-- FILE HAS NOT BEEN READ YET! --"
  );
  [documentDirectoryContents, setdocumentDirectoryContents] = useState(
    "CLICK REFRESH FOR CONTENTS"
  );

  const db = SQLite.openDatabase("myTestDB");

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS ExampleTable (id INTEGER PRIMARY KEY NOT NULL, imageURI TEXT, messageSubject TEXT, messageBody TEXT, noteTitle TEXT, noteBody TEXT);",
        [],
        () => console.log("TABLE CREATED!"),
        (_, result) => console.log("TABLE CREATE failed:" + result)
      );
    });
    retrieveFromDatabase();
  }, []);

  saveToFile = () => {
    const filePath = FileSystem.documentDirectory + "MyNewTextFile.txt";
    FileSystem.writeAsStringAsync(filePath, dataFromDatabase, {})
      .then(() => {
        console.log("File was written!");
      })
      .catch((error) => {
        console.log("An error occurred: ");
        console.log(error);
      });
  };

  readFromFile = () => {
    const filePath = FileSystem.documentDirectory + "MyNewTextFile.txt";
    FileSystem.readAsStringAsync(filePath, {})
      .then((result) => {
        setMessageFromFile(result);
      })
      .catch((error) => {
        console.log("An error occurred: ");
        console.log(error);
      });
  };

  getDocumentDirectoryContents = () => {
    const uri = FileSystem.documentDirectory;
    FileSystem.readDirectoryAsync(uri)
      .then((results) => {
        contentsString = "";

        results.forEach(function (value, index) {
          contentsString += `[${index}] = ${value} \n`;
        });

        setdocumentDirectoryContents(contentsString);
      })
      .catch((error) => {
        console.log("An error occurred: ");
        console.log(error);
      });
  };

  onImageUriChangeHandler = (value) => {
    setDataForDatabase((prevState) => ({ ...prevState, imageURI: value }));
    setSelectedImage(value);
  };

  onMessageSubjectChangeHandler = (value) => {
    setDataForDatabase((prevState) => ({
      ...prevState,
      messageSubject: value,
    }));
    setSubject(value);
  };
  onMessageBodyChangeHandler = (value) => {
    setDataForDatabase((prevState) => ({ ...prevState, messageBody: value }));
    setMessage(value);
  };
  onNoteTitleChangeHandler = (value) => {
    setDataForDatabase((prevState) => ({ ...prevState, noteTitle: value }));
  };
  onNoteBodyChangeHandler = (value) => {
    setDataForDatabase((prevState) => ({ ...prevState, noteBody: value }));
  };

  onChangeMessageHandler = (value) => {
    setMessage(value);
  };
  onChangeSubjectHandler = (value) => {
    setSubject(value);
  };

  const handleCameraIconClick = () => {
    setIsAddPictureVisible((prevState) => !prevState);
  };

  saveToDatabase = async () => {
    // transaction(callback, error, success)
    const fileName = selectedImage.split("/").pop();
    const newURI = FileSystem.documentDirectory + fileName;
    try {
      await FileSystem.moveAsync({ from: selectedImage, to: newURI });
    } catch (error) {
      console.log("image url error");
      throw error;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO ExampleTable (imageURI, messageSubject, messageBody, noteTitle, noteBody) values (?, ?, ?, ?, ?)",
        [
          newURI,
          dataForDatabase.messageSubject,
          dataForDatabase.messageBody,
          dataForDatabase.noteTitle,
          dataForDatabase.noteBody,
        ],
        (_, { rowsAffected }) =>
          rowsAffected > 0
            ? console.log("ROW INSERTED!")
            : console.log("INSERT FAILED!"),
        (_, result) => console.log("INSERT failed:" + result)
      );
    });

    retrieveFromDatabase();
    saveToFile();
    readFromFile();
  };

  deleteOnDatabase = () => {
    // transaction(callback, error, success)
    db.transaction((tx) => {
      // executeSql(sqlStatement, arguments, success, error)
      tx.executeSql(
        "DELETE FROM ExampleTable  WHERE id = ?",
        [1],
        (_, { rowsAffected }) =>
          rowsAffected > 0
            ? console.log("ROW INSERTED!")
            : console.log("INSERT FAILED!"),
        (_, result) => console.log("INSERT failed:" + result)
      );
    });

    retrieveFromDatabase();
    saveToFile();
    readFromFile();
  };

  retrieveFromDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM ExampleTable",
        [],
        (_, { rows }) => {
          console.log("ROWS RETRIEVED!");

          // clear data currently stored
          setDataFromDatabase("");

          let entries = rows._array;
          entries.forEach((entry) => {
            setDataFromDatabase(
              (prev) =>
                prev +
                `${entry.id}, ${entry.imageURI}, ${entry.messageSubject}, ${entry.messageBody} , ${entry.noteTitle}, ${entry.noteBody}\n`
            );
            let arrayNote = noteFromDatabase;
            arrayNote.push({
              title: entry.noteTitle,
              body: entry.noteBody,
            });
            setNoteFromDatabase(arrayNote);
            // console.log(dataFromDatabase);
          });
        },
        (_, result) => {
          console.log("SELECT failed!");
          console.log(result);
        }
      );
    });
  };

  sendMessageWithSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        ["3213213214", "1231231234"],
        subject + " \n" + message
      );
      console.log(result);
    } else {
      console.log("SMS is not available on this device");
    }
  };

  sendMessageWithEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();

    if (isAvailable) {
      var options = {
        recipients: ["matthewtanner91@gmail.com"],
        subject: subject,
        body: message,
      };

      MailComposer.composeAsync(options).then((result) => {
        console.log(result.status);
      });
    } else {
      console.log("Email is not available on this device");
    }
  };

  AlertDatabaseContent = () => {
    Alert.alert("Data from database", `${dataFromDatabase}`);
  };

  const hasLocationPermissions = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location services are not enabled! You need to enable them to use this app!"
      );
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    setIsFetching(true);

    if (await hasLocationPermissions()) {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setCurrentLocation(location);
    }

    setIsFetching(false);
  };

  const startWatchingPosition = async () => {
    if (await hasLocationPermissions()) {
      this.watchReference = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 100,
          distanceInterval: 0,
        },
        (location) => {
          setWatchLocation(location);
          setButtonDisabled(false);
        }
      );
    }
  };

  const stopWatchingPosition = () => {
    if (this.watchReference) {
      this.watchReference.remove();
      setWatchLocation();
      setButtonDisabled(true);
    }
  };

  const navigateToFourthScreen = (noteTitle, noteBody) => {
    props.navigation.navigate("ScreenFour", {
      noteTitle: noteTitle,
      noteBody: noteBody,
    });
  };

  const [noteTitle, setTitle] = useState();
  const [noteBody, setBody] = useState();
  const noteTitleInputHandler = (value) => {
    setTitle(value);
  };

  const noteBodyInputHandler = (value) => {
    setBody(value);
  };
  const addNoteHandler = () => {
    props.onAddItem({ title: noteTitle, body: noteBody });
    setName("");
    setValue("");
  };

  return (
    <ImageBackground
      source={require("../assets/background2.jpg")}
      style={styles.backgroundImage}
    >
      <ScrollView>
        <Text style={styles.namePass}>Welcome {userName}! Enjoy!</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.icon}>
            <Entypo
              name="chat"
              size={30}
              color="white"
              onPress={() => setIsModalVisibleChat(true)}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Entypo
              name="location"
              size={30}
              color="white"
              onPress={() => setIsModalVisibleLocation(true)}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={handleCameraIconClick}>
            <AntDesign name="camera" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <AntDesign
              name="filetext1"
              size={30}
              color="white"
              onPress={() => setIsModalVisibleText(true)}
            />
          </TouchableOpacity>
        </View>
        {isAddPictureVisible && (
          <View style={styles.form}>
            <Text style={styles.cameraText}>Add Image Here: </Text>
            <View>
              <ImageSelector
                onImageUriChange={onImageUriChangeHandler}
                value={dataForDatabase.imageURI}
              />
            </View>
          </View>
        )}
        <View style={styles.SQLSaveButton}>
          <Button
            color="black"
            title="Save the Information"
            onPress={saveToDatabase}
          />
        </View>
        {/* <Button title="Delete" onPress={deleteOnDatabase}></Button> */}

        <View style={styles.SQLSaveButton}>
          <Button
            color="black"
            title="View All Data"
            onPress={AlertDatabaseContent}
          />
        </View>

        <Modal
          visible={isModalVisibleChat}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.inputContainer}>
            <View>
              <TextInput
                value={dataForDatabase.messageSubject}
                style={styles.inputTitle}
                multiline
                // onChangeText={onChangeSubjectHandler}
                onChangeText={onMessageSubjectChangeHandler}
                placeholder="Subject"
                placeholderTextColor="#49494c"
              />
              <TextInput
                value={dataForDatabase.messageBody}
                placeholder="Message Body...."
                style={styles.inputMessageBody}
                multiline={true}
                placeholderTextColor="#49494c"
                onChangeText={onMessageBodyChangeHandler}
              />
            </View>

            <View style={styles.SmsEmailContainer}>
              <TouchableOpacity
                style={styles.modalButtonIcon}
                onPress={sendMessageWithEmail}
              >
                <MaterialCommunityIcons
                  name="email-open-multiple"
                  size={30}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonIcon}
                onPress={sendMessageWithSMS}
              >
                <Entypo name="message" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.textModalButton}
              onPress={() => setIsModalVisibleChat(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          visible={isModalVisibleText}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.inputContainer}>
            <TextInput
              value={dataForDatabase.noteTitle}
              placeholder="Title"
              style={styles.inputTitle}
              placeholderTextColor="#49494c"
              onChangeText={onNoteTitleChangeHandler}
            />
            <TextInput
              value={dataForDatabase.noteBody}
              onChangeText={onNoteBodyChangeHandler}
              placeholder="Note Body...."
              style={styles.inputBody}
              multiline={true}
              placeholderTextColor="#49494c"
            />

            <TouchableOpacity
              style={styles.textModalButton}
              onPress={() => {
                props.navigation.navigate("ScreenFour", {
                  notes: noteFromDatabase,
                  userName,
                });
                setIsModalVisibleText(false);
              }}
            >
              <Text style={styles.modalButtonText}>View Notes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textModalButton}
              onPress={() => setIsModalVisibleText(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          visible={isModalVisibleLocation}
          animationType="slide"
          transparent={true}
        >
          <ScrollView>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.textModalButton}
                onPress={getCurrentLocation}
              >
                <Text style={styles.modalButtonText}>Get Current Location</Text>
              </TouchableOpacity>

              <View style={styles.mapStyle}>
                {isFetching ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <Text style={styles.json}>
                    {JSON.stringify(currentLocation, null, 2)}
                  </Text>
                )}
              </View>

              <View style={styles.form}>
                <View style={styles.watchLocation}>
                  <Text style={styles.watchLocationText}>Watch Location!</Text>
                </View>

                {!buttonDisabled && (
                  <View style={styles.mapStyle}>
                    <Text style={styles.json}>
                      {JSON.stringify(watchLocation, null, 2)}
                    </Text>
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.modalButtonIcon}
                    disabled={!buttonDisabled}
                    onPress={startWatchingPosition}
                  >
                    <Text style={styles.modalButtonText}>Start</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalButtonIcon}
                    title="Stop Watching Location"
                    disabled={buttonDisabled}
                    onPress={stopWatchingPosition}
                  >
                    <Text style={styles.modalButtonText}>Stop</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.textModalButton}
                onPress={() => setIsModalVisibleLocation(false)}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>

        <View>
          {/* <Text style={styles.dbOutput}>{dataFromDatabase}</Text> */}
          {/* <Text style={styles.dbOutput}>{messageFromFile}</Text> */}
        </View>
        {/* <View>
        <Text
          style={styles.dbOutput}
          value={dataFromDatabase}
          onChangeText={(SqlDataPassVal) => setSqlDataPass(SqlDataPassVal)}
        ></Text>
      </View> */}
      </ScrollView>
    </ImageBackground>
  );
};

export default ThirdScreen;

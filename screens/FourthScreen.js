import React from "react";
import {
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { styles } from "../styles/styles";
import NoteItem from "../components/NotesList";

const FourthScreen = (props) => {
  const { notes } = props.route.params ? props.route.params : {};
  const { userName } = props.route.params ? props.route.params : {};

  return (
    <ImageBackground
      source={require("../assets/background1.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.form}>
        <Text style={styles.label}>All User Notes</Text>
        <FlatList
          data={notes}
          renderItem={({ item }) => (
            <NoteItem id={item.key} title={item.title} body={item.body} />
          )}
        />
        <TouchableOpacity
          style={styles.textModalButton}
          onPress={() => {
            props.navigation.navigate("ScreenThree", { userName });
          }}
        >
          <Text style={styles.modalButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default FourthScreen;

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { styles } from "../styles/styles";

const NoteItem = ({ id, title, body }) => {
  const showNote = () => {
    Alert.alert(title, body);
  };
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={showNote}>
      <View style={styles.listItem}>
        <Text style={styles.NoteLabel}>Title: {title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NoteItem;

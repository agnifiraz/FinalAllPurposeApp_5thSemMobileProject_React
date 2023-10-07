import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import FirstScreen from "../screens/FirstScreen";
import SecondScreen from "../screens/SecondScreen";
import ThirdScreen from "../screens/ThirdScreen";
import FourthScreen from "../screens/FourthScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        headerMode="screen"
        screenOptions={{
          headerTintColor: Platform.OS === "android" ? "white" : "blue",
          headerStyle: {
            backgroundColor: Platform.OS === "android" ? "#18181c" : "",
          },
        }}
      >
        <Stack.Screen
          name="ScreenOne"
          component={FirstScreen}
          options={{
            title: "Welcome page",
          }}
        />
        <Stack.Screen
          name="ScreenTwo"
          component={SecondScreen}
          options={{
            title: "About",
          }}
        />
        <Stack.Screen
          name="ScreenThree"
          component={ThirdScreen}
          options={({ route }) => ({
            title: "Save Screen",
            userName: route.params.userName,
          })}
        />
        <Stack.Screen
          name="ScreenFour"
          component={FourthScreen}
          options={({ route }) => ({
            title: "Note",
            SqlDataPass: route.params.SqlDataPass,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

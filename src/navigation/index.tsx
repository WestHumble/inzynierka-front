import React, {useContext, useEffect} from "react";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import {View, Text, Platform, ActivityIndicator} from "react-native";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import ConfirmEmailScreen from "../screens/ConfirmEmailScreen";
import SearchEventsScreen from "../screens/SearchEventsScreen";
import AddEventScreen from "../screens/AddEventScreen";
import {ApiContext} from "../context/ApiContext";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import {AuthContext} from "../context/AuthContext";

const Tab = createBottomTabNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: "5%",
    right: "3%",
    left: "3%",
    paddingBottom: 0,
    paddingTop: 0,
    height: "10%",
    margin: 0,
    backgroundColor: "#1D1F24",
    borderRadius: 20,
    borderTopWidth: 0,
    borderTopColor: "transparent",
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
    transform: [
      {
        translateY: 0,
      },
      {
        scale: 1,
      },
    ],
  },
};

const screenOptionsLoggedOut = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarVisible: false,
    tabBarStyle: {
        height: "0%",
        margin: 0,
        backgroundColor: "#1D1F24",
        borderRadius: 20,
        borderTopWidth: 0,
        borderTopColor: "transparent",
    },
};


const TabNavScreen = () => {
  const {userToken} = useContext(ApiContext)

  return userToken ? (<TabsLoggedIn />):(<TabsLoggedOut />);
};
const TabsLoggedIn = () => {
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Feather
                                    name="home"
                                    size={24}
                                    color={focused ? "#F2B138" : "#676D75"}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: focused ? "#F2B138" : "#676D75",
                                    }}
                                >
                                    Home
                                </Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="SearchEvents"
                component={SearchEventsScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                    name="search-outline"
                                    size={24}
                                    color={focused ? "#F2B138" : "#676D75"}
                                />

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: focused ? "#F2B138" : "#676D75",
                                    }}
                                >
                                    Wyszukaj
                                </Text>
                            </View>
                        );
                    },
                }}
            />

            <Tab.Screen
                name="ConfirmEmail"
                component={ConfirmEmailScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                    name="chatbox-outline"
                                    size={24}
                                    color={focused ? "#F2B138" : "#676D75"}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: focused ? "#F2B138" : "#676D75",
                                    }}
                                >
                                    Chat
                                </Text>
                            </View>
                        );
                    },
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate("ConfirmEmail");
                    },
                })}
            />
            <Tab.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                    name="person-outline"
                                    size={24}
                                    color={focused ? "#F2B138" : "#676D75"}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: focused ? "#F2B138" : "#676D75",
                                    }}
                                >
                                    Profil
                                </Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="AddEvent"
                component={AddEventScreen}
                options={{
                    tabBarButton: () => null,
                }}
            />
        </Tab.Navigator>
    )
}
const TabsLoggedOut = () => {
    return (<Tab.Navigator screenOptions={screenOptionsLoggedOut}>
        <Tab.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
                tabBarButton: () => null,
            }}
        />
        <Tab.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
                tabBarButton: () => null,
            }}
        />
        <Tab.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{
                tabBarButton: () => null,
            }}
        />
        <Tab.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
                tabBarButton: () => null,
            }}
        />
        <Tab.Screen
            name="ConfirmEmail"
            component={ConfirmEmailScreen}
            options={{
                tabBarButton: () => null,
            }}
            listeners={({ navigation }) => ({
                tabPress: (e) => {
                    e.preventDefault();
                    navigation.navigate("ConfirmEmail");
                },
            })}
        />
    </Tab.Navigator>)
}
const Navigation = () => {

  const {isLoading} = useContext(AuthContext)

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size={"large"} />
            </View>
        );
    }
  return (
    <NavigationContainer>
      <TabNavScreen />
    </NavigationContainer>
  );
};

export default Navigation;

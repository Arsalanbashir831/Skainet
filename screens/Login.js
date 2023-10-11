import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import axios from "axios";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post("https://api.skainet.ai/auth/login", {
        email: email,
        password: password,
      });
      const authToken = response.data.token;

      await AsyncStorage.setItem("authToken", authToken);
      setLoading(false);
      setErr("");
      navigation.reset({ index: 0, routes: [{ name: "ChatList" }] });
    } catch (error) {
      setErr("Invalid Login Credentials! Try Again");
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        height: "100%",
      }}
      source={require("../assets/wallpaper.png")}
    >
      {loading && ( // Conditional rendering for loading overlay
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex:10,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          }}
        >
          <ActivityIndicator  size="large" color="white" />
        </View>
      )}
      <View
        className="w-[100%]"
        style={{ alignItems: "center", alignContent: "center" }}
      >
        <LinearGradient
          className="w-[90%] rounded-md shadow-sm  "
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={["#171717CC", "#1D1E24"]}
        >
          <View className=" w-[100%] rounded-md p-5 ">
            <Logo />
            <Text
              style={{ opacity: 0.6 }}
              className="text-center text-[#D7D7D7] mt-10 mb-10"
            >
              Login to Your Account
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                borderWidth: 1,
                borderColor: "rgba(152, 152, 159, 0.20)",
                color: "white",
              }}
              className="bg-[#1D1D1F] text-white rounded-sm m-2 p-2 pl-5 "
              placeholderTextColor="#D7D7D7"
              placeholder="Enter Email"
            ></TextInput>

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{
                borderWidth: 1,
                borderColor: "rgba(152, 152, 159, 0.20)",
                color: "white",
              }}
              className="bg-[#1D1D1F] text-white rounded-sm mb-2 ml-2 mr-2 p-2 pl-5 "
              secureTextEntry={true}
              placeholderTextColor="#D7D7D7"
              placeholder="Enter Password"
            ></TextInput>

            <TouchableOpacity
              onPress={handleLogin}
              className=" rounded-md m-5  w-[50%] self-center "
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={["#3f5efb", "#fc466b"]}
              >
                <Text className="text-center text-white font-bold text-xl  p-2 ">
                  Login
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity className=" rounded-md m-5  w-[60%] self-center  ">
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={["#3f5efb", "#fc466b"]}
              >
                <View className="flex justify-center items-center flex-row gap-2 ">
                  <Text className="text-center text-white font-bold text-lg  p-2  ">
                    Login via Gmail
                  </Text>
                  <Image
                    className="w-7 h-7  rounded-full"
                    source={require("../assets/googleLogo.png")}
                  ></Image>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <Text className="text-red-600 text-center font-bold text-lg">
              {Err}
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignUp");
              }}
            >
              <Text className="text-white text-center font-bold text-sm">
                Create New Account
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </ImageBackground>
  );
};

export default Login;

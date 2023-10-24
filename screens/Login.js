import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
// import { Feather } from '@expo/vector-icons'; 
// import { Entypo } from '@expo/vector-icons';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setShowPassword] = useState(false);

  const handleShowPass = () => {
    setShowPassword(!isShowPassword);
  };
  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post("https://api.ilmoirfan.com/auth/login", {
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
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            zIndex: 10,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <View style={{ width: "100%", alignItems: "center" }}>
        <LinearGradient
          style={{ width: "90%", borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={["#171717CC", "#1D1E24"]}
        >
          <View style={{ width: "100%", borderRadius: 10, padding: 20 }}>
            <Logo />
            <Text style={{ opacity: 0.6, color: "#D7D7D7", textAlign: "center", marginTop: 20, marginBottom: 20 }}>
              Login to Your Account
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                borderWidth: 1,
                borderColor: "rgba(152, 152, 159, 0.20)",
                color: "white",
                backgroundColor: "#1D1D1F",
                borderRadius: 5,
                margin: 2,
                padding: 10,
                paddingLeft: 15,
                width: "100%",
              }}
              placeholder="Enter Email"
              placeholderTextColor="#D7D7D7"
            />
            <View style={{ position: "relative" }}>
           
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(152, 152, 159, 0.20)",
                  color: "white",
                  backgroundColor: "#1D1D1F",
                  borderRadius: 5,
                  margin: 2,
                  padding: 10,
                  paddingLeft: 15,
                  width: "100%",
                }}
                secureTextEntry={!isShowPassword}
                placeholder="Enter Password"
                placeholderTextColor="#D7D7D7"
              />
              <TouchableOpacity
                style={{ position: "absolute", top: 15, right: 15 }}
                onPress={handleShowPass}
              >
                <AntDesign name={isShowPassword ? "eye" : "eyeo"} size={24} color="white" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              style={{
                borderRadius: 10,
                margin: 10,
                alignSelf: "center",
                width: "50%",
                marginTop:15
              }}
            >
              <LinearGradient
                style={{ borderRadius: 10 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={["#8222CD", "#1B69DD"]}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 20,
                    padding: 10,
                  }}
                >
                  Login
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={{ borderRadius: 10, margin: 10, alignSelf: "center", width: "60%" }}>
              <LinearGradient
                style={{ borderRadius: 10 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={["#212120", "#212120"]}
              >
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                  <Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 10 }}>Google</Text>
                  <Image style={{ width: 20, height: 20, borderRadius: 50 }} source={require("../assets/googleLogo.png")} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={{ color: "red", textAlign: "center", fontWeight: "bold", fontSize: 18 }}>{Err}</Text>
            <TouchableOpacity onPress={() => { navigation.navigate("SignUp"); }}>
              <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </ImageBackground>
  );
};

export default Login;

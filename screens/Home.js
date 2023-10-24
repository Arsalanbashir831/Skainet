import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import Logo from "../components/Logo";

const Home = () => {
  const navigation = useNavigation();
  
  return (
    <>
      <ImageBackground
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
        source={require("../assets/wallpaper.png")}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            maxHeight: "30%",
          }}
        >
          <Logo />
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "20%",
            paddingLeft: '2%',
            paddingRight: '2%',
          }}
        >
          <Text style={{ fontSize: 25, color: 'white', textAlign: 'center' }} className="text-3xl antialiased">
            The Future of Connection. AI-Powered Chat for Family, Friends, and Co-workers.
          </Text>
          <View style={{ backgroundColor: 'white', width: 50, height: 2, marginTop: 10, marginBottom: 10 }}></View>
          <TouchableOpacity onPress={() => { navigation.navigate('Login') }} style={{ borderRadius: 10, margin: 20, width: '70%', alignSelf: 'center' }}>
            <LinearGradient
              style={{ borderRadius: 20, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, width: 200 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={["#1B69DD", "#8222CD"]}
            >
              <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, padding: 5, paddingLeft: 40, paddingRight: 40 }}>
                Continue
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

export default Home;

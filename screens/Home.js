import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ImageBackground,TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import Logo from "../components/Logo";
export default Home = () => {

  const navigation = useNavigation();
  return (
    <>
      <ImageBackground
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "102%",
        }}
        source={require("../assets/wallpaper.png")}
      >
        <View
          className="flex-1 items-center justify-top "
          style={{ maxHeight: "30%" }}
        >
          <Logo />
        </View>

        <View
          className="flex-1 items-center justify "
          style={{ maxHeight: "20%", alignContent : 'center', paddingLeft :'2%', paddingRight : '2%' }}
        >
          <Text
            style={{ paddingLeft: "10%", paddingRight: "10%" ,  alignSelf :'center', textAlign :'center'}}
            className="text-3xl antialiased text-white"
          >
            {" "}
            Easily Connect with your family, friends and work through skainet{" "}
          </Text>
          <TouchableOpacity onPress={()=>{navigation.navigate('Login')}} className=" rounded-md m-5  w-[50%] self-center ">
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={["#3f5efb", "#fc466b"]}
            >
              <Text className="text-center text-white font-bold text-xl  p-2 pl-4 pr-4">
                Get Started
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

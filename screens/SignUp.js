import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from 'axios';
import Logo from "../components/Logo";

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false); // Added loading state

  const handleSignUp = async () => {
    if (confirmPassword === password) {
      try {
        setLoading(true); // Start loading animation

        const response = await axios.post(
          'https://api.skainet.ai/auth/email-signup',
          {
            email: email,
            first_name: firstName,
            last_name: lastName,
            password: password,
          }
        );

        if (response.status === 200) {
          setEmail('');
          setFirstName('');
          setLastName('');
          setPassword('');
          setConfirmPassword('');
          setError('');
          setIsButtonDisabled(false);
          navigation.navigate('OTP',{email:email});
        } else {
          setError('Error in Creating your Account');
        }
      } catch (error) {
        setError('Error in Creating your Account');
        console.error('SignUp failed:', error);
      } finally {
        setLoading(false); // Stop loading animation
      }
    } else {
      setError("Password doesn't match with Confirm Password");
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsButtonDisabled(text !== confirmPassword);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setIsButtonDisabled(text !== password);
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
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <View className="w-[100%]" style={{ alignItems: 'center', alignContent: 'center' }}>
        <LinearGradient
          className="w-[90%] rounded-md shadow-sm  "
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={["#171717CC", "#1D1E24"]}
        >
          <View className=" w-[100%] rounded-md p-5 ">
          <Logo></Logo>
            <Text
              style={{ opacity: 0.6 }}
              className="text-center text-[#D7D7D7] mt-10 mb-10"
            >
              SignUp to Your Account
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
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              style={{
                borderWidth: 1,
                borderColor: "rgba(152, 152, 159, 0.20)",
                color: "white",
              }}
              className="bg-[#1D1D1F] text-white rounded-sm m-2 p-2 pl-5 "
              placeholderTextColor="#D7D7D7"
              placeholder="Enter First Name"
            ></TextInput>
            <TextInput
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              style={{
                borderWidth: 1,
                borderColor: "rgba(152, 152, 159, 0.20)",
                color: "white",
              }}
              className="bg-[#1D1D1F] text-white rounded-sm m-2 p-2 pl-5 "
              placeholderTextColor="#D7D7D7"
              placeholder="Enter Last Name"
            ></TextInput>
            <TextInput
              value={password}
              onChangeText={handlePasswordChange}
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
            <TextInput
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              style={{
                borderWidth: 1,
                borderColor: "rgba(152, 152, 159, 0.20)",
                color: "white",
              }}
              className="bg-[#1D1D1F] text-white rounded-sm mb-2 ml-2 mr-2 p-2 pl-5 "
              secureTextEntry={true}
              placeholderTextColor="#D7D7D7"
              placeholder="Enter Confirm Password"
            ></TextInput>
    
<TouchableOpacity
  onPress={handleSignUp}
  className=" rounded-md m-5 w-[50%] self-center"
  style={
    {
      backgroundColor: isButtonDisabled
        ? "#888899" // Gray background when disabled
        : "transparent", // Transparent background when enabled
    }}
  disabled={isButtonDisabled}
>
  {isButtonDisabled ? (
    <Text className="text-center text-white font-bold text-xl p-2">
      SignUp
    </Text>
  ) : (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#3f5efb", "#fc466b"]}
    >
      <Text className="text-center text-white font-bold text-xl p-2 " >
        SignUp
      </Text>
    </LinearGradient>
  )}
</TouchableOpacity>
           
            <Text className="text-red-600 text-center font-bold text-lg">{error}</Text>
            <TouchableOpacity onPress={()=>{navigation.navigate("Login")}}>
                <Text className='text-center text-white underline'>Already have an account</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </ImageBackground>
  );
};

export default SignUp;

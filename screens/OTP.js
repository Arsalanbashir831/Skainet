import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../components/Logo';
import axios from 'axios';


const OTP = ({ navigation ,route}) => {
  const {email} = route.params
  const [otp, setOTP] = useState(['', '', '', '', '', '']); // Array to store OTP digits
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]; 
  const [Err,setError] = useState("")

  const handleOTPChange = (index, value) => {
  
    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOTP(updatedOTP);

    if (index < inputRefs.length - 1 && value !== '') {
      inputRefs[index + 1].current.focus();
    }
  };
  const confirmOTP = async () => {
    const fullOTP = otp.join('');

    try {
      const response = await axios.post(
        'https://api.ilmoirfan.com/auth/code-verification',
        {
          email: email, 
          code: fullOTP, 
        }
      );
      if (response.status === 200) {

        setError('');
        navigation.navigate('Login');
       
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      setError('Error in Verification');
      console.error('Verification failed:', error);
    }
  }
  

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <ImageBackground
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 'auto',
        }}
        source={require('../assets/wallpaper.png')}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LinearGradient
            style={{
              width: '90%',
              height: '60%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              minHeight: '50%',
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#171717CC', '#1D1E24']}
          >
            <View style={{ minHeight: '50%' }}>
              <Logo />
              <Text
                style={{
                  opacity: 0.6,
                  textAlign: 'center',
                  color: '#D7D7D7',
                  fontSize: 16,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                Enter the 6 Digits pin sent to you
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={inputRefs[index]}
                    maxLength={1}
                    value={digit}
                    onChangeText={(value) => handleOTPChange(index, value)}
                    style={{
                      width: '15%',
                      borderWidth: 1,
                      borderColor: 'white',
                      color: 'white',
                      borderRadius: 5,
                      textAlign: 'center',
                      fontSize: 18,
                      marginBottom: 10,
                      height:40
                    }}
                    keyboardType="numeric"
                  />
                ))}
              </View>
              <TouchableOpacity onPress={confirmOTP} style={{ marginTop: 20 }}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  colors={['#3f5efb', '#fc466b']}
                >
                  <Text
                    style={{
                      color: 'white',
                      padding: 10,
                      textAlign: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}
                  >
                    Confirm
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text>{Err}</Text>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ScrollView>
  );
};

export default OTP;

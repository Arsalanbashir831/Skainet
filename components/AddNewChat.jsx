import React, { useState } from 'react';
import { View, Text, ImageBackground, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator,Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; 
import { Platform } from 'react-native';

const AddNewChat = ({ userId }) => {
  
  const [title, setTitle] = useState('');
  const [socketData, setSocketData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChat = () => {
    setIsLoading(true); // Set loading to true while creating chat

    const ws = new WebSocket("wss://api.ilmoirfan.com/ws/chat/abc/");
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          command: "start_chat",
          text: title,
          sender: userId
        })
      );
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setSocketData(response.message);
      setIsLoading(false); // Set loading to false when chat is created
      setTitle("")
    //  navigation.navigate('ChatList')
    
    };

    ws.onclose = () => {
      // Handle WebSocket close
    };

    ws.onerror = () => {
      // Handle WebSocket error
      setIsLoading(false); // Set loading to false in case of an error
    };

    return () => {
      ws.close();
    };
  }

  return (
   
    <View  style={styles.container}>
      <LinearGradient colors={['#1D1D1F', '#1D1D1F']} style={styles.inputContainer}>
        <TouchableOpacity  style={styles.iconContainer}>
          <Text className='border-r border-[#98989F] rounded-md' style={styles.iconText}><Image source={require("../assets/tag.png")}></Image></Text>
        </TouchableOpacity>
        <TextInput
          placeholder='Send a message'
          style={styles.input}
          onChangeText={(text) => { setTitle(text) }}
          placeholderTextColor={'#DEDEDE80'}
          value={title}
        />
      </LinearGradient>
      <TouchableOpacity onPress={handleCreateChat} style={styles.createButton}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Feather name="send" size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
    
   
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding:10
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 8,
  },
  iconContainer: {
    paddingHorizontal: 5,
  },
  iconText: {
    color: 'purple',
    
    fontSize: 20,
    fontWeight: 'bold',
   padding:9,
   
   paddingHorizontal:15,
   position:'absolute',
   top:-20,left:-10
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingHorizontal: 50,
  },
  createButton: {
    backgroundColor: 'rgba(41, 41, 46, 1)',
    padding: 10,
    marginLeft: 10,
    borderRadius: 25,
  },
});

export default AddNewChat;

import React, { useState } from 'react';
import { View, Text, ImageBackground, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const NewChat = ({ navigation, route }) => {
  const { userId } = route.params;
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
     navigation.navigate('ChatList')
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
    <ImageBackground
      source={require("../assets/chatwall.png")}
      style={styles.container}
    >
      <Text style={styles.title}>Add New Chat</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Enter the Title of Chat'
          style={styles.input}
          onChangeText={(text) => { setTitle(text) }}
        />
      </View>
      <TouchableOpacity onPress={handleCreateChat} style={styles.createButton}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.createButtonText}>Create Chat</Text>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  inputContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  input: {
    width: '100%',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: 'black',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NewChat;

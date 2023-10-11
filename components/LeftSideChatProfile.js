import React from "react";
import { View, Text, Image, StyleSheet } from 'react-native';

export default LeftSideChatProfile = ({ lastText, img, type }) => {


  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 15 }}>
      
      {type === 'bot' ? (
        // Render this block if 'type' is 'bot'
        <>
          <Image style={{ width: "13%", height: 50 }} source={require('../assets/ball.png')} />
          <View style={styles.containerBot}>
            <Text style={{ color: 'white' }}>{lastText}</Text>
          </View>
        </>
      ) : (
        // Render this block if 'type' is not 'bot'
        <>
          <Image style={{ width: "13%", height: 50,borderRadius:30 }} source={{ uri: img }} />
          <View style={styles.containerDefault}>
            <Text style={{ color: 'white' }}>{lastText}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerDefault: {
    padding: 10,
    backgroundColor: '#5F6368', // Default background color
    borderColor: '#5F6368',
    borderWidth: 2,
    maxWidth: '70%',
    minHeight: '5%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomEndRadius: 10,
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  containerBot: {
    padding: 10,
    backgroundColor: 'black', // Background color for 'bot' type
    borderColor: 'black', // You can customize this color
    borderWidth: 2,
    maxWidth: '70%',
    minHeight: '5%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomEndRadius: 10,
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
});

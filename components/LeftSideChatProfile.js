import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, Image, StyleSheet } from 'react-native';

export default LeftSideChatProfile = ({ lastText, img, type }) => {


  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 15 }}>
      
      {type === 'bot' ? (
        // Render this block if 'type' is 'bot'
        <>
          <Image style={{ width: "13%", height: 50 }} source={require('../assets/ball.png')} />
          {/* <View style={styles.containerBot}> */}
          <LinearGradient
         style={styles.containerBot}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={["#8222CD", "#1B69DD"]}
        >
            <Text style={{ color: 'white' }}>{lastText}</Text>
        </LinearGradient>
          {/* </View> */}
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
    backgroundColor: '#3D3F47', // Default background color
    borderColor: '#3D3F47',
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
    backgroundColor: '#2979FF', // Background color for 'bot' type
    
    borderWidth: 1,
    maxWidth: '70%',
    minHeight: '5%',
    borderTopRightRadius: 20, // Keep the original value for the right border radius
    borderTopLeftRadius: 10, // Increase the left border radius
    borderBottomRightRadius: 20, // Keep the original value for the right bottom radius
    borderBottomLeftRadius: 0, // Increase the left bottom radius
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  
});

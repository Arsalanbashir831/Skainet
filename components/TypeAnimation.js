import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { TypingAnimation } from "react-native-typing-animation";

export default TypeAnimation = () => {
  return (
    <View style={styles.container}>

      <TypingAnimation
      style={{padding: 10}}
        dotColor="white"
        dotMargin={4}
        dotAmplitude={7}
        dotSpeed={0.20}
        dotRadius={3}
        dotX={12}
        dotY={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "black",
   
  
    maxWidth: "25%",
    minHeight: "2%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomEndRadius: 10,
  },
});

import { View, Text, ImageBackground, Image, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { MaterialIcons } from "@expo/vector-icons";
import HeaderChatBox from '../components/HeaderChatBox';
import FooterChatBox from '../components/FooterChatBox';
import LeftSideChat from '../components/LeftSideChat';
import RightSideChat from '../components/RightSideChat';
const ChatBox = ({ navigation }) => {
  return (
    <ImageBackground source={require("../assets/chatwall.png")} style={{
      height: '100%'
    }}>

      <HeaderChatBox />


      <ScrollView style={{ maxHeight:'75%'}}>
        <View style={{ flex: 1, flexDirection: 'column', gap: 30, paddingTop: 30, paddingLeft: 20, paddingRight: 20 }}>
          <LeftSideChat msg={'Hi how are you ?'} />
          <RightSideChat msg={'Hi ! I am fine '} />
          <RightSideChat  msg={'What about you ?'}/>
          <LeftSideChat msg={'I am doing well'} />
          


         
        </View>
      </ScrollView>

      <FooterChatBox />

    </ImageBackground>
  )
}

export default ChatBox
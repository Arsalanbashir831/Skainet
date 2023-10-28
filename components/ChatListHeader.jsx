import { View, Text,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome5 } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";

const ChatListHeader = () => {
  return (
    <View
    className="flex flex-row justify-between"
    style={{ paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        style={{ width: 40, height: 40 }}
        source={require("../assets/ball.png")}
      />
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        Sk
        <Text style={{ color: "purple" }}>ai</Text>net
      </Text>
    </View>
    <View>
    <TouchableOpacity onPress={()=>{console.log('clicked')}}>
      <View className="border border-white p-2 rounded-3xl ">
        <SimpleLineIcons name="options" size={15} color="white" />
      </View>
    </TouchableOpacity>
    </View>
  </View>
  )
}

export default ChatListHeader
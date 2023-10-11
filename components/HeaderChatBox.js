import { View, Text, ImageBackground, Image, SafeAreaView } from 'react-native'
import React from 'react'
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';


export default HeaderChatBox = ({header,img}) => {
  const navigation = useNavigation();
    return (
    <SafeAreaView style = {{backgroundColor:
            "background: linear-gradient(164deg, rgba(24,24,32,0.8) 0%, rgba(37,37,54,0.2) 96%)",
            height:'auto'
            
            }}>
      <View
        className="w-full pl-4  flex flex-row items-center pb-2 justify-between pr-4"
        style={{
          backgroundColor:
            "background: linear-gradient(164deg, rgba(24,24,32,0.8) 0%, rgba(37,37,54,0.2) 96%)"
        }}
      >
        <View className="flex flex-row justify-start items-center gap-2 pt-2">
          <MaterialIcons onPress={() => { navigation.goBack(null) }} name="arrow-back" size={25} color="white" />
          <View className='flex flex-row items-center'>
            <Image style={{height:40, width: '12%',borderRadius:24}} source={{uri:`${img}`}}></Image>
            <Text className="text-white text-lg pl-3 w-[80%]">{header.slice(0,50)+".."}</Text>
          </View>
        </View>

      </View>
      </SafeAreaView>
    )
}
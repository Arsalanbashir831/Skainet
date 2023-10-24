import { View,Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons'; 

const User = ({username,img,lastText,date,seen}) => {
  return (
      
    <View style={{backgroundColor:'rgba(0,0,0,0.3)'}}>
    
   <View style={{padding:9}}>
   <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
     <View style={{flex:1, flexDirection:'row',alignItems:'center' ,gap:45}}>
     <Image style={{width:40,height:40}} source={{
      uri: `${img}`,
    }} />
      <Text className ='text-white font-bold text-md w-[65%]'>{username.slice(0,36)+".."}</Text>
     </View>
     
      <Text  className='text-white'>{date}</Text>
   </View>
   <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'center' }}>
    
     {/* <View className='flex-1 flex-row justify-center gap-3 ' >
{seen ? <FontAwesome5  name="check-double" size={20} color="#3497F9" /> : <FontAwesome5  name="check-double" size={20} color="gray" />}
   

      <Text className='text-white'>{lastText.slice(0,23)}</Text>
     </View> */}

      <MaterialIcons style={{ }}  name='keyboard-arrow-right' size={24} color={'white'}></MaterialIcons>   
      </View>
   </View>
   <View style={{width:'100%', backgroundColor:'white',height:'0.5%'}}>
    <Text></Text>
   </View>
    </View>
   
  )
}

export default User
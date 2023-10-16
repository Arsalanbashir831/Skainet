import {React,useState,useEffect} from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  FlatList,
  TouchableOpacity, Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import User from "../components/User";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const ChatList = ({ navigation }) => {
  const [userData , setUserData] = useState([])
  const [chatData , setChatData] = useState([])
  const [query, setQuery] = useState('');
const [filteredChatData, setFilteredChatData] = useState([]);
  useEffect(() => {
   
    const fetchUserDetails = async () => {
      const authToken = await AsyncStorage.getItem('authToken');

      const response = await fetch('https://api.ilmoirfan.com/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const chatResponse = await fetch('https://api.ilmoirfan.com/chats/get_user_chats', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      const chatData = await chatResponse.json()
  
     
      setChatData(chatData)
      setUserData(data);
    };
    fetchUserDetails()
  }, [chatData]);
 
  const filterUser = (text) => {
    setQuery(text);
  
    // Filter the chatData based on the search query (matching chat titles)
    const filteredData = chatData.chats.filter((data) =>
      data.title.toLowerCase().includes(text.toLowerCase())
    );
  
    setFilteredChatData(filteredData);
  };
  
  


  return (
    <ImageBackground 
      source={require("../assets/chatwall.png")}
      style={{ height: "100%", width: "100%", flex: 1 }}
    >

    
      <View
        className="w-full pl-4 pt-6 flex flex-row items-center pb-4 justify-between pr-4"
        style={{
          backgroundColor:
            "background: linear-gradient(164deg, rgba(24,24,32,0.6) 0%, rgba(37,37,54,0.2) 96%)",
        }}
      >
        <View className="flex justify-center gap-3 pt-2">
          <Text className=" text-blue-600">Edit</Text>
          <Text className="text-white text-3xl">Chats</Text>
        </View>
        <MaterialIcons name="photo-camera" size={30} color="white" />
      </View>


      <MaterialIcons
        style={{
          position: "absolute",
          top: 133,
          left: 25,
          zIndex: 100,
        }}
        name="search"
        size={30}
        color="white"
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 5,
          backgroundColor:
            "background: linear-gradient(164deg, rgba(24,24,32,1) 0%, rgba(37,37,54,1) 96%)",
          color: "white",
          fontSize: 16,
          paddingHorizontal: 8,
          width: "90%",
          padding: 6,
          alignSelf: "center",
          marginTop: 10,
          marginBottom:10,
          paddingStart: 40,
        }}
        placeholder="Search"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        onChangeText={filterUser}
      />
   
        <FlatList
  data={filteredChatData.length > 0 ? filteredChatData : chatData.chats}

  keyExtractor={(data) => data.title}
  renderItem={({ item, index }) => (
    <>
      <TouchableOpacity
        key={index}
        onPress={() =>
          navigation.navigate('GroupChat', {
            header: item.title,
            img: userData.avatar,
            senderId:userData.id,
            grpId:item.id,
            
          })
        }
      >
        <User
          username={item.title}
          img={userData.avatar}
          lastText={"hi"} 
          seen={false}
        />
      </TouchableOpacity>
    </>
  )}
/>

      <View
        style={{
          backgroundColor:
            "background: linear-gradient(164deg, rgba(24,24,32,0.5) 0%, rgba(37,37,54,1) 96%)",

        }}
        className=" h-15 p-5"
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <FontAwesome5 name="user-alt" size={24} color="white" />
          <TouchableOpacity onPress={()=>{navigation.navigate('NewChat',{
            "userId":userData.id
          })}} style={{
            borderColor: 'white',
            borderWidth: 1,
          }} className='bg-transparent rounded-3xl'>
            <View className='flex flex-row items-center pl-3'>
              <Ionicons name="add-circle" size={24} color="white" />
              <Text className='text-white p-3 pl-5 pr-5 '>
                New Chat  </Text>
            </View>

          </TouchableOpacity>
          <Image style={{width:45 , height: 45}}
    source={{
      uri: `${userData.avatar}`,
    }}
  />
        </View>
      </View>
    </ImageBackground>
    // </View>

  );
};

export default ChatList;

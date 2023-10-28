import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import User from "../components/User";
import { FontAwesome5 } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddNewChat from "../components/AddNewChat";
import ChatListHeader from "../components/ChatListHeader";

const ChatList = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [query, setQuery] = useState("");
  const [secrettoken, setSecretToken] = useState("");
  const [filteredChatData, setFilteredChatData] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const authToken = await AsyncStorage.getItem("authToken");
      setSecretToken(authToken);
      const response = await fetch("https://api.ilmoirfan.com/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const chatResponse = await fetch(
        "https://api.ilmoirfan.com/chats/get_user_chats",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      const chatData = await chatResponse.json();

      setChatData(chatData);
      setUserData(data);
    };
    fetchUserDetails();
  }, [chatData]);

  const filterUser = (text) => {
    setQuery(text);

    const filteredData = chatData.chats.filter((data) =>
      data.title.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredChatData(filteredData);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1C1C1E" }}>
    <ChatListHeader/>
      <View style={{ paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 }}>
        <MaterialIcons
          style={{ position: "absolute", top: 30, left: 30, zIndex: 100 }}
          name="search"
          size={30}
          color="rgba(61, 63, 71, 0.98)"
        />
        <TextInput
          className="pl-14"
          style={{
            borderWidth: 1,
            borderColor: "#1C1C1E",
            borderRadius: 5,
            backgroundColor: "rgba(61, 63, 71, 0.5)",
            color: "white",
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginTop: 10,
          }}
          placeholder="Search"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          onChangeText={filterUser}
        />
      </View>

      <FlatList
        data={filteredChatData.length > 0 ? filteredChatData : chatData.chats}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("GroupChat", {
                header: item.title,
                img: userData.avatar,
                senderId: userData.id,
                grpId: item.id,
                token: secrettoken,
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
        )}
      />

      {/* <View
        style={{
          height: 80,
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "#262948",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FontAwesome5 name="user-alt" size={24} color="white" />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("NewChat", {
              userId: userData.id,
            });
          }}
          style={{
            borderWidth: 1,
            backgroundColor: "#1C1C1E",
            borderRadius: 30,
            borderColor: "white",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../assets/plusIcon.png")}
          />
          <Text style={{ color: "white", paddingLeft: 10 }}>New Chat </Text>
        </TouchableOpacity>
        <Image
          style={{ width: 45, height: 45, borderRadius: 50 }}
          source={{ uri: userData.avatar }}
        />
      </View> */}
      <View className='absolute bottom-10 w-full'>
      <AddNewChat userId ={userData.id}/>
      </View>
    </View>
  );
};

export default ChatList;

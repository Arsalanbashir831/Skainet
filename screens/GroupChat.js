import React, { useState, useEffect, useRef } from "react";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import HeaderChatBox from "../components/HeaderChatBox";
import FooterChatBox from "../components/FooterChatBox";
import LeftSideChatProfile from "../components/LeftSideChatProfile";
import LeftSideImage from "../components/LeftSideImage";
import LeftSidedocx from "../components/LeftSidedocx";
import TypeAnimation from "../components/TypeAnimation";
// import { TypingAnimation } from 'react-native-typing-animation';

const GroupChat = ({ route }) => {
  console.log("hello");
  const { header, img, senderId, grpId } = route.params;
  const [socketData, setSocketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  const [msg, setMsg] = useState("");

  const [sending, setSending] = useState(false);
  const [menu, setMenu] = useState(false);
  const [genType, setGenType] = useState("");
  
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const ws = new WebSocket(`wss://api.ilmoirfan.com/ws/chat/${grpId}/`);

  const index = 0;
  let flag = 0;
  const sendMessage = () => {
   
    // setNewMessage([...newMessage, msg]);
    setLoadingAnimation(true);
    console.log(ws.readyState);
    setSending(false);
    //console.log(ws.readyState);
    //"chat_with_ai"
    if (ws.readyState === 0) {
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            command: genType === "IMAGE" ? "generate_image" : "chat_with_ai",
            chatId: grpId,
            text: msg,
            sender: senderId,
          })
        );
      };
    } else {
      ws.send(
        JSON.stringify({
          command: genType === "IMAGE" ? "generate_image" : "chat_with_ai",
          chatId: grpId,
          text: msg,
          sender: senderId,
        })
      );
    }
  };
  useEffect(() => {
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setLoading(false);

      console.log(response);
      if (response.message === undefined) {
        setSocketData((prevSocketData) => [
          ...prevSocketData,
          ...response.messages,
        ]);
      } else {
        console.log("MEWOOOOOOOOOOOOOOOOOOOOOOOOO");

        console.log(response.message);

        setSocketData((prevSocketData) => [
          ...prevSocketData,
          response.message,
        ]);

        if(response.message.sender !== senderId){
          setLoadingAnimation(false);
        }

        

       
      }

      if (autoScrollEnabled && !isManualScrolling && scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    };
  }, []);

  const data = [];

  // useEffect(()=>{
  //   setNewMessage([...newMessage, sendMessage])
  // }, [sendMessage])
  useEffect(() => {
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          command: "fetch_messages",
          sender: senderId,
          chatId: grpId,
        })
      );
    };
  }, []);

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    const scrollThreshold = 50;

    if (yOffset <= 0 && yOffset <= -scrollThreshold) {
      setAutoScrollEnabled(true);
    } else if (yOffset >= contentHeight - layoutHeight) {
      setAutoScrollEnabled(true);
      setIsManualScrolling(false); // User stopped manual scrolling
    } else {
      setAutoScrollEnabled(false);
      setIsManualScrolling(true); // User is manually scrolling
    }
  };

  const styles = {
    menu: {
      padding: 2,
    },
    menuItem: {
      color: "white",
      padding: 10,
      fontSize: 18,
      backgroundColor: "black",
    },
    separator: {
      width: "100%",
      height: 1,
      backgroundColor: "white",
    },
    menuTrigger: {
      color: "white",
      fontSize: 17,
      fontWeight: "bold",
      borderRadius: 10,
      backgroundColor: "black",
      padding: 1,
      paddingHorizontal: 9,
      paddingVertical: 3,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: "gray",
      borderWidth: 2,
      borderRadius: 20,
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,

      color: "white",
    },
    sendButton: {
      padding: 5,
      position: "absolute",
      right: 70,
    },
    cameraIcon: {
      padding: 5,
      paddingRight: 15,
    },
  };

  //  console.log(senderId);
  return (
    <ImageBackground
      source={require("../assets/chatwall.png")}
      style={{
        height: "100%",
      }}
    >
      <HeaderChatBox header={header} img={img} />
      {loading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size="large"
          color="#ffffff"
        />
      ) : (
        <ScrollView
          onScroll={handleScroll}
          ref={scrollViewRef}
          style={{ flex: 1, padding: 10, paddingBottom: 10 }}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {socketData?.map((item, index) => {
            const marginBottom = 10;
            let componentToRender;

            if (
              item.sender_details.full_name === "OpenAI" &&
              item.type === "message"
            ) {
              componentToRender = (
                <LeftSideChatProfile
                  key={index}
                  lastText={item.message}
                  type={"bot"}
                />
              );
            } else if (
              item.sender_details.full_name === "OpenAI" &&
              item.type === "image"
            ) {
              componentToRender = (
                <LeftSideImage key={index} img={item.message} />
              );
            } else if (item.sender !== senderId && item.type === "message") {
              componentToRender = (
                <LeftSideChatProfile
                  key={index}
                  lastText={item.message}
                  img={item.sender_details.avatar}
                  type={"user"}
                />
              );
            } else if (item.sender !== senderId && item.type === "file") {
              componentToRender = (
                <LeftSidedocx
                  key={index}
                  img={require("../assets/pdfViewer.png")}
                  avatar={item.sender_details.avatar}
                />
              );
            } else {
              componentToRender = (
                <RightSideChat key={index} msg={item.message} />
              );
            }


            

            return (
              <View style={{ marginVertical: 10 }} key={index}>
                {componentToRender}
              </View>
            );
          })}

          
        </ScrollView>
      )}

      {loadingAnimation ?  <TypeAnimation/> : <View></View>}
      
      <SafeAreaView
        style={{
          marginTop: 5,
          padding: 10,
          backgroundColor:
            "linear-gradient(164deg, rgba(24,24,32,0.8) 0%, rgba(37,37,54,0.2) 96%)",
        }}
      >
        {menu && (
          <View style={styles.menu}>
            {[
              { label: "@SKAI", type: "SKAI" },
              { label: "@IMAGE", type: "IMAGE" },
            ].map((option, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Text style={styles.separator}></Text>}
                <TouchableOpacity
                  onPress={() => {
                    // setMsg(option.label);
                    setGenType(option.type);
                    setMenu(false);
                  }}
                >
                  <Text style={styles.menuItem}>{option.label}</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        )}

        <View
          style={{
            flex: 0,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            backgroundColor:
              "linear-gradient(164deg, rgba(24,24,32,0.8) 0%, rgba(37,37,54,0.2) 96%)",
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "90%" }}
          >
            {/* <AntDesign name="pluscircleo" size={40} color="white" /> */}
            <TouchableOpacity
              onPress={() => {
                setMenu(!menu);
              }}
            >
              <Text style={styles.menuTrigger}>@</Text>
            </TouchableOpacity>
            <View
              style={{
                zIndex: 50,
                position: "absolute",
                left: 50,
                flexDirection: "row",
              }}
            >
              {genType != "" && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setMenu(!menu);
                    }}
                  >
                    <Text style={styles.menuTrigger}>{"@ " + genType}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <TextInput
              value={msg}
              onChangeText={(text) => {
                if (text.includes("@")) {
                  setMenu(true);
                }
                if (!text.includes("@")) {
                  setMenu(false);
                }
                setMsg(text);
              }}
              style={styles.input}
              className={`w-full  ${genType != "" ? "pl-28" : "pl-5"}  pr-5`}
            />
               <Ionicons style={styles.cameraIcon} name="document-outline" size={23} color="white" />
            <TouchableOpacity
              onPress={() => {
                sendMessage();
                setMsg("");
                setGenType("");
              }}
              style={styles.cameraIcon}
              disabled={sending} // Disable the button while sending is true
            >
              {sending ? (
                // Show a loading indicator while sending
                <ActivityIndicator size="small" color="white" />
              ) : (
                // Show the send button when not sending
                <FontAwesome name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
         
          </View>

          <Image
            style={{
              borderRadius: 15,
              width: 40, // Adjust the size as needed
              height: 40, // Adjust the size as needed
            }}
            source={{ uri: img }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default GroupChat;
//<FooterChatBox avatar={img} grpId={grpId} senderId={senderId}  />}

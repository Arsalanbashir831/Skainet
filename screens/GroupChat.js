import React, { useState, useEffect, useRef } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
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
import LeftSideChatProfile from "../components/LeftSideChatProfile";
import LeftSideImage from "../components/LeftSideImage";
import LeftSidedocx from "../components/LeftSidedocx";
import TypeAnimation from "../components/TypeAnimation";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Base64 } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { FlatList } from "react-native-web";



const GroupChat = ({ route }) => {
  // console.log("hello");
  const { header, img, senderId, grpId ,token } = route.params;
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
  const [pickedFile, setPickedFile] = useState(null);
  const [fileContent , setFileContent] = useState("")
  const [docRef , setDocRef] = useState(null)
  const [contextDocs , setContextDocs] = useState("")
  const [selectedAttachment , setSelectedAttachment] = useState("")
  const ws = new WebSocket(`wss://api.ilmoirfan.com/ws/chat/${grpId}/`);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
  
      console.log("Selected file:", res);
      setPickedFile(res);
        const formData = new FormData();
        formData.append('file', {
          uri: res.assets[0].uri,
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // or the appropriate mime type
          name: res.assets[0].name
        });
  
        try {
          let response = await fetch('https://api.ilmoirfan.com/chats/upload_attachment', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            
            },
            body: formData,
          });
          let json = await response.json();
          setFileContent(json.data.file_text)
          // console.log(json.data.file_text);
        } catch (error) {
          console.error("Error occurred during fetch:", error);
        }
  
    
    } catch (err) {
      console.log("Document picking failed", err);
    }
  };
 
  useEffect(() => {
    const fetchAttachment = async () => {
      try {
        const docsRes = await axios.get(`https://api.ilmoirfan.com/chats/get_attachments/${grpId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //  console.log(docsRes.data); // Assuming the data you need is in docsRes.data
        setDocRef(docsRes.data.attachments)
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    };
    fetchAttachment();
  }, [docRef]);
  

  useEffect(() => {
    if (pickedFile && fileContent != "") {
      sendMessage(fileContent);
    }
  }, [pickedFile ,fileContent]);


  
  const sendMessage = (content) => {
   if (msg != "" || pickedFile!=null) {
    
   
    setLoadingAnimation(true);
    console.log(ws.readyState);
    setSending(false);

    if (ws.readyState === 0) {
      ws.onopen = () => {

        if(contextDocs != ""){
          ws.send(
            JSON.stringify({
            "command": "query_on_attachment", 
            "sender": senderId,
             "chatId": grpId, 
             "attachment_id": selectedAttachment,
            "query": `@${contextDocs}${" "+msg}`
          })
          );
         
        }
        else if (pickedFile && pickedFile.assets && pickedFile.assets.length > 0 ) {
            const fileName = pickedFile.assets[0].name.split(".")[0];
            ws.send(
              JSON.stringify({
                command: "upload_attachment",
                chatId: grpId,
                sender: senderId,
                file_name: fileName,
                file_extension: `docx`,
                text: content.length > 500 ? "can not  summarize the docs more than 500 words . docs should be less than 500 words":content,
              })
            );
          
         
        }
        
        
        else {
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
    } 
    else {
      if(contextDocs != ""){
        ws.send(
          JSON.stringify({
          "command": "query_on_attachment", 
          "sender": senderId,
           "chatId": grpId, 
           "attachment_id": selectedAttachment,
          "query": `@+${contextDocs}+${msg}`
        })
        );
       
      }
      else if (pickedFile && pickedFile.assets && pickedFile.assets.length > 0) {
            const fileName = pickedFile.assets[0].name.split(".")[0];
            ws.send(
              JSON.stringify({
                command: "upload_attachment",
                chatId: grpId,
                sender: senderId,
                file_name: fileName,
                file_extension: `docx`,
                text: content.length > 500 ? "can not  summarize the docs more than 500 words . docs should be less than 500 words":content,
              })
            );
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
    }
  }else{
    alert("Please enter the message ")
  }
  };
  useEffect(() => {
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setLoading(false);
      setPickedFile(null);
      setFileContent("")
      setContextDocs("")
      console.log(response);
      if (response.message === undefined) {
        setSocketData((prevSocketData) => [
          ...prevSocketData,
          ...response.messages,
        ]);
      } else {
        setSocketData((prevSocketData) => [
          ...prevSocketData,
          response.message,
        ]);

        if (response.message.sender !== senderId) {
          setLoadingAnimation(false);
        }
      }

      if (autoScrollEnabled && !isManualScrolling && scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    };
  }, []);




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
      position:'absolute',
      left:10,
      bottom:-10,
      
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: "gray",
      borderWidth: 2,
      borderRadius: 10,
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
    sendIcon: {
      padding: 5,
      paddingRight: 15,
    },
  };
  //  console.log(token);
// console.log(contextDocs , msg);
  return (
    // <ImageBackground
    //   source={require("../assets/chatwall.png")}
    //   style={{
    //     height: "100%",
    //   }}
    // >
    <View className='bg-black h-[100%]'>
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

      {loadingAnimation ? <TypeAnimation /> : <View></View>}



      <SafeAreaView
        style={{
          marginTop: 5,
          padding: 10,
          
        }}
      >
        {menu && (
          <View>

         <View>
         <Text className='text-white p-3 text-lg'>Documents</Text>     
   

          <ScrollView className='h-28' style={styles.menu}>
           
            {
              docRef?.map((option, index) => (
              <React.Fragment key={option.id}>
                {option.id > 0 && <Text style={styles.separator}></Text>}
                <TouchableOpacity
                  onPress={() => {
                    // setMsg(option.label);
                    setContextDocs(option.name)
                    setGenType(`${option.name.slice(0,2)}.docx`)
                    setSelectedAttachment(option.id)
                    setMenu(false);
                  }}
                >
                {option.name.split(".")[0].length >= 15 ?(<>
                  <Text style={styles.menuItem}>{option.name.split(".")[0].slice(0,15)+"......"+option.name.split(".")[1]}</Text>
                </>):(<>
                  <Text style={styles.menuItem}>{option.name}</Text>
                </>)}
                </TouchableOpacity>
              </React.Fragment>
            ))}
            
          </ScrollView>
         
          </View>

          <View style={styles.menu}>
          <Text className='text-white p-3 text-lg'>Generation Type</Text>
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
          </View>
        )}

        <View
          style={{
            flex: 0,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
          >
            {/* <AntDesign name="pluscircleo" size={40} color="white" /> */}
            <TouchableOpacity className='z-20'
              onPress={() => {
                setMenu(!menu);
              }}
            >
              <Image   source={require("../assets/tag.png")}/>
            </TouchableOpacity>
            <View
              style={{
                zIndex: 50,
                position: "absolute",
                left: 30,
                top:25,
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
              placeholder="Enter Message"
              placeholderTextColor={'white'}
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
              className={`w-full  ${genType != "" ? "pl-28" : "pl-10"}  pr-5`}
            />
            <TouchableOpacity
              onPress={() => {
                pickFile();
              }}
            >
            <FontAwesome   style={styles.sendIcon} name="plus-square-o" size={24} color="white" />
          
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                sendMessage();
                setMsg("");
                setGenType("");
              }}
              style={styles.sendIcon}
              disabled={sending} 
            >
              {sending ? (
                
                <ActivityIndicator size="small" color="white" />
              ) : (
                
                <FontAwesome name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>

          
        </View>
      </SafeAreaView>
      </View>
    // </ImageBackground> 
  );
};

export default GroupChat;

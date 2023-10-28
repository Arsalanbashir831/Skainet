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
  Modal,
} from "react-native";

import LeftSideChatProfile from "../components/LeftSideChatProfile";
import LeftSideImage from "../components/LeftSideImage";
import LeftSidedocx from "../components/LeftSidedocx";
import TypeAnimation from "../components/TypeAnimation";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import GroupChatHeader from '../components/GroupChatHeader'

const GroupChat = ({ route }) => {

  const { header, img, senderId, grpId, token } = route.params;
  const [socketData, setSocketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [menu, setMenu] = useState(false);
  const [genType, setGenType] = useState("new_message");
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [pickedFile, setPickedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [docRef, setDocRef] = useState(null);
  const [contextDocs, setContextDocs] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState("");
  const [visible, setVisible] = useState(false);
  const [collaborators , setCollaborators] = useState(null)
  const [tag,setTag] =useState([])
  const ws = new WebSocket(`wss://api.ilmoirfan.com/ws/chat/${grpId}/`);


  useEffect(()=>{
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`https://api.ilmoirfan.com/chats/get_collaborators/${grpId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        //apperbuild@gmail.com
      
        // console.log(response.data.collaborators); 
setCollaborators(response.data.collaborators)
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    };

    fetchMembers()
  },[collaborators])
  const members = collaborators

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      console.log("Selected file:", res);
      setPickedFile(res);
      const formData = new FormData();
      formData.append("file", {
        uri: res.assets[0].uri,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // or the appropriate mime type
        name: res.assets[0].name,
      });

      try {
        let response = await fetch(
          "https://api.ilmoirfan.com/chats/upload_attachment",
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          }
        );
        let json = await response.json();
        setFileContent(json.data.file_text);
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
        const docsRes = await axios.get(
          `https://api.ilmoirfan.com/chats/get_attachments/${grpId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //  console.log(docsRes.data); // Assuming the data you need is in docsRes.data
        setDocRef(docsRes.data.attachments);
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
  }, [pickedFile, fileContent]);

  const sendMessage = (content) => {
    if (msg != "" || pickedFile != null ) {
      if(genType!='new_message'){
        setLoadingAnimation(true);
      }
      console.log(ws.readyState);
      setSending(false);

      if (ws.readyState === 0) {
        ws.onopen = () => {
          if (contextDocs != "") {
            ws.send(
              JSON.stringify({
                command: "query_on_attachment",
                sender: senderId,
                chatId: grpId,
                attachment_id: selectedAttachment,
                query: `@${contextDocs}${" " + msg}`,
              })
            );
          } else if (
            pickedFile &&
            pickedFile.assets &&
            pickedFile.assets.length > 0
          ) {
            const fileName = pickedFile.assets[0].name.split(".")[0];
            ws.send(
              JSON.stringify({
                command: "upload_attachment",
                chatId: grpId,
                sender: senderId,
                file_name: fileName,
                file_extension: `docx`,
                text:
                  content.length > 500
                    ? "can not  summarize the docs more than 500 words . docs should be less than 500 words"
                    : content,
              })
            );
          } else {
            ws.send(
              JSON.stringify({
                command:
                genType === "IMAGE" ? "generate_image" : genType === "Skai" ? "chat_with_ai":"new_message",
                chatId: grpId,
                text: tag.length===0? msg:tag.toString()+" "+msg,
                sender: senderId,
              })
            );
          }
        };
      } else {
        if (contextDocs != "") {
          ws.send(
            JSON.stringify({
              command: "query_on_attachment",
              sender: senderId,
              chatId: grpId,
              attachment_id: selectedAttachment,
              query: `@+${contextDocs}+${msg}`,
            })
          );
        } else if (
          pickedFile &&
          pickedFile.assets &&
          pickedFile.assets.length > 0
        ) {
          const fileName = pickedFile.assets[0].name.split(".")[0];
          ws.send(
            JSON.stringify({
              command: "upload_attachment",
              chatId: grpId,
              sender: senderId,
              file_name: fileName,
              file_extension: `docx`,
              text:
                content.length > 500
                  ? "can not  summarize the docs more than 500 words . docs should be less than 500 words"
                  : content,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              command:  genType === "IMAGE" ? "generate_image" : genType === "Skai" ? "chat_with_ai":"new_message",
              chatId: grpId,
              text: tag.length===0? msg:tag.toString()+" "+msg,
              sender: senderId,
            })
          );
        }
      }
    } else {
      alert("Please enter the message ");
    }
  };
  useEffect(() => {
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setLoading(false);
      setTag([])
      setPickedFile(null);
      setFileContent("");
      setContextDocs("");
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
      backgroundColor: "#a700b3",
      padding: 1,
      paddingHorizontal: 9,
      paddingVertical: 3,
      position: "absolute",
      left: 10,
      bottom: -10,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: "#1C1C1E",
      borderWidth: 2,
      borderRadius: 10,
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
      color: "white",
      backgroundColor:"#1C1C1E"

    },
    sendButton: {
      padding: 5,
      position: "absolute",
      right: 70,
    },
    sendIcon: {
      padding: 6,
      paddingHorizontal:10,
  
    },
  };
  const handleTag = (member) => {
    setTag([...new Set([...tag, member])]);
  };
  
//  console.log(tag);
  return (

    <View className="bg-black h-[100%]">
      {visible ? (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              // handle the close action here
              setVisible(false);
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View
                style={{
                  margin: 50,
                  backgroundColor: "#1c1c1c",
                  borderRadius: 13,
                  padding: 20,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    marginBottom: 15,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Choose an Option
                </Text>
                <TouchableOpacity onPress={()=>{
                pickFile()
                setVisible(false)
                }}
                  style={{
                    padding: 15,
                    width: "100%",
                    borderBottomColor: "#dcdcdc",
                    borderBottomWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#ffff",
                      textAlign: "center",
                    }}
                  >
                    Upload Document
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 15,
                    width: "100%",
                    borderBottomColor: "#dcdcdc",
                    borderBottomWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#ffff",
                      textAlign: "center",
                    }}
                  >
                    Upload Image
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                  }}
                  style={{
                    marginTop: 15,
                  }}
                >
                  <Text
                    style={[
                      {
                        fontSize: 16,
                        color: "#ffff",
                        textAlign: "center",
                      },
                      { color: "red" },
                    ]}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
      <></>
      )}
      {/* <ModalDocs visible={true}/> */}
      {/* <HeaderChatBox header={header} img={img} /> */}
      <GroupChatHeader header={header} img={img} members={members} token={token} grpId={grpId} handleTag ={handleTag} />
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
        {/* {isModal?(<>
      <ModalDocs visible={true}/>
      </>):<></>} */}

        {menu && (
          <View className="bg-[#1c1c1c]">
            <View>
              <Text className="text-white p-3 text-lg">Documents</Text>

              <ScrollView className="h-28" style={styles.menu}>
                {docRef?.map((option, index) => (
                  <React.Fragment key={option.id}>
                    {option.id > 0 && <Text style={styles.separator}></Text>}
                    <TouchableOpacity
                      onPress={() => {
                        // setMsg(option.label);
                        setContextDocs(option.name);
                        setGenType(`${option.name.slice(0, 2)}.docx`);
                        setSelectedAttachment(option.id);
                        setMenu(false);
                      }}
                    >
                      {option.name.split(".")[0].length >= 15 ? (
                        <>
                          <Text style={styles.menuItem}>
                            {option.name.split(".")[0].slice(0, 15) +
                              "......" +
                              option.name.split(".")[1]}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.menuItem}>{option.name}</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.menu}>
              <Text className="text-white p-3 text-lg">Generation Type</Text>
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
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* <AntDesign name="pluscircleo" size={40} color="white" /> */}
            <TouchableOpacity
              className="z-20"
              onPress={() => {
                setMenu(!menu);
              }}
            >
              <Image source={require("../assets/tag.png")} />
            </TouchableOpacity>
            <View
              style={{
                zIndex: 50,
                position: "absolute",
                left: 30,
                top: 25,
                flexDirection: "row",
              }}
            >
              {genType != "new_message"  && (
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
              placeholderTextColor={"white"}
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
              className={`w-full  ${genType != "new_message" ? "pl-28" : "pl-10"}  pr-5`}
            />
            <TouchableOpacity
              onPress={() => {
                setVisible(true)
              }}
            >
              <FontAwesome
                style={styles.sendIcon}
                name="plus-square-o"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                sendMessage();
                setMsg("");
                setGenType("new_message");
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

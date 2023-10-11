import React, { useState } from "react";
import {
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Text
} from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

export default FooterChatBox = ({ avatar, grpId, senderId }) => {

  const [msg, setMsg] = useState("");
  const [socketData, setSocketData] = useState(null);
  const [sending, setSending] = useState(false);
  const [menu, setMenu] = useState(false);
  const [genType , setGenType] = useState("")
  
  const sendMessage = () => {
    const ws = new WebSocket(`wss://api.skainet.ai/ws/chat/${grpId}/`);
    setSending(true); 
    //"chat_with_ai"
    ws.onopen = () => {
   
      setMsg(""); // Clear the input field
      setGenType("")
      ws.send(
        JSON.stringify({
          command: genType==='IMAGE' ? "generate_image" : "chat_with_ai",
          chatId: grpId,
          text: msg,
          sender: senderId,
        })
      );
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setSocketData(response.message);
      setSending(false);
      

    };

    ws.onclose = () => {
      
    };

    ws.onerror = () => {
      setSending(false); 
    };

    return () => {
      ws.close();
    };
  };
 
// if (msg.includes('@')) {
//   setMenu(!menu)
// }
  return (
    <SafeAreaView
      style={{
        marginTop: 5,
        padding:10,
        backgroundColor:
          "linear-gradient(164deg, rgba(24,24,32,0.8) 0%, rgba(37,37,54,0.2) 96%)",
      }}
    >
   { menu  && (
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
            setMenu(false)
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
        <View style={{ flexDirection: "row", alignItems: "center", width: "90%" }}>
          {/* <AntDesign name="pluscircleo" size={40} color="white" /> */}
          <TouchableOpacity onPress={()=>{setMenu(!menu)}} >
            <Text style={styles.menuTrigger}>@</Text>
          </TouchableOpacity>
          <View style={{ zIndex: 50  , position:'absolute' , left:50,'flexDirection':'row'}}>
         
          {genType !=""&&(<>
            <TouchableOpacity onPress={()=>{setMenu(!menu)}} >
            <Text style={styles.menuTrigger}>{"@ "+genType}</Text>
          </TouchableOpacity>
          </>)}
          
          </View>
          
          <TextInput
            value={msg}
            onChangeText={(text) => {
              if(text.includes("@")){
                setMenu(true)
              } if(!text.includes('@')){
                setMenu(false)
             
              }
              setMsg(text)}}
            style={styles.input}
            className={`w-full  ${genType != '' ? 'pl-28' : 'pl-5'}  pr-5`}

          />
          <TouchableOpacity
            onPress={sendMessage}
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
          {/* <Ionicons style={styles.cameraIcon} name="camera-outline" size={40} color="white" /> */}
        </View>

        <Image
          style={{
            borderRadius: 15,
            width: 40, // Adjust the size as needed
            height: 40, // Adjust the size as needed
          }}
          source={{ uri: avatar }}
        />
      </View>
    </SafeAreaView>
  );
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
    borderRadius:10,
    backgroundColor: "black",
    padding: 1,
    paddingHorizontal:9,
    paddingVertical:3
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
    paddingRight:15
  },
};

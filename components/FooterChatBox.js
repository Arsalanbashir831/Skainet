import React, { useEffect, useState } from "react";
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
  
  useEffect(()=>{
    console.log(ws.readyState);
  },[])
  const sendMessage = () => {
    
    const ws = global.ws
    console.log(ws.readyState)
    setSending(false); 
    //console.log(ws.readyState);
    //"chat_with_ai"
    if(ws.readyState ===0){
    ws.onopen = () => {
   
      
      ws.send(
        JSON.stringify({
          command: genType==='IMAGE' ? "generate_image" : "chat_with_ai",
          chatId: grpId,
          text: msg,
          sender: senderId,
        })
      );

      global.sent = msg;
    };
  }
  
    else{
      ws.send(
        JSON.stringify({
          command: genType==='IMAGE' ? "generate_image" : "chat_with_ai",
          chatId: grpId,
          text: msg,
          sender: senderId,
        })
        
      
      );
      global.sent = msg;
    }
  
   
 
    ws.onclose = () => {
      
    };

    ws.onerror = () => {
      setSending(false); 
    };


    setMsg(""); 
    setGenType("")
   
  };
 


  return (
    <></>
  )
}
    

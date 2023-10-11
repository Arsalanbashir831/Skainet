import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import HeaderChatBox from "../components/HeaderChatBox";
import FooterChatBox from "../components/FooterChatBox";
import LeftSideChatProfile from "../components/LeftSideChatProfile";
import LeftSideImage from "../components/LeftSideImage";
import LeftSidePdf from "../components/LeftSidePdf";

const GroupChat = ({ route }) => {
  const { header, img, senderId, grpId } = route.params;
  const [socketData, setSocketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`wss://api.skainet.ai/ws/chat/${grpId}/`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          command: "fetch_messages",
          sender: senderId,
          chatId: grpId,
        })
      );
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setSocketData(response.messages);
      if (autoScrollEnabled && !isManualScrolling && scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    };

    return () => {
      ws.close();
    };
  }, [autoScrollEnabled, socketData, isManualScrolling]);

  useEffect(() => {
    if (socketData?.length > 0) {
      setLoading(false);
    }
  }, [socketData]);

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
                  lastText={item.message}
                  type={"bot"}
                />
              );
            } else if (
              item.sender_details.full_name === "OpenAI" &&
              item.type === "image"
            ) {
              componentToRender = (
                <LeftSideImage img={item.message} />
              );
            } else if (
              item.sender !== senderId &&
              item.type === "message"
            ) {
              componentToRender = (
                <LeftSideChatProfile
                  lastText={item.message}
                  img={item.sender_details.avatar}
                  type={"user"}
                />
              );
            } else if (
              item.sender !== senderId &&
              item.type === "file"
            ) {
              componentToRender = (
                <LeftSidePdf
                  img={require("../assets/pdfViewer.png")}
                  avatar={item.sender_details.avatar}
                />
              );
            } else {
              componentToRender = <RightSideChat msg={item.message} />;
            }

            return (
              <View style={{ marginVertical: 10 }} key={index}>
                {componentToRender}
              </View>
            );
          })}
        </ScrollView>
      )}

      {!loading && <FooterChatBox avatar={img} grpId={grpId} senderId={senderId} />}
    </ImageBackground>
  );
};

export default GroupChat;

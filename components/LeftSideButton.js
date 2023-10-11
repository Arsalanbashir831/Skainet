import {
    View,
    Text,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";


export default leftSideButton = () => {
    return (
      
            <TouchableOpacity style={{paddingLeft: '20%',maxWidth: '60%', maxHeight:'10%'}}  onPress={() => { console.log("pressed") }} >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={["#3f5efb", "#fc466b"]}
                    style={{borderRadius: 50, borderWidth: 1, maxHeight: '100%'}}
                >
                    <Text className="text-center text-white font-bold text-md  p-2 ">
                        Private Message
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

     
    )
}
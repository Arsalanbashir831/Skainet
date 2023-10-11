import React from "react";
import { View, Text, ImageBackground, Image, SafeAreaView, StyleSheet } from 'react-native'
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
export default LeftSidePdf = ({ lastText, img ,avatar }) => {

    const source = require('../assets/ball.png');
    return (
        <>


<Image style={{ width: "13%", height: 50 ,borderRadius:30 }} source={{uri:avatar}} />
        <View style={{ flex: 1, flexDirection: 'row', gap: 15 }}>
         
            <View style={styles.container}>

                <Image style={{minWidth: '70%' }} source={img}>

                </Image>
                   
                    {/* <Feather  style={{position:'absolute' , right:-10 , bottom:-128 , backgroundColor:'black' , padding:10,borderRadius:10}} name="send" size={18} color="#2265DD" /> */}
                <Text style={{ color: 'white' }}>
                    {lastText}
                </Text>
            </View>

        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        maxWidth: '70%',
        minHeight: '5%',
        maxHeight: '30%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomEndRadius: 10,
        flex: 1,
        flexDirection: 'row',
        gap: 3,
        position:'relative',
        left:50,
        bottom:20
    }
})
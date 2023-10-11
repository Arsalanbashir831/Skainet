import React from "react";
import { View, Text, ImageBackground, Image, SafeAreaView, StyleSheet } from 'react-native'
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
export default LeftSideImage = ({ lastText, img ,avatar }) => {
  
    const source = require('../assets/ball.png');
    // console.log(img);
    return (
        <>

<Image style={{ width: "13%", height: 50 }} source={source} />
        <View style={{ flex: 1, flexDirection: 'row', gap: 15 }}>
          
            <View style={styles.container}>

                <Image style={{ width: 200, height: 200 }}  source={{uri:img}}>

                </Image>
                    {/* <AntDesign style={{position:'absolute' , right:-10 , bottom:-115 , backgroundColor:'black' , padding:10,borderRadius:10}} name="heart" size={18} color="red" /> */}
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
import React from "react";
import { View, Text, ImageBackground, Image, SafeAreaView, StyleSheet } from 'react-native'


export default RightSideChat = ({msg}) => {
    return (
        <View style={styles.container}>
            <Text className="text-md" style={{ color: 'white' }}>
              {msg}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignSelf: 'flex-end',
        alignContent: 'flex-end',
        backgroundColor: '#0292e6',
        borderColor: '#0292e6',
        borderWidth: 2,
        maxWidth: '85%',
        minHeight: 20,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomStartRadius: 10,
        
    }
})
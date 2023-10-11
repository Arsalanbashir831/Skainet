import { View, Text,Image,StatusBar } from 'react-native'
import React from 'react'

const Logo = () => {
  return (
    <>
          <Image style={{alignSelf:'center'}} className='h-[100px]'
            source={require("../assets/ball.png")}
          />
          <Image style={{alignSelf:'center'}}
            source={require("../assets/lgtxt.png")}
          />
          <Text style={{opacity:0.8}} className='text-white text-2xl font-extralight pt-7 text-center'>Get your ideas high</Text>
          <StatusBar style="auto" />
      

       </>
  )
}

export default Logo
import React from 'react';
import { View, Text, Image, SafeAreaView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; 

const GroupChatHeader = ({ header, img, members,token,grpId ,handleTag ,tagArr,ws}) => {
  const navigation = useNavigation();
  const addToTag = (member) => {
    handleTag(member);
    console.log(tagArr);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => { navigation.goBack(null);ws.close() }}>
          <MaterialIcons name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: img }} />
            <View style={styles.notification}>
           
              <Text style={styles.notificationText}>{members?.length}</Text>
            </View>
          </View>
          <View >
          <Text   style={styles.headerText}>{header.slice(0, 20)}.....</Text>
         
          </View>
          <TouchableOpacity onPress={()=>{navigation.navigate("AddNewCollaborators",{
            grpId:grpId,
            token:token,
            members:members
          })}}>
          <AntDesign style={{paddingHorizontal:30}} name="plussquare" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList 
      horizontal
        data={members}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          
          <TouchableOpacity  onPress={() => addToTag("@"+item.full_name)}>
          <View style={styles.memberContainer}>
            <Image style={styles.memberImage} source={{ uri: item.avatar }} />
            <Text style={styles.memberName}>{item.full_name}</Text>
          </View>
          </TouchableOpacity>
        )}
        
      />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1c',
   
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  notification: {
    backgroundColor: 'white',
    borderRadius: 12,
    position: 'absolute',
    top: 8,
    right: -10,
    padding: 2,
  },
  notificationText: {
    color: 'black',
    textAlign: 'center',
    padding:1,
    paddingHorizontal:5
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    paddingLeft:10
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  memberImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  memberName: {
    color: 'white',
    fontSize: 16,
  },
});

export default GroupChatHeader;

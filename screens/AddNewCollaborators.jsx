import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";


const AddNewCollaborators = ({ route }) => {
    const {grpId,token} = route.params
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation()

    const handleAddCollaborator = async () => {
        try {
            setIsLoading(true);
            const url = 'https://api.ilmoirfan.com/chats/invite_collaborator';
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const body = {
                chat_id: grpId,
                email: email,
                permissions: "editor"
            };
            const response = await axios.post(url, body, config);
            console.log(response.data); 
            setIsLoading(false);
            navigation.goBack();
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Collaborator</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Enter Email"
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    placeholderTextColor={'white'}
                />
            </View>
            <TouchableOpacity onPress={handleAddCollaborator} >
              
            <LinearGradient
                    colors={["#8222CD", "#1B69DD"]}
                    style={styles.createButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.createButtonText}>Add Contact</Text>
                    )}
                </LinearGradient>
              
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 8,
    },
    inputContainer: {
        width: '80%',
        backgroundColor: 'rgba(61, 63, 71, 0.5)',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    input: {
        width: '100%',
        fontSize: 16,
        color: 'white',
    },
    createButton: {
        backgroundColor: '#FF6347',
        padding: 15,
        marginTop: 20,
        borderRadius: 10,
        width: '60%',
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AddNewCollaborators;

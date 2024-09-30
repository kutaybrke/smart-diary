import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PinCodeScreen = ({ navigation }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isSettingPin, setIsSettingPin] = useState(true); 

    const handleSavePin = async () => {
        if (pin.length < 4) {
            Alert.alert('Error', 'PIN must be at least 4 digits long.');
            return;
        }

        if (pin !== confirmPin) {
            Alert.alert('Error', 'PINs do not match.');
            return;
        }

        try {
            await AsyncStorage.setItem('userPin', pin);
            Alert.alert('Success', 'PIN has been set successfully.');
            setIsSettingPin(false); 
        } catch (error) {
            Alert.alert('Error', 'Failed to save PIN.');
            console.error(error);
        }
    };

    const handlePinLogin = async () => {
        try {
            const storedPin = await AsyncStorage.getItem('userPin');
            if (storedPin === pin) {
                navigation.replace('DiaryPage'); 
            } else {
                Alert.alert('Failed', 'Invalid PIN.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to retrieve stored PIN.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSettingPin ? 'Set Up Your PIN' : 'Enter Your PIN'}</Text>
            {isSettingPin ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter PIN"
                        keyboardType="numeric"
                        secureTextEntry
                        value={pin}
                        onChangeText={setPin}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm PIN"
                        keyboardType="numeric"
                        secureTextEntry
                        value={confirmPin}
                        onChangeText={setConfirmPin}
                    />
                    <Button title="Save PIN" onPress={handleSavePin} />
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter PIN"
                        keyboardType="numeric"
                        secureTextEntry
                        value={pin}
                        onChangeText={setPin}
                    />
                    <Button title="Login with PIN" onPress={handlePinLogin} />
                </>
            )}
            {!isSettingPin && (
                <Button
                    title="Set Up PIN"
                    onPress={() => setIsSettingPin(true)} 
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '100%',
    },
});

export default PinCodeScreen;

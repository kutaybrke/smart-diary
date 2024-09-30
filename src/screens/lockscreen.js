import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const LockScreen = ({ onUnlock }) => {

    const handleFingerprintScan = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync();
            if (result.success) {
                onUnlock();
            } else {
                alert('Parmak izi doğrulaması başarısız oldu!');
            }
        } else {
            alert('Cihazda parmak izi doğrulaması yapılamıyor.');
        }
    };

    return (
        <ImageBackground
            source={require('../image/arkaplan.jpg')}
            style={styles.container}
            blurRadius={1} 
        >
            <View style={styles.innerContainer}>
                <View style={styles.iconsContainer}>
                    <Image source={require('../image/pincode-icon.png')} style={styles.icon} />
                    <Image source={require('../image/faceid-icon.png')} style={styles.icon} />
                    <Image source={require('../image/fingerprint-icon.png')} style={styles.icon} />
                    <Image source={require('../image/lockscreen-icon.png')} style={styles.icon} />
                </View>
                <Text style={styles.title}>Günlüğe Erişim İçin Kilidi Açın</Text>
                <TouchableOpacity
                    onPress={handleFingerprintScan}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Parmak İzi ile Giriş Yap</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    innerContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        maxWidth: 400, 
    },
    iconsContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%',
        marginBottom: 20,
    },
    icon: {
        width: 40,
        height: 40,
        marginHorizontal: 10, 

    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'lightgreen',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000', 
    },
});

export default LockScreen;

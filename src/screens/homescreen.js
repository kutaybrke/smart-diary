import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Animated, Alert, Dimensions, Image } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import styles from '../css/style';
import LineChartComponent from '../screens/linechart';
import { useNavigation } from '@react-navigation/native';

const MoodButton = ({ mood, onPress }) => (
    <View style={styles.moodWrapper}>
        <TouchableOpacity
            style={[styles.moodButton, { backgroundColor: mood.color }]}
            onPress={onPress}
        >
            <Text style={styles.moodButtonText}>{mood.icon}</Text>
        </TouchableOpacity>
        <Text style={styles.moodLabel}>{mood.label}</Text>
    </View>
);

const HomeScreen = () => {
    const [floatingIcons, setFloatingIcons] = useState([]);
    const [hasMood, setHasMood] = useState(false);
    const [weather, setWeather] = useState(null);
    const navigation = useNavigation(); 

    useEffect(() => {
        checkTodayMood();
        fetchWeather();
    }, []);

    const moods = [
        { icon: '😊', label: 'Mutlu' },
        { icon: '😢', label: 'Üzgün' },
        { icon: '😲', label: 'Şaşkın' },
        { icon: '😌', label: 'Huzurlu' },
    ];

    const checkTodayMood = async () => {
        try {
            const response = await fetch('http://ip:3000/api/moods');
            if (!response.ok) {
                throw new Error('Kayıtlar getirilemedi');
            }

            const data = await response.json();
            const today = new Date().toISOString().split('T')[0];

            const todayMood = data.find(entry => new Date(entry.date).toISOString().split('T')[0] === today);
            setHasMood(!!todayMood);
        } catch (error) {
            console.error('Mood kontrol edilirken hata:', error.message);
        }
    };

    const fetchWeather = async () => {
        const apiKey = '';
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Location permission not granted');
            return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = coords;

        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=tr`);
            const weatherData = response.data;
            setWeather({
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon,
                location: weatherData.name,
            });
        } catch (error) {
            console.error('Weather data fetch error:', error.message);
        }
    };

    const handleMoodPress = async (mood) => {
        if (hasMood) {
            Alert.alert('Uyarı', 'Bugünlük mood durumunuzu belirlediniz.');
            return;
        }

        try {
            const response = await fetch('http://ip:3000/api/mood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mood: mood.label }),
            });

            if (!response.ok) {
                throw new Error('Mood kaydedilemedi');
            }

            const data = await response.json();
            console.log('Mood kaydedildi:', data);

            const { width, height } = Dimensions.get('window');
            let newIcons = [];
            let newAnimatedValues = [];

            for (let i = 0; i < 10; i++) {
                const randomX = Math.random() * width;
                const randomY = Math.random() * height;

                const animatedValue = new Animated.ValueXY({ x: randomX, y: randomY });
                newIcons.push({ icon: mood.icon, animatedValue });
                newAnimatedValues.push(animatedValue);

                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: { x: randomX, y: randomY - 50 },
                        duration: 1000,
                        useNativeDriver: false,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: { x: randomX, y: randomY + 500 },
                        duration: 1000,
                        useNativeDriver: false,
                    }),
                ]).start();
            }

            setFloatingIcons([...floatingIcons, ...newIcons]);

            setTimeout(() => {
                setFloatingIcons(floatingIcons.filter(icon => !newIcons.includes(icon)));
            }, 2000);

            setHasMood(true);

        } catch (error) {
            console.error('Mood kaydedilemedi:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                {/* Weather section */}
                {weather && (
                    <View style={styles.weatherContainer}>
                        <Text style={styles.weatherLocation}>{weather.location}</Text>
                        <Text style={styles.weatherText}>{weather.temperature}°C</Text>
                        <Text style={styles.weatherDescription}>{weather.description}</Text>
                        <Image
                            style={styles.weatherIcon}
                            source={{ uri: `https://openweathermap.org/img/w/${weather.icon}.png` }}
                        />
                    </View>
                )}

                {/* ChatBot*/}
                <TouchableOpacity
                    style={styles.chatBotButton}
                    onPress={() => navigation.navigate('ChatBotScreen')}
                >
                    <Text style={styles.chatBotButtonText}>Chat</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.headingText}>Bugün kendini nasıl hissediyorsun?</Text>

            <View style={styles.moodContainer}>
                {moods.map((mood, index) => (
                    <MoodButton key={index} mood={mood} onPress={() => handleMoodPress(mood)} />
                ))}
            </View>
            {/* Grafik Bileşeni */}
            <LineChartComponent />
            {floatingIcons.map((icon, index) => (
                <Animated.View key={index} style={[styles.floatingIcon, icon.animatedValue.getLayout()]}>
                    <Text style={styles.floatingIconText}>{icon.icon}</Text>
                </Animated.View>
            ))}
        </View>
    );
};

export default HomeScreen;

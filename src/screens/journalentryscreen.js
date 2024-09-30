import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, Button, ScrollView, Alert, ImageBackground, TouchableOpacity, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Audio } from 'expo-av';
import journalstyles from '../css/journalstyles';

const AudioPlayer = ({ uri, onRemove }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    useEffect(() => {
        if (uri) {
            loadAudio();
        }
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [uri]);

    const loadAudio = async () => {
        const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: false },
            onPlaybackStatusUpdate
        );
        setSound(sound);
    };

    const onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
            setDuration(status.durationMillis);
            setPosition(status.positionMillis);
            setIsPlaying(status.isPlaying);
        }
    };

    const playPauseAudio = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
        }
    };

    return (
        <View style={journalstyles.audioContainer}>
            <TouchableOpacity onPress={playPauseAudio}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#000" />
            </TouchableOpacity>

            <View style={journalstyles.progressBarContainer}>
                <View style={[journalstyles.progressBar, { width: `${(position / duration) * 100}%` }]} />
            </View>
            <Text>{`${Math.floor(position / 1000)}:${(position % 1000)}`}</Text>

            {onRemove && (
                <TouchableOpacity onPress={onRemove} style={journalstyles.audioIcon}>
                    <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
            )}
        </View>
    );
};


const JournalEntryScreen = () => {
    const [journalContent, setJournalContent] = useState('');
    const [journalTitle, setJournalTitle] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [imageUris, setImageUris] = useState([]);
    const [recording, setRecording] = useState(null);
    const [recordingUri, setRecordingUri] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Kamera erişimi gerekli', 'Bu özellik için kamera izni vermeniz gerekmektedir.');
            }

            const audioStatus = await Audio.requestPermissionsAsync();
            if (audioStatus.status !== 'granted') {
                Alert.alert('Mikrofon erişimi gerekli', 'Bu özellik için mikrofon izni vermeniz gerekmektedir.');
            }
        })();
    }, []);

    const handleSave = async () => {
        if (!journalTitle.trim() || !journalContent.trim()) {
            Alert.alert('Hata', 'Lütfen başlık ve günlüğünüzü yazın.');
            return;
        }

        try {
            const sentimentResponse = await fetch(
                'https://language.googleapis.com/v1/documents:analyzeSentiment?key=',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        document: {
                            type: 'PLAIN_TEXT',
                            content: journalContent,
                            language: 'tr',  
                        },
                    }),
                }
            );

            const sentimentData = await sentimentResponse.json();

            console.log('Sentiment Data:', sentimentData); 

            if (!sentimentData.documentSentiment) {
                throw new Error('Sentiment analysis failed: Document sentiment data missing');
            }

            const sentimentScore = sentimentData.documentSentiment.score;
            const sentimentMagnitude = sentimentData.documentSentiment.magnitude;

            let mood = 'nötr';

            if (sentimentScore > 0.2) {
                mood = 'mutlu';
            } else if (sentimentScore < -0.2) {
                mood = 'üzgün';
            }

            const formData = new FormData();
            formData.append('title', journalTitle);
            formData.append('content', journalContent);
            formData.append('date', date.toISOString());
            formData.append('mood', mood); 
            formData.append('sentimentScore', sentimentScore.toString()); 
            formData.append('sentimentMagnitude', sentimentMagnitude.toString()); 

            imageUris.forEach((uri, index) => {
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                formData.append('image', { uri, name: filename, type });
            });

            const response = await fetch('http://İP:3000/api/journal', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            const responseData = await response.json();

            if (response.ok) {
                setJournalTitle('');
                setJournalContent('');
                setImageUris([]);
            } else {
                console.error('Günlük kaydedilemedi:', responseData.error);
            }
        } catch (error) {
            console.error('Hata:', error);
        }
    };

    const openCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUris([...imageUris, result.assets[0].uri]);
        }
    };
    const openImagePicker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUris([...imageUris, result.assets[0].uri]);
        }
    };

    const startRecording = async () => {
        try {
            // Ses modunu ayarlar
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true, // iOS üzerinde kayıt izni verir
                playsInSilentModeIOS: true, // Sessiz modda da çalmasına izin verir
                staysActiveInBackground: true, // Arka planda aktif kalır
            });

            // Ses kaydını başlat
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (error) {
            console.error('Recording failed:', error);
        }
    };

    const stopRecording = async () => {
        if (recording) {
            try {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setRecording(null);
                setRecordingUri(uri);
            } catch (error) {
                console.error('Stopping recording failed:', error);
            }
        }
    };

    const removeImage = (index) => {
        const newImageUris = [...imageUris];
        newImageUris.splice(index, 1);
        setImageUris(newImageUris);
    };

    const removeAudio = () => {
        setRecordingUri('');
    };

    return (
        <ImageBackground
            source={require('../image/arkaplan.jpg')}
            style={journalstyles.container}
            blurRadius={1}
        >
            <ScrollView contentContainerStyle={journalstyles.container}>
                <Text style={journalstyles.title}>Günlüğüm</Text>

                <View style={journalstyles.dateContainer}>
                    <Text style={journalstyles.label}>Tarih:</Text>
                    <Button
                        title={date.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        onPress={() => setShowDatePicker(true)}
                    />

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setDate(selectedDate);
                                }
                            }}
                        />
                    )}
                </View>

                <View style={journalstyles.titleContainer}>
                    <TextInput
                        style={journalstyles.textInput}
                        placeholder="Başlık"
                        placeholderTextColor="black"
                        value={journalTitle}
                        onChangeText={setJournalTitle}
                    />
                </View>

                <View style={journalstyles.journalContainer}>
                    <TextInput
                        style={journalstyles.textInput}
                        multiline
                        placeholder="Buraya günlüğünüzü yazın..."
                        placeholderTextColor="black"
                        value={journalContent}
                        onChangeText={setJournalContent}
                    />

                    {recordingUri ? (
                        <AudioPlayer
                            uri={recordingUri}
                            onRemove={removeAudio}
                        />
                    ) : null}

                    {imageUris.map((uri, index) => (
                        <View key={index} style={journalstyles.imageContainer}>
                            <Image
                                source={{ uri: uri }}
                                style={journalstyles.imageStyle}
                            />
                            <TouchableOpacity style={journalstyles.removeIcon} onPress={() => removeImage(index)}>
                                <Ionicons name="close-circle" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                    <TouchableOpacity style={journalstyles.cameraButton} onPress={openCamera}>
                        <Ionicons name="camera" size={32} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[journalstyles.cameraButton, { marginLeft: 20 }]}
                        onPressIn={startRecording}
                        onPressOut={stopRecording}
                    >
                        <Ionicons name="mic" size={32} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[journalstyles.cameraButton, { marginLeft: 20 }]}
                        onPress={openImagePicker}
                    >
                        <Ionicons name="images" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Button title="Günlüğü Kaydet" onPress={handleSave} />
            </ScrollView>
        </ImageBackground>
    );
};

export default JournalEntryScreen;

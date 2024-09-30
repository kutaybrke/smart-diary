import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LockScreen from './lockscreen';
import diarypagestyles from '../css/diarypagestyles';
import { useFocusEffect } from '@react-navigation/native';
const DiaryPage = ({ navigation }) => {
    const [isLocked, setIsLocked] = useState(true);
    const [entries, setEntries] = useState([]);
    const [error, setError] = useState(null);

    const fetchEntries = async () => {
        try {
            const response = await fetch('http://mevcut ipyi ekleyin:3000/api/journalpage');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            setEntries(data);
        } catch (error) {
            setError('Error fetching entries');
            console.error('Error fetching entries:', error);
        }
    };

    const deleteEntry = async (id) => {
        try {
            const response = await fetch(`http://mevcut ipyi ekleyin:3000/api/journalpage/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setEntries(entries.filter(entry => entry._id !== id));
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    const confirmDelete = (id) => {
        Alert.alert(
            'Sil',
            'Bu günlüğü silmek istediğinize emin misiniz?',
            [
                { text: 'Hayır', style: 'cancel' },
                { text: 'Evet', onPress: () => deleteEntry(id) },
            ]
        );
    };

    useFocusEffect(
        useCallback(() => {
            fetchEntries();
        }, [])
    );

    const renderEntry = ({ item }) => (
        <View style={diarypagestyles.entryContainer}>
            <TouchableOpacity
                style={diarypagestyles.entryContent}
                onPress={() => navigation.navigate('DiaryDetailPage', { entryId: item._id })}
            >
                <Text style={diarypagestyles.titleText}>{item.title}</Text>
                <Text style={diarypagestyles.entryText}>{item.content}</Text>
                <Text style={diarypagestyles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={diarypagestyles.deleteButton}
                onPress={() => confirmDelete(item._id)}
            >
                <Icon name="trash" size={30} color="black" />
            </TouchableOpacity>
        </View>
    );

    if (isLocked) {
        return <LockScreen onUnlock={() => setIsLocked(false)} />;
    }

    return (
        <ImageBackground
            source={require('../image/arkaplan.jpg')}
            style={diarypagestyles.container}
            blurRadius={1}
        >
            {error && <Text style={diarypagestyles.errorText}>{error}</Text>}
            <FlatList
                data={entries}
                keyExtractor={(item) => item._id}
                renderItem={renderEntry}
                numColumns={2}
                columnWrapperStyle={diarypagestyles.row}
            />
        </ImageBackground>
    );
};

export default DiaryPage;

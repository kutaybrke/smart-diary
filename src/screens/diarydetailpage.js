import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const DiaryDetailPage = () => {
    const [entry, setEntry] = useState(null);
    const route = useRoute();
    const { entryId } = route.params;

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                console.log('Fetching entry with ID:', entryId);
                const response = await fetch(`http://mevcut ipyi ekleyin:3000/api/journal/${entryId}`);
                const data = await response.json();
                console.log('Fetched data:', data);
                setEntry(data);
            } catch (error) {
                console.error('Error fetching entry:', error);
            }
        };

        fetchEntry();
    }, [entryId]);

    return (
        <ScrollView style={styles.container}>
            {entry ? (
                <>
                    <Text style={styles.content}>{entry.content}</Text>
                    <Text style={styles.date}>{new Date(entry.date).toLocaleDateString()}</Text>
                    {entry.image && (
                        <Image
                            source={{ uri: entry.image }}
                            style={styles.image}
                            resizeMode="contain"
                        />

                    )}
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    content: {
        fontSize: 20,
        color: '#333',
    },
    date: {
        marginTop: 10,
        fontSize: 14,
        color: '#888',
    },
    image: {
        width: '100%',
        height: 300,
        marginTop: 20,
        borderRadius: 8,
    },
});

export default DiaryDetailPage;

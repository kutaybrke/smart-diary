import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native'; 

const LineChartComponent = () => {
    const [data, setData] = useState({ labels: [], datasets: [{ data: [] }] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFocused = useIsFocused(); // sayfanın odaklanıp odaklanmadığını kontrol etmek için

    const screenWidth = Dimensions.get('window').width;

    const fetchSentimentData = async () => {
        try {
            const response = await fetch('http://Mevcut İPyi ekleyin:3000/api/sentiment');
            const result = await response.json();

            // Haftalık günler sıralaması Pazartesi'den başlayacak şekilde
            const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

            const sentimentScores = new Array(7).fill(0); 

            result.labels.forEach((date, index) => {
                const dateObj = new Date(date);
                const dayIndex = (dateObj.getDay() + 6) % 7;
                sentimentScores[dayIndex] = result.scores[index];
            });

            setData({
                labels: daysOfWeek,
                datasets: [
                    {
                        data: sentimentScores,
                        strokeWidth: 2,
                    },
                ],
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchSentimentData();
        }
    }, [isFocused]);

    const chartConfig = {
        backgroundGradientFrom: '#F5F5F5',
        backgroundGradientTo: '#F5F5F5',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
        decimalPlaces: 1,
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#48CFCB"
        }
    };


    return (
        <View>
            <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 16, paddingVertical: 10, fontWeight: 'bold' }}>
                Mood Değişimleri
            </Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={{ color: 'blue', textAlign: 'center' }}>{error}</Text>
            ) : (
                <LineChart
                    data={data}
                    width={screenWidth * 0.9}
                    height={200}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            )}
        </View>
    );
};

export default LineChartComponent;

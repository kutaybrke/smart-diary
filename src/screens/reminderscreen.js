import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Switch, TouchableOpacity, Modal, Pressable, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import styles from '../css/reminderscreenstyle';

const ReminderScreen = () => {
    const [reminders, setReminders] = useState([]);
    const [title, setTitle] = useState('');
    const [days, setDays] = useState([]);
    const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [selectedHour, setSelectedHour] = useState(new Date().getHours());
    const [selectedMinute, setSelectedMinute] = useState(new Date().getMinutes());
    const [showDayModal, setShowDayModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState(null);
    const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const response = await fetch('http://mevcut ipyi ekleyin:3000/api/reminders');
                if (!response.ok) {
                    throw new Error('Veriler alınamadı.');
                }
                const data = await response.json();
                setReminders(data);
            } catch (error) {
                Alert.alert('Hata', error.message);
            }
        };

        fetchReminders();
    }, []);

    useEffect(() => {
        const checkPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            setNotificationPermission(status);

            if (status !== 'granted') {
                const { status: newStatus } = await Notifications.requestPermissionsAsync();
                setNotificationPermission(newStatus);
                if (newStatus !== 'granted') {
                    Alert.alert('Bildirim izni gerekli!');
                }
            }
        };

        checkPermissions();
    }, []);

    const addReminder = async () => {
        if (!title || days.length === 0 || !isTimePickerVisible || !isDayPickerVisible) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        const newReminder = {
            title,
            days,
            time: `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`,
        };

        try {
            const response = await fetch('http://mevcut ipyi ekleyin:3000/api/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReminder),
            });

            if (!response.ok) {
                throw new Error('Hatırlatıcı eklenemedi.');
            }

            const data = await response.json();
            setReminders([...reminders, data]);
            await scheduleAlarm(data);

            setTitle('');
            setDays([]);
            setIsDayPickerVisible(false);
            setIsTimePickerVisible(false);
            setSelectedHour(new Date().getHours());
            setSelectedMinute(new Date().getMinutes());
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    const toggleSwitch = async (index) => {
        setReminders(prevReminders => {
            const updatedReminders = prevReminders.map((reminder, i) =>
                i === index ? { ...reminder, active: !reminder.active } : reminder
            );

            const reminder = updatedReminders[index];

            fetch(`http://mevcut ipyi ekleyin:3000/api/reminders/${reminder._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: reminder.active }),
            });

            updatedReminders.forEach(reminder => {
                if (reminder.active) {
                    scheduleAlarm(reminder);
                } else {
                    cancelAlarm(reminder);
                }
            });

            return updatedReminders;
        });
    };



    const toggleDay = (day) => {
        setDays((prevDays) => (prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]));
    };

    const scheduleAlarm = async (reminder) => {
        const [hour, minute] = reminder.time.split(':').map(Number);
        const weekdaysMap = {
            Pazar: 1,
            Pazartesi: 2,
            Salı: 3,
            Çarşamba: 4,
            Perşembe: 5,
            Cuma: 6,
            Cumartesi: 7,
        };
        if (!reminder.active) return; // switch kapalıysa bildirim gönderme

        // Her gün için planlama 
        for (const day of reminder.days) {
            const weekday = weekdaysMap[day];
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: reminder.title,
                    body: `Şimdi uygulamanızı açarak bugün yaşadığınız anıları günlüğünüze yazın.`,
                },
                trigger: {
                    hour,
                    minute,
                    repeats: true,
                    weekday,
                },
                identifier: reminder._id.toString(), 
            });


            await fetch(`http://mevcut ipyi ekleyin:3000/api/reminders/${reminder._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notificationId }),
            });
        }
    };

    const cancelAlarm = async (reminder) => {
        if (reminder.notificationId) {
            await Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
        }
    };

    return (
        <ImageBackground
            source={require('../image/alarm-image.jpg')}
            style={styles.container}
            blurRadius={2}
        >
            <View style={styles.overlayContainer}>
                <Text style={styles.header}>Hatırlatıcı</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Hatırlatıcı Başlığı"
                    value={title}
                    onChangeText={setTitle}
                />

                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Günleri Seç</Text>
                    <Switch
                        value={isDayPickerVisible}
                        onValueChange={() => {
                            setIsDayPickerVisible(prev => !prev);
                            if (!isDayPickerVisible) setShowDayModal(true);
                        }}
                    />
                </View>

                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Saati Seç</Text>
                    <Switch
                        value={isTimePickerVisible}
                        onValueChange={() => {
                            setIsTimePickerVisible(prev => !prev);
                            if (!isTimePickerVisible) setShowTimeModal(true);
                        }}
                    />
                </View>

                <Modal transparent={true} visible={showDayModal} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Gün Seçin</Text>
                            <View style={styles.daysContainer}>
                                {daysOfWeek.map(day => (
                                    <TouchableOpacity
                                        key={day}
                                        style={[styles.dayButton, days.includes(day) ? styles.dayButtonSelected : null]}
                                        onPress={() => toggleDay(day)}
                                    >
                                        <Text style={styles.dayText}>{day}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.modalButtons}>
                                <Pressable style={styles.modalButton} onPress={() => setShowDayModal(false)}>
                                    <Text style={styles.modalButtonText}>Tamam</Text>
                                </Pressable>
                                <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowDayModal(false)}>
                                    <Text style={styles.modalButtonText}>İptal</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal transparent={true} visible={showTimeModal} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Saat Seçin</Text>
                            <View style={styles.pickerContainer}>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={selectedHour}
                                        style={styles.picker}
                                        onValueChange={itemValue => setSelectedHour(itemValue)}
                                    >
                                        {[...Array(24).keys()].map(hour => (
                                            <Picker.Item key={hour} label={`${String(hour).padStart(2, '0')}`} value={hour} />
                                        ))}
                                    </Picker>
                                </View>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={selectedMinute}
                                        style={styles.picker}
                                        onValueChange={itemValue => setSelectedMinute(itemValue)}
                                    >
                                        {[...Array(60).keys()].map(minute => (
                                            <Picker.Item key={minute} label={`${String(minute).padStart(2, '0')}`} value={minute} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.modalButtons}>
                                <Pressable style={styles.modalButton} onPress={() => setShowTimeModal(false)}>
                                    <Text style={styles.modalButtonText}>Tamam</Text>
                                </Pressable>
                                <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowTimeModal(false)}>
                                    <Text style={styles.modalButtonText}>İptal</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                {isTimePickerVisible && (
                    <View>
                        <Text style={styles.selectedTime}>Seçilen Saat: {`${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`}</Text>
                    </View>
                )}

                {isDayPickerVisible && (
                    <View>
                        <Text style={styles.selectedDays}>Seçilen Günler: {days.length > 0 ? days.join(', ') : 'Hiçbir gün seçilmedi'}</Text>
                    </View>
                )}

                <Button title="Hatırlatıcı Ekle" onPress={addReminder} />

                <FlatList
                    data={reminders}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.reminderItem}>
                            <View style={styles.reminderInfo}>
                                <Text style={styles.reminderTitle}>{item.title}</Text>
                                <Text>{item.days?.join(', ') || 'Hiçbir gün seçilmedi'}</Text>
                                <Text>{`Saat: ${item.time}`}</Text>
                            </View>
                            <Switch
                                value={item.active}
                                onValueChange={() => toggleSwitch(index)}
                            />
                        </View>
                    )}
                />
            </View>
        </ImageBackground>
    );
};

export default ReminderScreen;

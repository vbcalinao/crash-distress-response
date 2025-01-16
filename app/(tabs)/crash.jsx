import { StyleSheet, Text, Modal, View, TouchableOpacity, Alert } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState, useEffect } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import axios from 'axios';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';

export default function TabThreeScreen() {
    const [accelerometerPermission, setAccelerometerPermission] = useState(null);
    const [gyroscopePermission, setGyroscopePermission] = useState(null);
    const [isFalling, setIsFalling] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [warningModal, setWarningModal] = useState(false);
    const { name, contact } = useGlobalContext();
    const isFocused = useIsFocused();

    const API_KEY = 'c67e7f95';

    async function sendSMS() {
        if (name.trim() === '') {
            setWarningModal(true);
            return;
        }

        if (contact === 0) {
            setWarningModal(true);
            return;
        }

        try {
            const response = await axios.post('https://rest.nexmo.com/sms/json', {
                api_key: API_KEY,
                api_secret: 'ysV9yVARRLAACPVH',
                to: '63' + contact,
                from: 'Vonage API',
                text: `You've been an emergency contact by ${name} in the Angkas app. A crash has been detected at the following location: https://maps.app.goo.gl/d46PKyC3PTbkkPDr9`,
            });

            if (response.data.messages[0].status === '0') {
                console.log('Message sent successfully!');
                return true;
            } else {
                console.error('Failed to send message:', response.data.messages[0]['error-text']);
                return false;
            }
        } catch (error) {
            console.error('Error sending SMS:', error);
            return false;
        }
    }

    async function requestPermission() {
        try {
            const accelerometer = await Accelerometer.requestPermissionsAsync();
            const gyroscope = await Gyroscope.requestPermissionsAsync();
            setAccelerometerPermission(accelerometer.status);
            setGyroscopePermission(gyroscope.status);

            if (accelerometer.status !== 'granted') {
                Alert.alert('Permission Required', 'Please enable accelerometer access in settings.', [{ text: 'OK' }]);
            } else if (gyroscope.status !== 'granted') {
                Alert.alert('Permission Required', 'Please enable gyroscope access in settings.', [{ text: 'OK' }]);
            }
        } catch (err) {
            console.error('Failed to request permission', err);
        }
    }

    useEffect(() => {
        if (isFocused) {
            requestPermission();

            let accelerometerSubscription;
            let gyroscopeSubscription;

            // Set up accelerometer to detect phone falling
            Accelerometer.setUpdateInterval(100);
            accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
                const acceleration = Math.sqrt(x * x + y * y + z * z);

                if (acceleration < 0.6) {
                    sendSMS();
                }
            });

            // Set up gyroscope to enhance fall detection
            Gyroscope.setUpdateInterval(100);
            gyroscopeSubscription = Gyroscope.addListener(({ x, y, z }) => {
                const rotation = Math.sqrt(x * x + y * y + z * z);

                if (rotation > 10) {
                    sendSMS();
                }
            });

            return () => {
                // Cleanup subscriptions when the tab is unfocused
                accelerometerSubscription && accelerometerSubscription.remove();
                gyroscopeSubscription && gyroscopeSubscription.remove();
            };
        } else {
            // Clean up if tab is not focused
            setIsFalling(false);
            setModalVisible(false);
        }
    }, [isFocused]);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="exclamationmark.brakesignal"
                    style={styles.headerImage}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Crash Detection</ThemedText>
            </ThemedView>
            <ThemedText>This app includes example code to help you get started.</ThemedText>

            <Text style={styles.permissionText}>
                Accelerometer Permission: {accelerometerPermission}
            </Text>
            <Text style={styles.permissionText}>
                Gyroscope Permission: {gyroscopePermission}
            </Text>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Warning: Phone is falling!</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={warningModal}
                onRequestClose={() => setWarningModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            You must put an emergency contact in the app.
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                router.push('/emergency');
                                setWarningModal(false);
                            }}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    permissionText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

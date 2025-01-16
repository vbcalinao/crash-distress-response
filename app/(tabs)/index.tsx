import { Image, StyleSheet, Platform } from 'react-native';

import { Ambulance } from '@/components/Ambulance';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                {/* Edit */}
                <ThemedText type="title">Crash Distress Response</ThemedText>
                <Ambulance />
            </ThemedView>
            <ThemedText>
                This crash and distress emergency app is an experimental
                demonstration feature exclusively for Angkas Hacky Holidays
                2025.
            </ThemedText>
            <ThemedView style={styles.stepContainer}>
                {/* Edit */}
                <ThemedText type="subtitle">
                    Step 1: Add an Emergency Contact
                </ThemedText>
                <ThemedText>
                    In the{' '}
                    <ThemedText type="defaultSemiBold">Emergency</ThemedText>{' '}
                    group tab in the bottom, add the name and the contact number
                    of your trusted contact in case of emergency. Tap{' '}
                    <ThemedText type="defaultSemiBold">
                        {Platform.select({
                            ios: 'save',
                            android: 'save',
                            web: 'save',
                        })}
                    </ThemedText>{' '}
                    to finish.
                </ThemedText>
            </ThemedView>

            {/* Edit */}
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 2: Crash Detection</ThemedText>
                <ThemedText>
                    In the{' '}
                    <ThemedText type="defaultSemiBold">
                        Crash Detection
                    </ThemedText>
                    tab, the app will request consent for sensor access to
                    continuously monitor your ride. It will then automatically
                    detect if there's a hard crash. In this version, it was
                    tuned to detect slight hard fall for demonstration purposes
                    only.
                </ThemedText>
                <ThemedText>
                    If you have emergency contact saved, it will notify the
                    detected incident and current location address through SMS.
                </ThemedText>
            </ThemedView>

            {/* Edit */}
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 3: Distress Voice</ThemedText>
                <ThemedText>
                    In the{' '}
                    <ThemedText type="defaultSemiBold">
                        Distress Voice
                    </ThemedText>{' '}
                    tab, the app will request consent for microphone access to
                    continuously monitor your ride. If it detects the word
                    “tulong,” it will immediately send an SMS alert to your
                    emergency contact.
                </ThemedText>
                <ThemedText>
                    It will notify your emergency contact through SMS with the
                    detected incident and your current location address.
                </ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});

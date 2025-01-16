import {
    StyleSheet,
    Platform,
    Alert,
    TouchableOpacity,
    Text,
    View,
    KeyboardAvoidingView,
} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';

export default function TabTwoScreen() {
    const { name, setName, contact, setContact } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const validateForm = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name is required.');
            return false;
        }

        if (name.trim().length < 3) {
            Alert.alert('Error', 'Name should be at least 3 characters long.');
            return false;
        }

        if (!contact.trim()) {
            Alert.alert('Error', 'Contact number is required.');
            return false;
        }

        return true;
    };

    const submit = () => {
        setIsSubmitting(true);
        try {
            if (!validateForm()) {
                return;
            }

            Alert.alert('Success', 'Emergency contact added successfully');
            setIsSaved(true);
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleEdit = () => {
        setIsSaved(!isSaved);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            // iOS uses 'padding' or 'position', while Android typically works well with 'height'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // If you’re using a navigation header or SafeAreaView, adjust the offset if necessary:
            keyboardVerticalOffset={0}
        >
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={
                    <IconSymbol
                        size={310}
                        color="#808080"
                        name="plus.app"
                        style={styles.headerImage}
                    />
                }
            >
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Emergency Contact</ThemedText>
                </ThemedView>
                <ThemedText>Please add your emergency contact.</ThemedText>

                <FormField
                    title="Name"
                    placeholder="John Doe"
                    value={name}
                    handleChangeText={(e) => setName(e)}
                    otherStyles="mt-7"
                    editable={!isSaved}
                />
                <FormField
                    title="Contact Number"
                    placeholder={`+63 ${isSaved ? contact : ''}`}
                    handleChangeText={(e) => {
                        let contact = e.toString().trim();
                        if (contact.startsWith('9')) {
                            contact = '63' + contact;
                        } else if (contact.startsWith('0')) {
                            contact = '63' + contact.slice(1);
                        } else if (contact.startsWith('63')) {
                            contact = contact;
                        }

                        setContact(contact);
                    }}
                    otherStyles="mt-7"
                    keyboardType="numeric"
                    editable={!isSaved}
                />

                <View style={styles.buttonContainer}>
                    {/* Save Button */}
                    <CustomButton
                        title="Save"
                        handlesPress={submit}
                        containerStyle={
                            isSaved
                                ? styles.buttonDisabled
                                : styles.buttonActive
                        }
                        isLoading={isSubmitting}
                        disabled={isSaved || isSubmitting}
                    />

                    {isSaved && (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={toggleEdit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.editButtonText}>
                                {isSaved ? 'Edit' : 'Cancel'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ParallaxScrollView>
        </KeyboardAvoidingView>
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
    container: {
        flex: 1,
        padding: 16,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    editButton: {
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderRadius: 16,
        width: '100%',
    },
    editButtonText: {
        fontSize: 18,
        color: '#black',
        fontFamily: 'Poppins-Semibold',
    },
    buttonActive: {
        backgroundColor: '#4CAF50', // Active color for save button
    },
    buttonDisabled: {
        backgroundColor: '#B0BEC5', // Disabled color for save button
    },
});

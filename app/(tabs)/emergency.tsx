import { StyleSheet, Platform, Alert, KeyboardAvoidingView } from 'react-native';
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

        if (!contact.toString().trim()) {
            Alert.alert('Error', 'Contact number is required.');
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(contact.toString().trim())) {
            Alert.alert('Error', 'Please enter a valid 10-digit contact number.');
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

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            // iOS uses 'padding' or 'position', while Android typically works well with 'height'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // If you’re using a navigation header or SafeAreaView, adjust the offset if necessary:
            keyboardVerticalOffset={0}
        >
            <ParallaxScrollView
                keyboardShouldPersistTaps="handled"
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
                    handleChangeText={(e) => setContact(63 + Number(e))}
                    otherStyles="mt-7"
                    keyboardType="numeric"
                    editable={!isSaved}
                />

                <CustomButton
                    title="Save"
                    handlesPress={submit}
                    containerStyle={
                        isSaved ? styles.buttonDisabled : styles.buttonActive
                    }
                    isLoading={isSubmitting}
                    disabled={isSaved || isSubmitting}
                />
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
    buttonActive: {
        backgroundColor: '#3B82F6',
    },
    buttonDisabled: {
        backgroundColor: '#D1D5DB',
    },
});

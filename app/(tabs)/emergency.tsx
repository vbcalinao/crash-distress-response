import { StyleSheet, Platform, Alert } from 'react-native';
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
      console.log(name, contact);
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Emergency Contact</ThemedText>
      </ThemedView>
      <ThemedText>Please add your emergency contact.</ThemedText>

      <FormField
        title="Name"
        placeholder='John Doe'
        value={name}
        handleChangeText={(e) => setName(e)} 
        otherStyles="mt-7"
      />
      <FormField
        title="Contact Number"
        placeholder={`+63`}
        handleChangeText={(e) => setContact(63+Number(e))} 
        otherStyles="mt-7"
        keyboardType="numeric"
      />

      <CustomButton
        title="Save"
        handlesPress={submit}
        containerStyle="mt-7"
        isLoading={isSubmitting}
      />
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
});

import { View, Text, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { useState } from 'react';

interface FormFieldProps {
    title: string;
    value?: string;
    placeholder?: string;
    handleChangeText: (text: string) => void;
    otherStyles?: any;
    editable?: boolean;
    [key: string]: any;
}

const FormField: React.FC<FormFieldProps> = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    editable,
    ...props
}) => {
    const colorScheme = useColorScheme();

    const isDarkMode = colorScheme === 'dark';

    return (
        <View style={[styles.container, otherStyles]}>
            <Text style={[styles.title, { color: isDarkMode ? '#E5E5E5' : '#333' }]}>
                {title}
            </Text>
            <View style={[styles.inputContainer, { borderColor: isDarkMode ? '#666' : '#E5E5E5', backgroundColor: isDarkMode ? '#333' : '#f9f9f9' }]}>
                <TextInput
                    editable={editable}
                    style={[styles.input, { color: isDarkMode ? '#fff' : '#333' }]}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={handleChangeText}
                    placeholderTextColor={isDarkMode ? '#ccc' : '#aaa'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Poppins',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 64,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderRadius: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins-Semibold',
    },
});

export default FormField;

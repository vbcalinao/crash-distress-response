import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

interface CustomButtonProps {
    title: string;
    handlesPress: () => void;
    containerStyle?: any;
    textStyle?: any;
    isLoading?: boolean;
    disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    handlesPress,
    containerStyle,
    textStyle,
    isLoading,
    disabled,
}) => {
    return (
        <TouchableOpacity
            onPress={handlesPress}
            disabled={isLoading || disabled}
            activeOpacity={0.7}
            style={[
                styles.buttonContainer,
                containerStyle,
                isLoading && styles.loading,
            ]}
        >
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderRadius: 16,
        backgroundColor: '#61F2FF',
        width: '100%',
    },
    loading: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 18,
        color: '#black',
        fontFamily: 'Poppins-Semibold',
    },
});

export default CustomButton;

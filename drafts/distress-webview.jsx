import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function DistressScreen() {
  // Replace this URL with your actual Edge Impulse project URL
  const edgeImpulseUrl = 'https://smartphone.edgeimpulse.com/classifier.html?apiKey=ei_1a64ff09eb7218d68ab068fbee362b49bb5dde2636de7af6bb8a06bf81287325&impulseId=3';

  return (
    <View style={styles.container}> 
      <WebView 
        source={{ uri: edgeImpulseUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
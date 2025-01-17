import React, { useState, useRef } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useGlobalContext } from '@/context/GlobalProvider';

export default function DistressScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { name, contact } = useGlobalContext();
  const edgeImpulseUrl = 'https://smartphone.edgeimpulse.com/classifier.html?apiKey=ei_1a64ff09eb7218d68ab068fbee362b49bb5dde2636de7af6bb8a06bf81287325&impulseId=3';
  
  // Use refs to maintain state between renders
  const isRequestInProgress = useRef(false);
  const lastTulongValue = useRef(0);
  const lastRequestTime = useRef(0);
  const COOLDOWN_PERIOD = 30000; // 30 seconds cooldown
  const lastLogTime = useRef(0);
  const LOG_COOLDOWN = 5000; // Only log every 5 seconds

  async function sendSMS() {
    const currentTime = Date.now();
    
    // Check if we're still in cooldown period
    if (currentTime - lastRequestTime.current < COOLDOWN_PERIOD) {
      // Only log message every 5 seconds to reduce spam
      if (currentTime - lastLogTime.current >= LOG_COOLDOWN) {
        console.log('In cooldown period, please wait...');
        lastLogTime.current = currentTime;
      }
      return;
    }

    // Check if a request is already in progress
    if (isRequestInProgress.current) {
      return;
    }

    isRequestInProgress.current = true;
    lastRequestTime.current = currentTime;

    try {
      const encodedParams = `is_primary=true&message=${encodeURIComponent(
        `${name}, you have been designated by Victor as an emergency contact in the Angkas app. A distress call has been detected in this loc: https://maps.app.goo.gl/d46PKyC3PTbkkPDr9!`
      )}&message_type=ARN&account_lifecycle_event=update&phone_number=${contact}`;

      const options = {
        method: 'POST',
        url: 'https://rest-ww.telesign.com/v1/messaging',
        headers: {
          accept: 'application/json',
          'content-type': 'application/x-www-form-urlencoded',
          authorization: `Basic ${process.env.TELESIGN_AUTH}`,
        },
        data: encodedParams,
      };

      const response = await axios.request(options);
      if (response) {
        setModalVisible(true);
      }
      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error sending SMS:', error);
    } finally {
      isRequestInProgress.current = false;
    }
  }

  const injectedJavaScript = `
    (function() {
      let lastSentValue = 0;
      let lastSentTime = 0;
      const MINIMUM_INTERVAL = 30000; // 30 seconds between checks
      const TULONG_THRESHOLD = 0.90; // Set threshold to 0.90 (90%)
      
      setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - lastSentTime < MINIMUM_INTERVAL) {
          return; // Skip if we haven't waited long enough
        }

        const rows = document.querySelectorAll('table tr');
        let maxTulongValue = 0;
        
        // Find the maximum "tulong" value from the table
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) {
            const tulongValue = parseFloat(cells[1].textContent);
            if (!isNaN(tulongValue) && tulongValue > maxTulongValue) {
              maxTulongValue = tulongValue;
            }
          }
        });

        // Only trigger if the maximum "tulong" value exceeds our threshold
        if (maxTulongValue >= TULONG_THRESHOLD && maxTulongValue !== lastSentValue) {
          console.log('Tulong detected with value:', maxTulongValue);
          lastSentValue = maxTulongValue;
          lastSentTime = currentTime;
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'tulong_detected',
            value: maxTulongValue
          }));
        }
      }, 1000);
    })();
  `;

  const onMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'tulong_detected' && data.value !== lastTulongValue.current) {
        lastTulongValue.current = data.value;
        await sendSMS();
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: edgeImpulseUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Emergency! A distress call has been detected!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
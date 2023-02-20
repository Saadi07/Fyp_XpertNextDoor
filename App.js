import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/SplashScreen';

import RootStackScreen from './screens/RootStackScreen';

export default function App() {
  const [stack, setStack] = useState();

  useEffect(() => {
    const getUserDetails = async () => {
      const getUser = await AsyncStorage.getItem('user');
      const userData = JSON.parse(getUser);
      if (userData) {
        setStack(userData.role);
      } else {
        setStack('Root');
      }
    };
    setTimeout(() => {
      getUserDetails();
    }, 3000);
  }, []);

  return (
    <PaperProvider style={styles.container}>
      <StatusBar backgroundColor="#FF6347" barStyle="light-content" />
      {stack ? <RootStackScreen user={stack} /> : <SplashScreen />}
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6347',
  },
});

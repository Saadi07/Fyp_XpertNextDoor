/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';

const Dots = ({selected}) => {
  let backgroundColor;

  backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

const Skip = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 16, color: 'black'}}>Skip</Text>
  </TouchableOpacity>
);

const Next = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 16, color: 'black'}}>Next</Text>
  </TouchableOpacity>
);

const Done = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 16, color: 'black'}}>Done</Text>
  </TouchableOpacity>
);

const OnboardingScreen = ({navigation}) => {
  return (
    <>
      <StatusBar hidden={false} />
      <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        onSkip={() => Alert.alert('Start Indentification')}
        onDone={() => {
          navigation.navigate('FaceDectectionScreen');
        }}
        pages={[
          {
            backgroundColor: '#ffffff',
            image: <Image source={require('../assets/1.png')} />,
            title: 'Get ID document ready',
            subtitle:
              'Before you start make sure your passport, driver licence is with you',
          },
          {
            backgroundColor: '#ffffff',
            image: <Image source={require('../assets/2.png')} />,
            titleStyles: {color: 'black'},
            subTitleStyles: {color: 'black'},
            title: 'Take a selfie',
            subtitle:
              'Your face has to be well lit. Make sure you dont have any background light',
          },
          {
            backgroundColor: '#ffffff',
            image: <Image source={require('../assets/3.png')} />,
            title: 'Scan your ID document',
            subtitle: 'Let The Spot Light Capture You',
          },
        ]}
      />
    </>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

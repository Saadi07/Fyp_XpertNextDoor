/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {useRef, useState, useEffect} from 'react';
const NewOtp = ({navigation}) => {
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();

  const [otp, setOtp] = useState('');

  var BASE_URL = 'https://verify-3634-qd67vq.twil.io';
  const sendSmsVerification = async phoneNumber => {
    try {
      const data = JSON.stringify({
        to: '+923009621731',
        channel: 'sms',
      });

      const response = await fetch(`${BASE_URL}/start-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });

      const json = await response.json();
      console.log('res', json.success);
      return json.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const checkVerification = async (phoneNumber, code) => {
    try {
      const data = JSON.stringify({
        to: '+923009621731',
        code: otp,
      });

      const response = await fetch(`${BASE_URL}/check-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });

      const json = await response.json();
      console.log(json);
      return json.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    sendSmsVerification();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>OTP Verification</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.content}>
            Enter the OTP number just sent you at{' '}
            <Text style={styles.phoneNumberText}>03009621681</Text>
          </Text>
          <View style={styles.otpContainer}>
            <View style={styles.otpBox}>
              <TextInput
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={firstInput}
                onChangeText={text => {
                  setOtp(otp + '' + text);
                  text && secondInput.current.focus();
                }}
              />
            </View>
            <View style={styles.otpBox}>
              <TextInput
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={secondInput}
                onChangeText={text => {
                  setOtp(otp + '' + text);
                  text
                    ? thirdInput.current.focus()
                    : firstInput.current.focus();
                }}
              />
            </View>
            <View style={styles.otpBox}>
              <TextInput
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={thirdInput}
                onChangeText={text => {
                  setOtp(otp + '' + text);
                  text
                    ? fourthInput.current.focus()
                    : secondInput.current.focus();
                }}
              />
            </View>
            <View style={styles.otpBox}>
              <TextInput
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={fourthInput}
                onChangeText={text => {
                  setOtp(otp + '' + text);
                  !text && thirdInput.current.focus();
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.verify}
            onPress={() =>
              //checkVerification()
              {
                navigation.navigate('MainTabScreen');
              }
            }>
            <LinearGradient
              colors={['#FFA07A', '#FF6347']}
              style={styles.verify}>
              <Text
                style={[
                  styles.textVerify,
                  {
                    color: '#fff',
                  },
                ]}>
                Verify
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6347',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  footer: {
    flex: 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 20 * 1.4,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 5,
    color: '#05375a',
  },
  content: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 5,
    color: '#05375a',
  },
  phoneNumberText: {
    fontSize: 18,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 18 * 1.4,
    color: Colors.DEFAULT_YELLOW,
  },
  otpContainer: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpBox: {
    borderRadius: 5,
    borderColor: '#FF6347',
    borderWidth: 0.7,
  },
  otpText: {
    fontSize: 25,
    color: Colors.DEFAULT_BLACK,
    padding: 0,
    textAlign: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  verify: {
    width: 325,
    height: 50,
    marginRight: 15,
    marginLeft: 11.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textVerify: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NewOtp;

/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import RadioButtonRN from 'radio-buttons-react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import Loader from '../components/Loader';

const SignUnScreen = ({navigation}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState({
    name: '',
    mobile: '',
    password: '',
    confirm_password: '',
    role: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidNo: true,
    isValideName: true,
    isValidPassword: true,
    isValidConfrimPassword: true,
    confirm_secureTextEntry: true,
  });

  var radio_props = [
    {label: 'Client', value: 'client'},
    {label: 'Tasker', value: 'tasker'},
  ];

  const textInputChange = val => {
    if (val.length === 11) {
      setData({
        ...data,
        mobile: val,
        check_textInputChange: true,
        isValidNo: true,
      });
    } else {
      setData({
        ...data,
        mobile: val,
        check_textInputChange: false,
        isValidNo: false,
      });
    }
  };

  const handleNameChange = val => {
    if (val.length > 0) {
      setData({...data, name: val, isValideName: true});
    } else {
      setData({...data, name: val, isValideName: false});
    }
  };

  const setUserRole = val => {
    setData({
      ...data,
      role: val.value,
    });
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const handleConfirmPasswordChange = val => {
    //console.log(data.password);
    if (val === data.password) {
      setData({
        ...data,
        confirm_password: val,
        isValidConfrimPassword: true,
      });
    } else {
      setData({
        ...data,
        confirm_password: val,
        isValidConfrimPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry,
    });
  };

  const handleValidUser = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const HandleSignup = () => {
    if (data.name === '' || data.loginId === '' || data.password === '') {
      setShowAlert(true);
      setAlertTitle('Request Failed');
      setAlertMessage('All fields are mandatory!');
    } else {
      const credentials = {
        name: data.name,
        mobile: data.mobile,
        password: data.password,
      };
      console.log(data.role);
      const url = `https://gentle-oasis-88778.herokuapp.com/${data.role}/signup`;
      console.log(url);
      console.log(credentials);
      if (!data.isValideName || data.name.length === 0) {
        setShowAlert(true);
        setAlertTitle('Request Failed');
        setAlertMessage('Name field is required!');
      } else if (!data.isValidNo || data.mobile.length === 0) {
        setShowAlert(true);
        setAlertTitle('Request Failed');
        setAlertMessage('Mobile Number is not valid!');
      } else if (!data.isValidPassword || data.password.length === 0) {
        setShowAlert(true);
        setAlertTitle('Request Failed');
        setAlertMessage('Password is not valid!');
      } else if (
        !data.isValidConfrimPassword ||
        data.confirm_password.length === 0
      ) {
        setShowAlert(true);
        setAlertTitle('Request Failed');
        setAlertMessage('Confirm password does not match!');
      } else {
        setLoading(() => true);
        axios
          .post(url, credentials)
          .then(response => {
            const result = response.data;
            const {status, message, data} = result;
            setLoading(() => false);
            if (status !== 'SUCCESS') {
              setShowAlert(true);
              setAlertTitle('Request Failed');
              setAlertMessage(message);
            } else if (status === 'SUCCESS') {
              setShowAlert(true);
              setAlertTitle('Success');
              setAlertMessage(message);
            }
          })
          .catch(function (error) {
            setLoading(() => false);
            setShowAlert(true);
            setAlertTitle('Request Failed');
            setAlertMessage('Request Failed, try again later!');
          });
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6347" barStyle="light-content" />
      <Loader loading={loading} />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Okay"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          <Text style={[styles.text_footer]}>Name</Text>
          <View style={styles.nameAction}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter Your Name"
              placeholderTextColor="#666666"
              style={[styles.textInput]}
              autoCapitalize="none"
              onChangeText={val => handleNameChange(val)}
            />
          </View>
          <Text style={styles.text_footer}>Mobile No.</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Mobile Number"
              style={styles.textInput}
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={val => textInputChange(val)}
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {data.isValidNo ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Mobile Number must be 11 digits long.
              </Text>
            </Animatable.View>
          )}

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}>
            Password
          </Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Password"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handlePasswordChange(val)}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {data.isValidPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Password must be 8 characters long.
              </Text>
            </Animatable.View>
          )}

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}>
            Confirm Password
          </Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Confirm Your Password"
              secureTextEntry={data.confirm_secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handleConfirmPasswordChange(val)}
            />
            <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {data.isValidConfrimPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>Password does not match</Text>
            </Animatable.View>
          )}
          <View>
            <RadioButtonRN
              data={radio_props}
              activeColor="#FF6347"
              initial={1}
              selectedBtn={e => setUserRole(e)}
              icon={
                <FontAwesome name="check-circle" size={25} color="#FF6347" />
              }
            />
          </View>
          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>
              By signing up you agree to our
            </Text>
            <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>
              {' '}
              Terms of service
            </Text>
            <Text style={styles.color_textPrivate}> and</Text>
            <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>
              {' '}
              Privacy policy
            </Text>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                HandleSignup();
              }}>
              <LinearGradient
                colors={['#FFA07A', '#FF6347']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Sign Up
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.signIn,
                {
                  borderColor: '#FF6347',
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#FF6347',
                  },
                ]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default SignUnScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6347',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
    elevation: 0,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
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
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  nameAction: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    marginBottom: 35,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  color_textPrivate: {
    color: 'grey',
  },

  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
});

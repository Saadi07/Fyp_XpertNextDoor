/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  BackHandler,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import RadioButtonRN from 'radio-buttons-react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import Loader from '../components/Loader';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import {AuthContext} from '../components/context';

const SignInScreen = ({navigation}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState({
    mobile: '',
    password: '',
    role: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  var radio_props = [
    {label: 'Client', value: 'client'},
    {label: 'Tasker', value: 'tasker'},
  ];

  //const {signIn} = React.useContext(AuthContext);

  const textInputChange = val => {
    if (val.length === 11) {
      setData({
        ...data,
        mobile: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        mobile: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
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

  const setUserRole = val => {
    setData({
      ...data,
      role: val.value,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
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

  const storeUserData = async user => {
    try {
      //console.log("Hello", cust);
      user.role = data.role;
      console.log(user);
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem('user', jsonValue);
    } catch (e) {
      console.log('Error', e);
    }
  };

  // login function
  const Handlelogin = () => {
    if (data.mobile === '' || data.password === '') {
      setAlertMessage('All fields are mandatory!');
      setShowAlert(true);
    } else {
      const credentials = {
        loginId: data.mobile,
        password: data.password,
      };
      var role = data.role;
      console.log(credentials);
      // const url = `https://localhost:3000/${data.role}/signin`;
      const url = `https://gentle-oasis-88778.herokuapp.com/${data.role}/signin`;
      console.log(url);
      if (!data.isValidUser || data.mobile.length === 0) {
        setAlertMessage('Mobile Number is not valid!');
        setShowAlert(true);
      } else if (!data.isValidPassword || data.password.length === 0) {
        setAlertMessage('Password is not valid!');
        setShowAlert(true);
      } else {
        setLoading(() => true);
        axios
          .post(url, credentials)
          .then(response => {
            const result = response.data;
            const {status, message, data} = result;
            setLoading(() => false);
            if (status === 'SUCCESS' && role === 'client') {
              storeUserData(data);
              navigation.navigate('ClientStack');
            } else if (status === 'SUCCESS' && role === 'tasker') {
              storeUserData(data);
              navigation.navigate('TaskerStack');
            } else {
              setAlertMessage('Login Failed! do you have any account?');
              setShowAlert(true);
            }
          })
          .catch(function (error) {
            setLoading(() => false);
            setAlertMessage('Request Failed ' + error.message);
            setShowAlert(true);
            console.log(error.message);
          });
      }
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <>
        <Loader loading={loading} />
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Request Failed"
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
          <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View animation="fadeInUpBig" style={[styles.footer]}>
          <ScrollView>
            <Text style={[styles.text_footer]}>Mobile No</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                placeholder="Your Mobile No"
                placeholderTextColor="#666666"
                style={[styles.textInput]}
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={val => textInputChange(val)}
                onEndEditing={e => handleValidUser(e.nativeEvent.text)}
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            {data.isValidUser ? null : (
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
                placeholderTextColor="#666666"
                secureTextEntry={data.secureTextEntry ? true : false}
                style={[styles.textInput]}
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

            <TouchableOpacity>
              <Text style={{color: '#FF6347', marginTop: 15}}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => {
                  //storeUserData({});
                  //setRendererClient(() => true);
                  Handlelogin();
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
                    Sign In
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('SignUpScreen')}
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
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animatable.View>
      </>
    </View>
  );
};

export default SignInScreen;

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
  },
  footer: {
    flex: 3,
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
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
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
});

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
//import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {locationPermission, getCurrentLocation} from '../helper/HelperFunction';

var estimatedPrice = 0;

const CostEstimation = ({navigation, route}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [user, setUser] = useState({});
  const [location, setLocation] = useState({});

  const [city, setCity] = useState('');
  const [expertise, setExpertise] = useState('');
  //const today = new Date().toDateString();
  const [date, setDate] = useState(new Date().toDateString());
  const [time, setTime] = useState();
  const [openCity, setOpenCity] = useState(false);
  const [openExpertise, setOpenExpertise] = useState(false);
  //const [estimatedPrice, setEstimatedPrice] = useState(0);
  const citiesDropdown = [
    {label: 'Lahore', value: 'lahore'},
    {label: 'Islamabad', value: 'islamabad'},
    {label: 'Karachi', value: 'karachi'},
  ];

  const expertiseDropdown = [
    {label: 'Low', value: 'low'},
    {label: 'Medium', value: 'medium'},
    {label: 'High', value: 'High'},
  ];

  const [category, setCategory] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  function handleDateConfirm(date1) {
    setDate(date1.toDateString());
    hideDatePicker();
  }

  function handleTimeConfirm(time1) {
    //console.log(time1);
    setTime(FormatDate(time1));
    hideTimePicker();
  }

  const FormatDate = data => {
    var hours = data.getHours();
    var minutes = data.getMinutes();
    var dateTimeString = hours + ':' + minutes;
    return dateTimeString;
  };

  const getRecommendedPrice = () => {
    try {
      var body = {
        work_time: time,
        work_type: category,
        worker_expertise: expertise,
        work_city: city,
        work_date: date,
      };
      console.log(body);
      const url = 'http://192.168.43.36:5000/estimate_price';
      axios
        .post(url, body)
        .then(async response => {
          console.log(response.data.data);
          estimatedPrice = response.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    const userId = await AsyncStorage.getItem('user');
    const userData = JSON.parse(userId);
    setUser(userData);
  };

  const getLiveLocation = async () => {
    const locPermission = await locationPermission();
    console.log(locPermission);
    if (locPermission) {
      const {lat, lng, heading} = await getCurrentLocation();
      console.log('get live location after 4 second', lat);
      setLocation({...location, latitude: lat, longitude: lng});
      console.log(location);
    }
  };

  useEffect(() => {
    setTime(FormatDate(new Date()));
    getLiveLocation();
  }, []);

  useEffect(() => {
    getUser();
    setCategory(() => route.params.category);
  }, [date, route.params]);

  async function placeOrder() {
    try {
      var body = {
        clientID: user.loginId,
        category: category,
        location: location,
        description: '',
        estimatedPrice: estimatedPrice,
        // location,
        // description,
        // estimatedPrice,
      };
      console.log(body);
      const response = await axios
        .post(
          'https://gentle-oasis-88778.herokuapp.com/client/placeOrder/',
          body,
        )
        .then(res => {
          console.log('res', res.data.data._id);
          if (res.data.status === 'SUCCESS') {
            navigation.navigate('MatchTaskerScreen', {
              orderId: res.data.data._id,
              price: estimatedPrice,
            });
          } else {
            alert(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
      var res = response.data.data;
      //console.log('Response', res);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Request Failed"
        message={'Worker Expertise and city must be selected!'}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Okay"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.container}>
          <Text style={{color: 'black', fontSize: 32, fontWeight: 'bold'}}>
            Find Tasker!
          </Text>
          <Text style={{color: 'grey', fontSize: 18, marginVertical: 10}}>
            Enter Your Details for Work
          </Text>
          <View style={{marginVertical: 10}} />
          <View>
            <TextInput
              style={styles.Workinput}
              //label="Date"
              left={<TextInput.Icon name="human-male" color={'#FF6347'} />}
              //placeholder="11/2/2021"
              value={category}
              activeUnderlineColor="#FF6347"
              underlineColor="#FF6347"
              mode="outlined"
              theme={{
                colors: {
                  primary: '#FF6347',
                  text: '#05375a',
                  placeholder: '#FF6347',
                },
              }}
              disabled={true}
            />
          </View>
          <View style={{marginTop: 20}}>
            <TextInput
              style={styles.inputTextArea}
              //label="Date"
              left={<TextInput.Icon name="calendar-clock" color={'#FF6347'} />}
              //placeholder="11/2/2021"
              value={date}
              disabled={true}
              activeUnderlineColor="#FF6347"
              underlineColor="#FF6347"
              mode="outlined"
              theme={{
                colors: {
                  primary: '#FF6347',
                  text: '#05375a',
                  placeholder: '#FF6347',
                },
              }}
            />
            <TouchableOpacity onPress={showDatePicker} style={styles.button} />
          </View>
          <View style={{marginTop: 20}}>
            <TextInput
              style={styles.input}
              //label="Date"
              left={<TextInput.Icon name="clock" color={'#FF6347'} />}
              //placeholder="11/2/2021"
              value={time}
              activeUnderlineColor="#FF6347"
              underlineColor="#FF6347"
              disabled={true}
              mode="outlined"
              theme={{
                colors: {
                  primary: '#FF6347',
                  text: '#05375a',
                  placeholder: '#FF6347',
                },
              }}
            />
            <TouchableOpacity onPress={showTimePicker} style={styles.button} />
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />

          <View style={styles.dropdwon}>
            <DropDownPicker
              style={{
                borderRadius: 5,
                borderColor: '#FF6347',
              }}
              textStyle={{
                fontSize: 17,
                color: '#05375a',
              }}
              dropDownDirection={'TOP'}
              placeholder="Select City"
              open={openCity}
              value={city}
              items={citiesDropdown}
              setOpen={setOpenCity}
              setValue={setCity}
              listMode="SCROLLVIEW"
              //setItems={setCity}
            />
          </View>

          <View style={styles.dropdwon}>
            <DropDownPicker
              style={{
                borderRadius: 5,
                borderColor: '#FF6347',
              }}
              textStyle={{
                fontSize: 17,
                color: '#05375a',
              }}
              dropDownDirection={'DOWN'}
              placeholder="Select Tasker Expertise"
              open={openExpertise}
              value={expertise}
              items={expertiseDropdown}
              setOpen={setOpenExpertise}
              setValue={setExpertise}
              listMode="SCROLLVIEW"
              //setItems={setExpertise}
            />
          </View>

          <View style={styles.textAreaContainer}>
            <TextInput
              //style={styles.textArea}
              mode="outlined"
              outlineColor="#FF6347"
              activeOutlineColor="#FF6347"
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Type task Description"
              placeholderTextColor="grey"
              numberOfLines={6}
              multiline={true}
              theme={{
                colors: {
                  text: 'black',
                },
              }}
            />
          </View>
          <View style={{marginVertical: 10}}>
            <TouchableOpacity
              style={styles.calculateBtn}
              onPress={() =>
                //checkVerification()
                {
                  if (expertise !== '' && city !== '') {
                    getRecommendedPrice();
                    placeOrder();
                    //
                  } else {
                    setShowAlert(true);
                  }
                }
              }>
              <LinearGradient
                colors={['#FFA07A', '#FF6347']}
                style={styles.calculateBtn}>
                <Text
                  style={[
                    styles.textCalculateBtn,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Match Tasker
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CostEstimation;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 25,
  },
  dropdwon: {
    //marginVertical: 20,
    flexDirection: 'row',
    marginTop: 20,
  },
  calculateBtn: {
    width: 325,
    height: 50,
    marginRight: 15,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 30,
  },
  inputTextArea: {
    backgroundColor: '#fff',
  },
  textAreaContainer: {
    marginTop: 17,
  },
  input: {
    backgroundColor: '#fff',
    color: 'black',
    //borderColor: '#FF6347',
  },
  Workinput: {
    backgroundColor: '#FF63',
  },
  textCalculateBtn: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    //backgroundColor: '#DDDDDD',
    width: 350,
    height: 70,
    position: 'absolute',
    //padding: 10,
  },
});

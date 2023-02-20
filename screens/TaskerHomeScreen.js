/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import COLORS from '../constants/Colors';
import Fonts from '../constants/Fonts';
import Loader from '../components/Loader';
const {width} = Dimensions.get('window');
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {locationPermission, getCurrentLocation} from '../helper/HelperFunction';
const haversine = require('haversine');

const biddingArray = [];

const TaskerHomeScreen = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTittle, setAlertTittle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [location, setLocation] = useState({});
  const [user, setUser] = useState({});
  const [selectedItem, setSelectedItem] = useState({});

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };

  const DATA = [
    {
      id: 'Muhammad Nawaf',
      title: 'Plumber',
      location: {latitude: '32.3718227', longitude: '73.1504329'},
    },
    {
      id: 'Sameer',
      title: 'Plumber',
      location: {latitude: 32.3718227, longitude: 73.1504329},
    },
  ];

  async function placeBid() {
    try {
      var body = {
        orderId: selectedItem._id,
        taskerId: user.loginId,
        taskerCategory: user.category,
        price: inputValue,
        location: location,
      };
      biddingArray.push(selectedItem);
      console.log(body);
      const response = await axios
        .post('https://gentle-oasis-88778.herokuapp.com/tasker/placeBid', body)
        .then(res => {
          console.log(res.data);
          //setData(res.data.data);
          //setLoading(false);
        });
      //console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function getData() {
      const getUser = await AsyncStorage.getItem('user');
      const userData = JSON.parse(getUser);
      setUser(() => userData);
      const locPermission = await locationPermission();
      console.log(locPermission);
      if (locPermission) {
        const {lat, lng, heading} = await getCurrentLocation();
        console.log('get live location after 4 second', lat);
        var updatedLocation = {latitude: lat, longitude: lng};
        setLocation(loc => ({
          ...loc,
          ...updatedLocation,
        }));
      }
      try {
        var body = {
          location: updatedLocation,
          category: userData.category,
        };
        // console.log(body);
        const response = await axios
          .post(
            'https://gentle-oasis-88778.herokuapp.com/tasker/getRequests',
            body,
          )
          .then(res => {
            //console.log(res.data);
            setData(res.data.data);
            setLoading(false);
          });
      } catch (err) {
        console.log(err);
      }
    }
    let interval = setInterval(() => {
      // console.log('Hello after 6 sec');
      getData();
    }, 6000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={style.container}>
      <Loader loading={loader} />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTittle}
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
      <View style={style.header}>
        <Text style={{color: 'black', fontSize: 32, fontWeight: 'bold'}}>
          Work Request!
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}>
        <View style={style.viewWrapper}>
          <View style={style.modalView}>
            <TextInput
              placeholder="Enter something..."
              value={inputValue}
              style={style.textInput}
              keyboardType="numeric"
              onChangeText={value => setInputValue(value)}
            />

            {/** This button is responsible to close the modal */}
            <Button
              color={'#3c8'}
              title="Submit"
              onPress={() => {
                if (inputValue > 0) {
                  placeBid();
                  toggleModalVisibility();
                } else {
                  setShowAlert(true);
                  setAlertTittle('Wrong Input');
                  setAlertMessage('Bid must be greater than zero');
                }
              }}
            />
          </View>
        </View>
      </Modal>
      {loading ? (
        <ActivityIndicator
          animating={true}
          color="#FF6347"
          size="large"
          style={style.activityIndicator}
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 80}}
          data={data}
          renderItem={({item}) => (
            <TouchableOpacity
              style={style.flatlistCard}
              onPress={() => navigation.navigate('TaskerDetailScreen')}>
              <View
                style={{
                  height: 100,
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', marginTop: 30}}>
                    <Avatar.Image
                      source={require('../assets/pngegg.png')}
                      size={40}
                    />
                    <View style={{flexDirection: 'column', marginLeft: 5}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 15,
                          color: 'black',
                        }}>
                        {item.category}
                      </Text>
                      <Text style={{fontSize: 12, color: COLORS.grey}}>
                        {haversine(location, item.location)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      marginTop: 33,
                      borderRadius: 20,
                      width: 105,
                      height: 35,
                      backgroundColor: '#3c8',
                      elevation: 2,
                    }}
                    onPress={() => {
                      const found = biddingArray.find(
                        bidedItem => bidedItem._id === item._id,
                      );
                      if (!found) {
                        setSelectedItem(item);
                        toggleModalVisibility();
                      } else {
                        setShowAlert(true);
                        setAlertTittle('Already Placed');
                        setAlertMessage(
                          'Bid has already been placed on this request!',
                        );
                      }
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        padding: 6,
                      }}>
                      Place Bid
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default TaskerHomeScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 0,
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 60,
  },
  flatlistCard: {
    height: 70,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  text: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: 18,
  },

  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    elevation: 5,
    transform: [{translateX: -(width * 0.4)}, {translateY: -90}],
    height: 180,
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
  textInput: {
    width: '80%',
    color: 'black',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    marginBottom: 8,
  },
});

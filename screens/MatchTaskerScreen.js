/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {Avatar, Title, Caption, TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import AwesomeAlert from 'react-native-awesome-alerts';
import COLORS from '../constants/Colors';
import Fonts from '../constants/Fonts';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
const DATA = [
  {
    id: '1',
    name: 'Muhammad Nawaf',
    title: 'Plumber',
    color: false,
    price: 580,
  },
  {
    id: '2',
    name: 'Sameer',
    title: 'Plumber',
    color: false,
    price: 620,
  },
  {
    id: '3',
    name: 'Saad',
    title: 'Plumber',
    color: false,
    price: 600,
  },
];
var wishlist = [];
const MatchTaskerScreen = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [color, setcolor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    'Your order has been placed',
  );
  const [alertTitle, setAlertTitle] = useState('Tasker Booked');
  //const [wishlist, setWishlist] = useState([]);
  const isFocused = useIsFocused();

  console.log(route.params.price);
  var price = route.params.price;

  async function hireTasker(orderId, taskerId) {
    ///setShowLoading(() => true);
    /*setTimeout(function () {
      setShowLoading(() => false);
      setShowAlert(true);
    }, 2000);*/
    try {
      const response = await axios
        .put(
          'https://gentle-oasis-88778.herokuapp.com/client/acceptBid/' +
            orderId +
            '/' +
            taskerId,
        )
        .then(res => {
          console.log(res.data);
          setShowLoading(() => false);
          setShowAlert(true);
        })
        .catch(err => {
          console.log(err);
        });

      //alert(response.data.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function getBids() {
      try {
        const response = await axios
          .get(
            'https://gentle-oasis-88778.herokuapp.com/client/getBids/' +
              route.params.orderId,
          )
          .then(res => {
            console.log(res.data);
            //if (data.length !== res.data.length) {
            setData(res.data.data);
            setLoading(false);
            // } */
          })
          .catch(err => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }
    let interval = setInterval(() => {
      console.log('Hello after 6 sec');
      getBids();
    }, 6000);
    return () => {
      clearInterval(interval);
    };
  }, [route.params.orderId, isFocused]);

  useEffect(() => {
    getWishtlist();
    console.log('im running');
  }, []);

  const getWishtlist = async () => {
    const Wishtlist = await AsyncStorage.getItem('wishlist');
    const wishlistData = JSON.parse(Wishtlist);
    if (wishlistData !== null) {
      wishlist = wishlistData;
    }
    console.log(wishlist);
    console.log('Getting Wishlist', wishlistData);
  };

  const addWishlist = async item => {
    //console.log(color);
    if (wishlist !== null) {
      let found = wishlist.find(list => list.id === item.id);
      if (found) {
        item.color = false;
        let remainingArr = wishlist.filter(list => list.id !== item.id);
        wishlist = remainingArr;
        const jsonValue = JSON.stringify(wishlist);
        await AsyncStorage.setItem('wishlist', jsonValue);
      } else {
        item.color = !item.color;
        wishlist.push(item);
        const jsonValue = JSON.stringify(wishlist);
        await AsyncStorage.setItem('wishlist', jsonValue);
      }
    } else {
      item.color = !item.color;
      //console.log(wishlist);
      wishlist.push(item);
      const jsonValue = JSON.stringify(wishlist);
      await AsyncStorage.setItem('wishlist', jsonValue);
    }
    //const userData = JSON.parse(getUser);
  };

  return (
    <View style={style.container}>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={showLoading}
        onRequestClose={() => {
          console.log('close modal');
        }}>
        <View style={style.modalBackground}>
          <View style={style.activityIndicatorWrapper}>
            <Text style={{color: 'grey', padding: 10, marginTop: 10}}>
              Booking Tasker!!!
            </Text>
            <ActivityIndicator
              animating={true}
              color="#3c8"
              size="large"
              style={style.activityIndicator}
            />
          </View>
        </View>
      </Modal>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Yes"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setShowAlert(false);
          navigation.navigate('MainTabScreen');
        }}
      />
      <TouchableOpacity
        style={{
          marginTop: 20,
          borderRadius: 5,
          //backgroundColor: '#3c8',
          //elevation: 2,
        }}
        onPress={navigation.goBack}>
        <Text
          style={{
            color: '#3c8',
            textAlign: 'right',
            fontWeight: '400',
            fontSize: 18,
            marginRight: 30,
          }}>
          Cancel Request
        </Text>
      </TouchableOpacity>
      <View style={style.header}>
        <Text style={{color: 'black', fontSize: 32, fontWeight: 'bold'}}>
          Taskers Request!
        </Text>
      </View>
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
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                  <Avatar.Image
                    source={require('../assets/pngegg.png')}
                    size={55}
                  />
                  <View style={{flexDirection: 'column', marginLeft: 5}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 15,
                        color: 'black',
                      }}>
                      {item.taskerCategory}
                    </Text>
                    <Text
                      style={{fontSize: 12, color: COLORS.grey, marginTop: 2}}>
                      {item.taskerId}
                    </Text>

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: 'black',
                        marginTop: 2,
                      }}>
                      Bid Price: Rs.{item.price}{' '}
                      <Text style={{fontSize: 10, color: COLORS.grey}}>
                        (Per Hour)
                      </Text>
                    </Text>
                  </View>
                </View>
                <View>
                  <TouchableRipple
                    onPress={() => {
                      //console.log(item.color);
                      addWishlist(item);

                      setcolor(!color);
                      console.log(item.color);
                    }}>
                    <View style={style.menuItem}>
                      <Icon
                        name="heart-outline"
                        color={item.color ? 'red' : '#777777'}
                        size={25}
                      />
                    </View>
                  </TouchableRipple>
                  <TouchableOpacity
                    style={{
                      marginTop: 5,
                      borderRadius: 20,
                      width: 105,
                      height: 35,
                      backgroundColor: '#3c8',
                      elevation: 2,
                    }}
                    onPress={() => {
                      hireTasker(item.orderId, item.taskerId);
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        padding: 6,
                      }}>
                      Book Tasker
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Animatable.View animation="fadeInUpBig" style={style.footer}>
        <Text style={style.text}>
          Recommended Price: {Math.round(route.params.price)}
        </Text>
      </Animatable.View>
    </View>
  );
};

export default MatchTaskerScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 0,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  flatlistCard: {
    height: 90,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    height: 90,
    backgroundColor: '#FF6347',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  text: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: 18,
    color: 'white',
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginLeft: 70,
    marginTop: 9,
    //paddingHorizontal: 10,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },

  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});

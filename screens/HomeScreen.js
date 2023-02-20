/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Swiper from 'react-native-swiper';
//import CustomAlert from '../components/CustomeAlert';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import StarRating from '../components/StarRating';
const DATA = [
  {
    id: '1',
    name: 'Muhammad Nawaf',
    title: 'Plumber',
    color: false,
  },
  {
    id: '2',
    name: 'Sameer',
    title: 'Plumber',
    color: false,
  },
  {
    id: '3',
    name: 'Saad',
    title: 'Plumber',
    color: false,
  },
];
const HomeScreen = ({navigation}) => {
  const [wishlist, setWishlist] = useState([]);
  const isFocused = useIsFocused();
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    async function getWishtlist() {
      const Wishtlist = await AsyncStorage.getItem('wishlist');
      const wishlistData = JSON.parse(Wishtlist);
      setWishlist(() => wishlistData);
      console.log('Getting Wishlist', wishlistData);
    }
    getWishtlist();
    console.log('im running');
  }, [isFocused]);

  const removeWishlist = async item => {
    //console.log(color);
    let found = wishlist.find(list => list.id === item.id);
    if (found) {
      //item.color = false;
      let remainingArr = wishlist.filter(list => list.id !== item.id);
      setWishlist(remainingArr);
      const jsonValue = JSON.stringify(remainingArr);
      await AsyncStorage.setItem('wishlist', jsonValue);
    }
  };

  async function getActiveOrders() {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    try {
      const response = await axios
        .get(
          'https://gentle-oasis-88778.herokuapp.com/' +
            userData.role +
            '/activeOrders/' +
            userData.loginId,
        )
        .then(res => {
          //var res = res;
          //console.log('active', res.data.data);
          setActiveOrders(res.data.data);
          //setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getActiveOrders();
  }, []);

  async function hireTasker(orderId, taskerId) {
    try {
      /* var body = {
        location: location,
        category: user.category,
      }; */
      const response = await axios
        .get(
          'https://gentle-oasis-88778.herokuapp.com/client/acceptBid/' +
            orderId +
            '/' +
            taskerId,
        )
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });

      //alert(response.data.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.sliderContainer}>
        <Swiper
          autoplay
          horizontal={false}
          height={200}
          activeDotColor="#FF6347">
          <View style={styles.slide}>
            <Image
              source={require('../assets/banners/Electrian-slider.png')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require('../assets/banners/painter-slider.jpg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require('../assets/banners/cleaner-slider1.jpg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
        </Swiper>
      </View>

      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() => {
            navigation.navigate('CostEstimationScreen', {category: 'Plumber'});
          }}>
          <View style={styles.categoryIcon}>
            <MaterialIcons name="plumbing" size={35} color="#FF6347" />
          </View>
          <Text style={styles.categoryBtnTxt}>Plumber</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() => {
            navigation.navigate('CostEstimationScreen', {
              category: 'Electrician',
            });
          }}>
          <View style={styles.categoryIcon}>
            <MaterialIcons
              name="electrical-services"
              size={35}
              color="#FF6347"
            />
          </View>
          <Text style={styles.categoryBtnTxt}>Electrician</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() => {
            navigation.navigate('CostEstimationScreen', {
              category: 'Carpenter',
            });
          }}>
          <View style={styles.categoryIcon}>
            <MaterialIcons name="carpenter" size={35} color="#FF6347" />
          </View>
          <Text style={styles.categoryBtnTxt}>Carpenter</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.categoryContainer, {marginTop: 10}]}>
        <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() => {
            navigation.navigate('CostEstimationScreen', {category: 'Painter'});
          }}>
          <View style={styles.categoryIcon}>
            <MaterialIcons name="format-paint" size={35} color="#FF6347" />
          </View>
          <Text style={styles.categoryBtnTxt}>Painter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() => {
            navigation.navigate('CostEstimationScreen', {category: 'Cleaner'});
          }}>
          <View style={styles.categoryIcon}>
            <MaterialIcons name="cleaning-services" size={35} color="#FF6347" />
          </View>
          <Text style={styles.categoryBtnTxt}>Cleaner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() => {
            navigation.navigate('CostEstimationScreen', {category: 'Handyman'});
          }}>
          <View style={styles.categoryIcon}>
            <MaterialIcons name="handyman" size={35} color="#FF6347" />
          </View>
          <Text style={styles.categoryBtnTxt}>Handyman</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 30}}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
          }}>
          Active Orders
        </Text>
        <ScrollView horizontal={true} style={{width: '100%'}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 80}}
            data={activeOrders}
            renderItem={({item}) => (
              <View>
                <TouchableOpacity
                  style={styles.cartCard}
                  onPress={() =>
                    navigation.navigate('OrderDetailScreen', {item: item})
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={require('../assets/icons8-order-67.png')}
                      style={{height: 40, width: 40, margin: 5, marginTop: 20}}
                    />
                    <View
                      style={{
                        height: 100,
                        marginLeft: 10,
                        paddingVertical: 7,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          color: 'black',
                        }}>
                        {item.category}
                      </Text>
                      <Text style={{fontSize: 13, color: 'grey'}}>
                        Estimated Hourly Rate
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'black',
                        }}>
                        {item.estimatedPrice}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sliderContainer: {
    height: 200,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },
  wrapper: {},

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  flatlistCard: {
    height: 90,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#ffff',
    marginVertical: 10,
    marginHorizontal: 22.5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartCard: {
    height: 80,
    width: 350,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  categoryBtn: {
    flex: 1,
    width: '30%',
    marginHorizontal: 0,
    alignSelf: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginLeft: 70,
    marginTop: 9,
    //paddingHorizontal: 10,
  },
  categoryIcon: {
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#fdeae7' /* '#FF6347' */,
    borderRadius: 50,
  },
  categoryBtnTxt: {
    alignSelf: 'center',
    marginTop: 5,
    color: '#de4f35',
  },
  cardsWrapper: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
  card: {
    height: 100,
    marginVertical: 10,
    flexDirection: 'row',
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardDetails: {
    fontSize: 12,
    color: '#444',
  },
});

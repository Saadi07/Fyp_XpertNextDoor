/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import SearchBar from 'react-native-dynamic-search-bar';
import {Avatar, Title, Caption, TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ExploreScreen = ({navigation}) => {
  const [wishlist, setWishlist] = useState([]);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
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
    } catch (err) {
      console.log(err);
    }
  }
  const removeWishlist = async item => {
    //console.log(color);
    let found = wishlist.find(list => list.id === item.id);
    if (found) {
      //item.color = false;
      let remainingArr = wishlist.filter(list => list.id !== item.id);
      setWishlist(() => remainingArr);
      const jsonValue = JSON.stringify(remainingArr);
      await AsyncStorage.setItem('wishlist', jsonValue);
    }
  };
  return (
    <View style={style.container}>
      <View style={style.searchview}>
        <SearchBar
          placeholder="Search here"
          //onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          //autoFocus={true}
          //onClearPress={onClearfunc}
        />
      </View>
      <View style={{marginTop: 30}}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
          }}>
          My Wishlist
        </Text>

        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 80}}
          data={wishlist}
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
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'grey',
                          marginTop: 2,
                        }}>
                        {item.title}
                      </Text>

                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: 'black',
                          marginTop: 2,
                        }}>
                        Bid Price: $100{' '}
                        <Text style={{fontSize: 10, color: 'grey'}}>
                          (Per Hour)
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View>
                    <TouchableRipple
                      onPress={() => {
                        //console.log(item.color);
                        removeWishlist(item);
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
                        elevation: 1,
                      }}
                      onPress={() => {
                        hireTasker(item.orderId, item.taskerId).then(res => {
                          navigation.navigate('MakePaymentScreen');
                        });
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
      </View>
    </View>
  );
};

export default ExploreScreen;

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
    backgroundColor: '#ffff',
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
  searchview: {
    height: 60,
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 18,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginLeft: 70,
    marginTop: 9,
    //paddingHorizontal: 10,
  },
});

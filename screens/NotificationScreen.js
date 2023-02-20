/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA = [
  {
    id: 'Muhammad Nawaf',
    message:
      'Muhammad Nawaf has completed the work are you satisfied? please verify and give feedback',
  },
  {
    id: 'Sameer',
    message:
      'Sameer has completed the work are you satisfied? please verfiy and give feedback',
  },
  {
    id: 'Saad',
    message:
      'Saad has completed the work are you satisfied? please verfiy and give feedback',
  },
];

const NotificationScreen = ({navigation}) => {
  const [notifications, setNotification] = useState([]);

  async function getNotification(orderId, taskerId) {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    try {
      /* var body = {
        location: location,
        category: user.category,
      }; */
      const response = await axios
        .get(
          'https://gentle-oasis-88778.herokuapp.com/client/getPayment/' +
            userData.loginId,
        )
        .then(res => {
          console.log(res.data);
          setNotification(res.data.data);
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
    getNotification();
  }, []);

  return (
    <View style={style.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notifications}
        renderItem={({item}) => (
          <TouchableOpacity
            style={style.flatlistCard}
            onPress={() => navigation.navigate('MakePaymentScreen', item)}>
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
                <View style={{flexDirection: 'row', marginTop: 30, margin: 5}}>
                  <Avatar.Image
                    source={require('../assets/pngegg.png')}
                    size={40}
                  />
                  <View style={{width: 300}}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'grey',
                        textAlign: 'justify',
                        marginHorizontal: 10,
                      }}>
                      {'Your has been confirmed from tasker side, kindly pay this amount ' +
                        item.amount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default NotificationScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatlistCard: {
    height: 70,
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

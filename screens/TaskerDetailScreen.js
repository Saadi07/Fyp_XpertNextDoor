/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../constants/Colors';
import axios from 'axios';
import StarRating from 'react-native-star-rating-widget';

const DATA = [
  {
    id: 'Tap Fixing',
    title: 'Plumber',
  },
  {
    id: 'Sofa Cleaning',
    title: 'Plumber',
  },
  {
    id: 'Ac Repair',
    title: 'Plumber',
  },
  {
    id: 'Water Pump Installation',
    title: 'Plumber',
  },
  {
    id: 'Saad1',
    title: 'Plumber',
  },
];
const TaskerDetailScreen = ({navigation}) => {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);

  const getUserDetails = async () => {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    setUser(() => userData);
  };

  async function getOrders() {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    try {
      const response = await axios
        .get(
          'https://gentle-oasis-88778.herokuapp.com/' +
            userData.role +
            '/completedOrders/' +
            userData.loginId,
        )
        .then(res => {
          var res = res.data.data;
          setData(res);
          //console.log('ss', res);
        });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getUserDetails();
    getOrders();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image source={require('../assets/pngegg.png')} size={100} />
          <View style={{marginLeft: 20}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Title
                style={[
                  styles.title,
                  {
                    marginTop: 15,
                    marginBottom: 5,
                  },
                ]}>
                {user.name}
              </Title>
              <TouchableOpacity
                style={{
                  marginTop: 22,
                  borderRadius: 5,
                  width: 90,
                  height: 30,
                  backgroundColor: '#3c8',
                  elevation: 2,
                  marginLeft: 40,
                }}
                onPress={() =>
                  navigation.navigate('ChatScreen', {
                    currentChat: {
                      userName: 'Nawaf',
                      convId: '12',
                      userId: '222',
                      members: ['22', '222'],
                    },
                  })
                }>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    padding: 4,
                  }}>
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
            <Caption style={styles.caption}>@saadi</Caption>
          </View>
        </View>
      </View>
      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#777777" size={20} />
          <Text style={{color: '#777777', marginLeft: 20}}>Pakistan</Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{color: '#777777', marginLeft: 20}}>{user.loginId}</Text>
        </View>
      </View>
      <View style={styles.JobsContainer}>
        <View>
          <Text style={styles.titleCompletedJob}>Completed Jobs</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 80}}
          data={data}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.cartCard}
              onPress={() => navigation.navigate('CompletedJobDetailScreen')}>
              <View
                style={{
                  height: 100,
                  marginLeft: 5,
                  paddingVertical: 20,
                  flex: 1,
                }}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
                  {item.category}
                </Text>
                <Text
                  style={{fontSize: 17, fontWeight: 'bold', color: 'black'}}>
                  Price: {item.actualPrice}
                </Text>
              </View>
              <View style={{marginTop: 0, marginLeft: 0}}>
                <StarRating
                  enableHalfStar={false}
                  starSize={20}
                  rating={item.feedback.rating}
                  onChange={() => {}}
                  color={'#3c8'}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default TaskerDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cartCard: {
    height: 100,
    //elevation: 2,
    borderColor: '#FF6347',
    borderWidth: 1.5,
    borderBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleCompletedJob: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    padding: 10,
    marginLeft: 15,
  },

  JobsContainer: {
    height: 460,
  },
});

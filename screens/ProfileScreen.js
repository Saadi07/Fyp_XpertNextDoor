/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState({});
  const isFocused = useIsFocused();

  const getUserDetails = async () => {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    setUser(() => userData);
  };

  const handleSignOut = async () => {
    console.log('Pressed');
    await AsyncStorage.removeItem('user');
    navigation.navigate('SignInScreen');
  };

  useEffect(() => {
    getUserDetails();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              {user.profileImage === undefined || user.profileImage === null ? (
                <Avatar.Image
                  source={require('../assets/pngegg.png')}
                  size={100}
                />
              ) : (
                <Avatar.Image
                  source={{uri: `data:image/jpeg;base64,${user.profileImage}`}}
                  size={100}
                />
              )}
              <View style={{marginLeft: 20}}>
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
                <Caption style={styles.caption}>@saadi</Caption>
              </View>
            </View>
          </View>
          <View style={styles.userInfoSection}>
            <View style={styles.row}>
              <Icon name="map-marker-radius" color="#777777" size={20} />
              <Text style={{color: '#777777', marginLeft: 20}}>
                Islamabad, Pakistan
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="phone" color="#777777" size={20} />
              <Text style={{color: '#777777', marginLeft: 20}}>
                {user.loginId}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="email" color="#777777" size={20} />
              <Text style={{color: '#777777', marginLeft: 20}}>
                saadiawan09@gmail.com
              </Text>
            </View>
          </View>
          {user.role === 'tasker' ? (
            <View style={styles.menuWrapper}>
              <TouchableRipple
                onPress={() => {
                  navigation.navigate('TaskerDetailScreen');
                }}>
                <View style={styles.menuItem}>
                  <Icon name="face-man-profile" color="#FF6347" size={25} />
                  <Text style={styles.menuItemText}>Portfolio</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => {
                  navigation.navigate('IndentityVerficationIntroScreen');
                }}>
                <View style={styles.menuItem}>
                  <Icon name="face-recognition" color="#FF6347" size={25} />
                  <Text style={styles.menuItemText}>Tasker Verification</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => {
                  navigation.navigate('ManageOrderScreen');
                }}>
                <View style={styles.menuItem}>
                  <Icon name="face-man-profile" color="#FF6347" size={25} />
                  <Text style={styles.menuItemText}>Manage Orders</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => {
                  navigation.navigate('EarningScreen');
                }}>
                <View style={styles.menuItem}>
                  <Icon name="cash-multiple" color="#FF6347" size={25} />
                  <Text style={styles.menuItemText}>Earnings</Text>
                </View>
              </TouchableRipple>
              <TouchableOpacity
                onPress={() => {
                  handleSignOut();
                }}
                style={{
                  paddingVertical: 15,
                  marginHorizontal: 30,
                  borderTopWidth: 0.6,
                  borderTopColor: 'grey',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="exit-outline" color={'#FF6347'} size={25} />
                  <Text style={styles.menuItemText}>Sign Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.menuWrapper}>
              <TouchableRipple
                onPress={() => {
                  navigation.navigate('ManageOrderScreen');
                }}>
                <View style={styles.menuItem}>
                  <Icon name="face-man-profile" color="#FF6347" size={25} />
                  <Text style={styles.menuItemText}>Manage Orders</Text>
                </View>
              </TouchableRipple>
              <TouchableOpacity
                onPress={() => {
                  handleSignOut();
                }}
                style={{
                  paddingVertical: 15,
                  marginHorizontal: 30,
                  borderTopWidth: 0.6,
                  borderTopColor: 'grey',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="exit-outline" color={'#FF6347'} size={25} />
                  <Text style={styles.menuItemText}>Sign Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <Text>loading Data.....</Text>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
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
  menuWrapper: {
    marginTop: 0,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});

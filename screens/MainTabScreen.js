/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import MessageIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './HomeScreen';
import NotificationScreen from './NotificationScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import MessagesScreen from './MessegesScreen';
import ChatScreen from './ChatScreen';
import TaskerHomeScreen from './TaskerHomeScreen';
import CostEstimation from './CostEstimationScreen';
//import MapTestScreen from './MapTestScreen';
import EditProfileScreen from './EditProfileScreen';

import {Avatar} from 'react-native-paper';
import {Text} from 'react-native';
import {View} from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
//import CardListScreen from './CardListScreen';
//import CardItemDetails from './CardItemDetails';
const HomeStack = createStackNavigator();
const MessengingStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CostEstimationStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator initialRouteName="HomeTab" activeColor="#fff">
    <Tab.Screen
      name="HomeTab"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: '#FF6347',
        tabBarIcon: ({color}) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="MessagesTab"
      component={MessagingStackScreen}
      options={{
        tabBarLabel: 'Messages',
        tabBarColor: '#FF6347',
        tabBarIcon: ({color}) => (
          <MessageIcon name="message1" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarColor: '#FF6347',
        tabBarIcon: ({color}) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="ExploreTab"
      component={WishlistStackScreen}
      options={{
        tabBarLabel: 'Favourites',
        tabBarColor: '#FF6347',
        tabBarIcon: ({color}) => <Icon name="heart" color={color} size={26} />,
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0, // Android
        },
        headerTintColor: 'black',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HomeStack.Screen
        name="ClientHomeStack"
        component={HomeScreen}
        options={{
          title: 'XpertNextDoor',
          headerRight: () => (
            <View style={{flexDirection: 'row', marginRight: 10}}>
              <Icon.Button
                name="ios-notifications"
                size={25}
                color="black"
                backgroundColor="#fff"
                onPress={() => {
                  navigation.navigate('NotificationScreen');
                }}
              />
              <TouchableOpacity
                style={{paddingHorizontal: 10, marginTop: 5}}
                onPress={() => {
                  navigation.navigate('ProfileTab');
                }}>
                <Avatar.Image
                  source={require('../assets/pngegg.png')}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};

const WishlistStackScreen = ({navigation}) => (
  <MessengingStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 0,
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <MessengingStack.Screen
      name="WishlistStack"
      component={ExploreScreen}
      options={{
        title: 'Favourites',
        headerShown: true,
      }}
    />
  </MessengingStack.Navigator>
);

const MessagingStackScreen = ({navigation}) => (
  <MessengingStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 0,
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <MessengingStack.Screen
      name="MessengingStack"
      component={MessagesScreen}
      options={{
        title: 'Messenging',
        headerShown: true,
      }}
    />
    <MessengingStack.Screen
      name="ChatScreen"
      options={({route}) => ({
        title: route.params.currentChat.userName,
        headerBackTitleVisible: false,
      })}
      component={ChatScreen}
    />
  </MessengingStack.Navigator>
);

const ProfileStackScreen = ({navigation}) => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          //shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: 'black',
      }}>
      <ProfileStack.Screen
        name="ProfileStack"
        component={ProfileScreen}
        options={{
          title: '',
          headerRight: () => (
            <View style={{marginRight: 10}}>
              <MaterialCommunityIcons.Button
                name="account-edit"
                size={25}
                backgroundColor="#fff"
                color="black"
                onPress={() => navigation.navigate('EditProfileScreen')}
              />
            </View>
          ),
        }}
      />
      <ProfileStack.Screen
        name="EditProfileScreen"
        options={{
          title: 'Edit Profile',
        }}
        component={EditProfileScreen}
      />
    </ProfileStack.Navigator>
  );
};

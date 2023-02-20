import React from 'react';
import {LogBox} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import CostEstimation from './CostEstimationScreen';
import MainTabScreen from './MainTabScreen';
import MatchTasker from './MatchTaskerScreen';
import CompletedJobDetailScreen from './CompletedJobDetailScreen';
import ManageOrderScreen from './ManageOrdersScreen';
import OrderDetailScreen from './OrderDetailScreen';
import TaskerDetailScreen from './TaskerDetailScreen';
import MakepaymentScreen from './MakepaymentScreen';
import ChatScreen from './ChatScreen';
import NotificationScreen from './NotificationScreen';
import GiveFeebackScreen from './GiveFeebackScreen';

const RootStack = createStackNavigator();

const ClientStackScreen = ({navigation}) => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="MainTabScreen"
        options={{
          title: 'Main Screen',
          headerShown: false,
        }}
        component={MainTabScreen}
      />
      <RootStack.Screen
        name="CostEstimationScreen"
        options={{
          title: 'Cost Estimation',
          headerShown: false,
        }}
        component={CostEstimation}
      />
      <RootStack.Screen
        name="MatchTaskerScreen"
        options={{
          title: 'Match Tasker',
          headerShown: false,
        }}
        component={MatchTasker}
      />
      <RootStack.Screen
        name="CompletedJobDetailScreen"
        options={{
          title: 'Completed Job Details',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        }}
        component={CompletedJobDetailScreen}
      />
      <RootStack.Screen
        name="ManageOrderScreen"
        options={{
          title: 'Manage Orders',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        }}
        component={ManageOrderScreen}
      />
      <RootStack.Screen
        name="OrderDetailScreen"
        options={{
          title: 'Order Detail',
          headerShown: false,
        }}
        component={OrderDetailScreen}
      />
      <RootStack.Screen
        name="TaskerDetailScreen"
        options={{
          title: 'Tasker Details',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        }}
        component={TaskerDetailScreen}
      />
      <RootStack.Screen
        name="MakePaymentScreen"
        options={{
          title: 'Make Payment',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        }}
        component={MakepaymentScreen}
      />
      <RootStack.Screen
        name="ChatScreen"
        options={({route}) => ({
          title: route.params.currentChat.userName,
          headerBackTitleVisible: false,
        })}
        component={ChatScreen}
      />
      <RootStack.Screen
        name="NotificationScreen"
        options={() => ({
          title: 'Notifications',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        })}
        component={NotificationScreen}
      />
      <RootStack.Screen
        name="GiveFeedbackScreen"
        options={() => ({
          title: 'Give Feedback',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        })}
        component={GiveFeebackScreen}
      />
    </RootStack.Navigator>
  );
};

export default ClientStackScreen;

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import SignInScreen from './SignInScreen';
import TaskerStackScreen from './TaskerStackScreen';
import ClientStackScreen from './ClientStackScreen';
import SignUpScreen from './SignUpScreen';
import OtpScreen from './OtpScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation, user}) => {
  console.log('ss', user);
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={
          user === 'tasker'
            ? 'TaskerStack'
            : user === 'client'
            ? 'ClientStack'
            : 'SignInScreen'
        }
        screenOptions={{
          headerShown: false,
          backgroundColor: '#FF6347',
          elevation: 0,
        }}>
        <RootStack.Screen name="SignInScreen" component={SignInScreen} />
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
        <RootStack.Screen name="OtpScreen" component={OtpScreen} />
        <RootStack.Screen name="TaskerStack" component={TaskerStackScreen} />
        <RootStack.Screen name="ClientStack" component={ClientStackScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackScreen;

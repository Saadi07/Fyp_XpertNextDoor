import React from 'react';
import {LogBox} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import EarningsScreen from './EarningsScreen'; // Tasker
import FaceRecognition from './FaceRecogntion'; //Tasker
import IndentityVerificationIntro from './IndentityVerificationIntro'; //Tasker
import FaceDetection from './FaceDetectionScreen'; //Tasker
import ManageOrderScreen from './ManageOrdersScreen';
import WorkImagesUploadScreen from './WorkImagesUploadScreen';
import OrderProgressDetailScreen from './OrderProgressDetailScreen';
import CnicImagesUploadScreen from './CnicImagesUploadScreen';
import TaskerTab from './TaskerTab';
import OrderDetailScreen from './OrderDetailScreen';
import TaskerDetailScreen from './TaskerDetailScreen';
import CompletedJobDetailScreen from './CompletedJobDetailScreen';
//import SignInScreen from './SignInScreen';
//import RootStackScreen from './RootStackScreen';
import ChatScreen from './ChatScreen';

const TaskerStack = createStackNavigator();

const TaskerStackScreen = ({props}) => {
  return (
    <TaskerStack.Navigator>
      <TaskerStack.Screen
        name="TaskerTab"
        options={{
          title: 'Tasker Tab',
          headerShown: false,
        }}
        component={TaskerTab}
      />
      <TaskerStack.Screen
        name="EarningScreen"
        options={{
          title: 'Earnings',
          headerShown: false,
        }}
        component={EarningsScreen}
      />
      <TaskerStack.Screen
        name="IndentityVerficationIntroScreen"
        options={{
          title: 'Indentity Verification Intro',
          headerShown: false,
        }}
        component={IndentityVerificationIntro}
      />
      <TaskerStack.Screen
        name="FaceDectectionScreen"
        options={{
          title: 'Face Detection',
          headerShown: false,
        }}
        component={FaceDetection}
      />

      <TaskerStack.Screen
        name="FaceRecognitionScreen"
        options={{
          title: 'Face Recognition',
          headerShown: false,
        }}
        component={FaceRecognition}
      />
      <TaskerStack.Screen
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
      <TaskerStack.Screen
        name="OrderDetailScreen"
        options={{
          title: 'Order Detail',
          headerShown: false,
        }}
        component={OrderDetailScreen}
      />
      <TaskerStack.Screen
        name="OrderProgressDetailScreen"
        options={{
          title: 'Order Progress',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        }}
        component={OrderProgressDetailScreen}
      />
      <TaskerStack.Screen
        name="WorkImagesUploadScreen"
        options={{
          title: 'Upload Images',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        }}
        component={WorkImagesUploadScreen}
      />
      <TaskerStack.Screen
        name="CnicImagesUploadScreen"
        options={{
          title: 'Upload Cnic Images',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        }}
        component={CnicImagesUploadScreen}
      />
      <TaskerStack.Screen
        name="TaskerDetailScreen"
        options={{
          title: 'Tasker Portfolio',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        }}
        component={TaskerDetailScreen}
      />
      <TaskerStack.Screen
        name="CompletedJobDetailScreen"
        options={{
          title: 'Completed Job',
          headerShown: true,
          headerStyle: {
            elevation: 0,
          },
        }}
        component={CompletedJobDetailScreen}
      />
      <TaskerStack.Screen
        name="ChatScreen"
        options={({route}) => ({
          title: route.params.currentChat.userName,
          headerBackTitleVisible: false,
        })}
        component={ChatScreen}
      />
    </TaskerStack.Navigator>
  );
};

export default TaskerStackScreen;

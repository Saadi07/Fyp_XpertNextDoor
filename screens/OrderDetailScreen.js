/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {Avatar, Title, Caption, TouchableRipple} from 'react-native-paper';
import {locationPermission, getCurrentLocation} from '../helper/HelperFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBY9KJGIdxKUMekyLIlVt1NY_qdAP79APg';

const OrderDetailScreen = ({navigation, route}) => {
  const [state, setState] = useState({
    curLoc: {
      latitude: 31.582045,
      longitude: 74.329376,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    destinationCords: {
      latitude: 33.738045,
      longitude: 73.084488,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });
  const [currentUser, setCurrentUser] = useState({});
  const [user, setUser] = useState({});

  console.log(new Date(route.params.item.createdAt).toDateString());
  console.log(route.params.item);

  const getUserProfile = async () => {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    setCurrentUser(() => userData);
    if (userData.role === 'tasker') {
      const response = await axios
        .get(
          'https://gentle-oasis-88778.herokuapp.com/client/profile/' +
            route.params.item.clientID,
        )
        .then(res => {
          console.log(res.data);
          setUser(res.data);
        });
      console.log(response.data);
    } else {
      const response = await axios
        .get(
          'https://gentle-oasis-88778.herokuapp.com/tasker/profile/' +
            route.params.item.taskerID,
        )
        .then(res => {
          console.log(res.data);
          setUser(() => res.data.data);
          console.log(user.name);
        });
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const mapRef = useRef();

  const getLiveLocation = async () => {
    const locPermission = await locationPermission();
    console.log(locPermission);
    if (locPermission) {
      const {lat, lng, heading} = await getCurrentLocation();
      console.log('get live location after 4 second', lat);
      setState({...state, curLoc: {latitude: lat, longitude: lng}});
    }
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        ref={mapRef}
        style={styles.map}
        initialRegion={state.curLoc}>
        <Marker coordinate={state.curLoc} />
        {Object.keys(state.destinationCords).length > 0 && (
          <Marker coordinate={state.destinationCords} />
        )}
        <MapViewDirections
          origin={state.curLoc}
          destination={state.destinationCords}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="hotpink"
          optimizeWaypoints={true}
          onReady={result => {
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: 30,
                bottom: 100,
                left: 30,
                top: 100,
              },
            });
          }}
        />
      </MapView>
      <View style={styles.workDatePriceContainer}>
        <Text style={{color: 'grey', padding: 14}}>
          {new Date(route.params.item.createdAt).toDateString()}
        </Text>
        <Text style={{color: 'grey', padding: 14}}>Rs. 622</Text>
      </View>
      <View style={styles.workDetailContainer}>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Avatar.Image source={require('../assets/pngegg.png')} size={55} />
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                color: 'black',
                padding: 2,
                marginLeft: 5,
              }}>
              {user.name}
            </Text>
            <Text style={{color: 'black', marginLeft: 5, opacity: 0.3}}>
              {user.loginId}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 8,
              borderRadius: 5,
              width: 90,
              height: 30,
              backgroundColor: '#3c8',
              elevation: 2,
              marginLeft: 100,
            }}
            onPress={() =>
              navigation.navigate('ChatScreen', {
                currentChat: {
                  userName: user.name,
                  convId: '',
                  userId: currentUser._id,
                  receiverId: user.loginId,
                  members: [user.loginId, currentUser.loginId],
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
        <View style={styles.workDescription}>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: 15,
              padding: 5,
              marginTop: 5,
              marginLeft: 2,
            }}>
            Work Description
          </Text>
          <View
            style={{
              height: 90,
              //borderWidth: 0.5,
              //borderRadius: 5,
              marginHorizontal: 4,
              //borderColor: 'grey',
            }}>
            <Text style={{color: 'black', padding: 4, fontSize: 11}}>
              {route.params.item.description}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: 500,
  },
  workDatePriceContainer: {
    height: 50,
    marginHorizontal: 5,
    elevation: 2,
    borderRadius: 5,
    marginTop: 6,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workDetailContainer: {
    height: 205,
    elevation: 2,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  workDescription: {
    borderTopWidth: 0.5,
    borderTopColor: 'grey',
  },
});

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../constants/Colors';
import foods from '../constants/foods';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import StarRating from 'react-native-star-rating-widget';
//import {PrimaryButton} from '../components/Button';

const ManageOrderScreen = ({navigation}) => {
  const [user, setUser] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  //const [cancel, setCancel] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [rating, setRating] = useState(0);
  const [alertMessage, setAlertMessage] = useState(
    'Are you sure to done order?',
  );
  const [selectedItem, setSelectedItem] = useState({});
  const [alertTitle, setAlertTitle] = useState('Done Order');

  const handleStart = item => {
    setShowAlert(true);
    setAlertTitle('Order Start Request');
    setAlertMessage('Are you sure you want to start the order?');
    setDone(true);
  };

  const startOrder = async item => {
    console.log();
    const body = {
      orderId: item._id,
      time: new Date(),
    };
    try {
      const response = await axios
        .put('https://gentle-oasis-88778.herokuapp.com/tasker/startOrder', body)
        .then(res => {
          var res = res.data;
          //console.log('ss1', res);
          if (res.status === 'SUCCESS') {
            navigation.navigate('OrderProgressDetailScreen', {
              id: item._id,
              item: item,
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const disputeOrder = async item => {};

  const handleCancel = () => {
    setShowAlert(true);
    setAlertTitle('Order Dispute Request');
    setAlertMessage('Are you sure you want to make dispute?');
    //setDone(true);
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const getUser = await AsyncStorage.getItem('user');
      const userData = JSON.parse(getUser);
      setUser(() => userData);
    };
    getUserDetails();
  }, []);

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
          setLoading(false);
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

  async function getCancelledOrders() {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    try {
      const response = await axios
        .get(
          'https://gentle-oasis-88778.herokuapp.com/' +
            userData.role +
            '/cancelledOrders/' +
            userData.loginId,
        )
        .then(res => {
          var res = res.data.data;
          console.log('cancelled', res);
          setCancelledOrders(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCancelledOrders();
  }, []);

  async function getCompletedOrders() {
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
          var res = res.data;
          //console.log('completed', res);
          setCompletedOrders(res.data);
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCompletedOrders();
  }, []);

  const FirstRoute = () => (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 80}}
      data={activeOrders}
      renderItem={({item}) => (
        <View>
          <TouchableOpacity
            style={style.cartCard}
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
                  height: 90,
                  marginLeft: 10,
                  paddingVertical: 10,
                }}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 15, color: 'black'}}>
                  {item.category}
                </Text>
                <Text style={{fontSize: 13, color: COLORS.grey}}>
                  Estimated Hourly Rate
                </Text>
                <Text
                  style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
                  {item.estimatedPrice}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'column'}}>
              {user.role === 'tasker' ? (
                <TouchableOpacity
                  style={[
                    style.btn,
                    {
                      marginTop: 23,
                      backgroundColor: '#3c8',
                    },
                  ]}
                  onPress={() => startOrder(item)}>
                  <Text style={style.btnText}>Start</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    style.btn,
                    {
                      marginTop: 23,
                      backgroundColor: 'red',
                    },
                  ]}
                  onPress={() => handleCancel(item)}>
                  <Text style={style.btnText}>Dispute</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
  const ThirdRoute = () => <View style={{flex: 1, backgroundColor: '#fff'}} />;

  const SecondRoute = () => (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 80}}
      data={foods}
      renderItem={({item}) => (
        <View>
          <TouchableOpacity
            style={style.cartCard}
            onPress={() =>
              navigation.navigate('OrderDetailScreen', {item: item})
            }>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../assets/pngegg.png')}
                //source={require('../assets/pngegg.png')}
                style={{height: 40, width: 40, margin: 5, marginTop: 20}}
              />
              <View
                style={{
                  height: 90,
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: 'black',
                    marginLeft: 7,
                  }}>
                  Plumber
                </Text>
                <Text style={{fontSize: 13, color: COLORS.grey, marginLeft: 7}}>
                  Star Rating
                </Text>
                <StarRating
                  enableHalfStar={false}
                  starSize={18}
                  rating={rating}
                  onChange={() => console.log('do nothing')}
                  color={'#3c8'}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#737373'}}
      style={{backgroundColor: 'white', marginBottom: 8}}
      renderLabel={({route}) => (
        <Text style={{color: '#333333', margin: 8}}>{route.title}</Text>
      )}
    />
  );
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Active'},
    {key: 'second', title: 'Completed'},
    {key: 'third', title: 'Cancelled'},
  ]);
  const layout = useWindowDimensions();

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Yes"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          navigation.navigate('OrderProgressDetailScreen');

          //navigation.navigate('FaceRecognitionScreen');
          setDone(() => false);
        }}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
      />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  cartCard: {
    height: 80,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    borderRadius: 10,
    width: 85,
    height: 35,
  },

  btnText: {
    color: 'white',
    textAlign: 'center',
    padding: 6,
  },
});

export default ManageOrderScreen;

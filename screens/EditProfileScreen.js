/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  BackHandler,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Loader from '../components/Loader';
import axios from 'axios';

import ImagePicker from 'react-native-image-crop-picker';

const EditProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [openCategory, setOpenCategory] = useState(false);
  const refRBSheet = useRef();
  const [user, setUser] = useState({});
  const [image, setImage] = useState(
    'https://api.adorable.io/avatars/80/abott@adorable.png',
  );

  const categoriesDropdown = [
    {label: 'Plumber', value: 'Plumber'},
    {label: 'Electrician', value: 'Electrician'},
    {label: 'Handyman', value: 'Handyman'},
    {label: 'Painter', value: 'Painter'},
    {label: 'Carpenter', value: 'Carpenter'},
    {label: 'Cleaner', value: 'Cleaner'},
  ];

  const handleName = text => {
    setName(() => text);
  };
  const handleCity = text => {
    setName(text);
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      //cropping: true,
      includeBase64: true,
      compressImageQuality: 0.7,
    }).then(image => {
      //console.log(image);
      setImage(image);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      includeBase64: true,
      //cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image.mime);
      user.profileImage = image.data;
      setImage(image);
    });
  };

  const getUserDetails = async () => {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    setUser(() => userData);
  };

  const handleSubmit = async () => {
    //console.log(user);
    if (name !== '') {
      user.name = name;
    }
    if (category !== '') {
      user.category = category;
    }
    if (city !== '') {
      user.city = city;
    }
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem('user', jsonValue);
    console.log(typeof image.data);
    var body = {
      name: name,
      city: city,
      category: category,
      profileImage: image.data,
    };
    try {
      //setLoading(true);
      //const user = await AsyncStorage.getItem('user');
      const response = await axios
        .put(
          'https://gentle-oasis-88778.herokuapp.com/tasker/updateProfile/' +
            user.loginId,
          body,
        )
        .then(res => {
          setLoading(false);
          console.log(res.data);
        })
        .catch(err => {
          console.log('Error', err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    //console.log('i m');
    getUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity onPress={() => refRBSheet.current.open()}>
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {user.profileImage ? (
              <ImageBackground
                source={{uri: `data:image/jpeg;base64,${user.profileImage}`}}
                //source={require('../assets/pngegg.png')}
                style={{height: 100, width: 100}}
                imageStyle={{borderRadius: 15}}
              />
            ) : (
              <ImageBackground
                //source={{uri: `data:${image.mime};base64,${image.data}`}}
                source={require('../assets/pngegg.png')}
                style={{height: 100, width: 100}}
                imageStyle={{borderRadius: 15}}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={{padding: 20, marginTop: 30}}>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={'grey'} size={20} />
          <TextInput
            placeholder="Name"
            value={name}
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            onChangeText={val => handleName(val)}
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" color={'grey'} size={20} />
          <TextInput
            placeholder="Phone"
            value={phone}
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={styles.textInput}
            onChangeText={val => setPhone(val)}
          />
        </View>
        <View style={styles.action}>
          <Icon name="map-marker-outline" color={'grey'} size={20} />
          <TextInput
            value={user.city}
            placeholder="Address"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            onChangeText={val => setCity(val)}
          />
        </View>
        <View style={styles.dropdwon}>
          <DropDownPicker
            style={{
              //borderRadius: 5,
              marginTop: 10,
              borderColor: '#f2f2f2',
            }}
            textStyle={{
              fontSize: 15,
              color: '#666666',
            }}
            dropDownDirection={'DOWN'}
            placeholder="Select Work Category"
            open={openCategory}
            value={category}
            items={categoriesDropdown}
            setOpen={setOpenCategory}
            setValue={setCategory}
            listMode="SCROLLVIEW"
            //setItems={setExpertise}
          />
        </View>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View style={styles.panel}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.panelTitle}>Upload Photo</Text>
              <Text style={styles.panelSubtitle}>
                Choose Your Profile Picture
              </Text>
            </View>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => takePhotoFromCamera()}>
              <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => choosePhotoFromLibrary()}>
              <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={() => handleSubmit()}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 50,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
    color: 'black',
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
});

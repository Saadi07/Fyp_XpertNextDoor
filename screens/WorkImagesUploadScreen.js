/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const WorkImagesUploadScreen = ({navigation, route}) => {
  const refRBSheet = useRef();
  const [imgCount, setImgCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [images, setImage] = useState([]);

  async function uploadImages() {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    const body = {
      loginId: userData.loginId,
      orderId: route.params.id,
      images: images,
    };
    try {
      const response = await axios
        .post(
          'https://gentle-oasis-88778.herokuapp.com/tasker/addToPortfolio',
          body,
        )
        .then(res => {
          if (res.data.status === 'SUCCESS') {
            setShowAlert(true);
          }
        });
    } catch (err) {
      console.log(err);
    }
  }

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      multiple: true,
      compressImageQuality: 0.7,
    })
      .then(images => {
        console.log(images);
        setImage(images);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      multiple: true,
      maxFiles: 3,
      compressImageQuality: 0.7,
    })
      .then(images => {
        console.log(images);
        setImgCount(images.length);
        console.log(imgCount);
        setImage(images);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  return (
    <View style={styles.container}>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={'Order Complete'}
        message={'Order has been completed!'}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        //showCancelButton={true}
        showConfirmButton={true}
        confirmText="Okay!"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          navigation.navigate('TaskerTab');
          //setModalVisible(true);
          setShowAlert(false);
        }}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
      />
      <View style={styles.imagesView}>
        {images.length === 0 ? (
          <Text style={{color: 'black', padding: 25, fontSize: 15}}>
            No Images Selected
          </Text>
        ) : imgCount <= 3 ? (
          images.map(img => (
            <Image
              key={img.path}
              source={{
                uri: img.path,
              }}
              //source={require('../assets/pngegg.png')}
              style={{
                height: 100,
                width: 100,
                marginHorizontal: 15,
                borderRadius: 10,
              }}
              imageStyle={{borderRadius: 10}}
            />
          ))
        ) : (
          <Text style={{color: 'red', padding: 25, fontSize: 15}}>
            Images must be 3 or less
          </Text>
        )}
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
        onPress={() => refRBSheet.current.open()}>
        <Text style={styles.panelButtonTitle}>Upload</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          setShowAlert(true);
        }}>
        <Text style={styles.panelButtonTitle}>Complete Work</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkImagesUploadScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commandButton: {
    padding: 15,
    width: 100,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
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
  submitButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 80,
    marginHorizontal: 20,
  },
  imagesView: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

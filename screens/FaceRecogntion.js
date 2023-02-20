/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import RNFS from 'react-native-fs';
import CustomAlert from '../components/CustomeAlert';
import axios from 'axios';
import CountDown from 'react-native-countdown-component';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const App = ({navigation, route}) => {
  const [type, setType] = useState(RNCamera.Constants.Type.front);
  const [showLoading, setShowLoading] = useState(false);
  const [box, setBox] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  //const [file, setFile] = useState();
  //const cameraRef = useRef(null);
  const [showVerificationSuccessPopup, setShowVerificationSuccessPopup] =
    useState(false);
  const [showVerificationErrPopup, setShowVerificationErrPopup] =
    useState(false);
  const [showMultipleFaceErrPopup, setShowMultipleFaceErrPopup] =
    useState(false);
  const [{cameraRef}, {takePicture}] = useCamera(null);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };

  //console.log(route.params.id);

  useEffect(() => {
    async function confirmPayment() {
      try {
        const response = await axios
          .get(
            'https://gentle-oasis-88778.herokuapp.com/tasker/getPayment/' +
              route.params.item.clientID,
          )
          .then(res => {
            var res = res.data.data.paymentMethod;
            console.log('Get payment', res);
            if (res) {
              //toggleModalVisibility();
              setModalVisible(false);
              navigation.navigate('WorkImagesUploadScreen', route.params);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }

    let interval = setInterval(() => {
      // console.log('Hello after 6 sec');
      confirmPayment();
    }, 6000);
    return () => {
      clearInterval(interval);
    };
  });

  const confirmOrderRequest = async () => {
    //console.log(route.params);
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    const body = {
      completionTime: new Date(),
      taskerId: userData.loginId,
      clientId: route.params.item.clientID,
    };
    //console.log(body);
    try {
      const response = await axios
        .put(
          'https://gentle-oasis-88778.herokuapp.com/tasker/completeOrder/' +
            route.params.id,
          body,
        )
        .then(res => {
          var res = res.data;
          console.log('order Completion', res);
          if (res.status === 'SUCCESS') {
            //navigation.navigate('OrderProgressDetailScreen');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  //var data = new FormData();
  const captureHandle = async () => {
    setShowLoading(true);

    try {
      //const options = {quality: 0.5, base64: true};
      const image = await takePicture();
      //console.log(data.uri);
      const filePath = image.uri;
      //console.log(filePath);

      RNFS.readFile(filePath, 'base64').then(res => {
        //console.log(res);
        var credentials = {
          user: 1,
          image_base64: res,
        };
        // const url = 'http://192.168.0.38:5000/recognize_face';
        const url1 = 'http://192.168.43.36:5000/recognize_face';
        axios
          .post(url1, credentials)
          .then(async response => {
            const data = response.data;
            console.log('confidence', data.response.confidence);
            setShowLoading(false);
            if (data.status === 200) {
              if (data.response.confidence > 60) {
                confirmOrderRequest();
                setShowVerificationSuccessPopup(true);
                setTimeout(function () {
                  setShowVerificationSuccessPopup(false);
                  toggleModalVisibility();
                  //navigation.navigate('CnicImagesUploadScreen');
                }, 1000);
              } else {
                setShowVerificationErrPopup(true);
              }
              //setShowVerificationSuccessPopup(true);
              //navigation.navigate('WorkImagesUploadScreen');
            } else {
              setShowLoading(false);
              setShowVerificationErrPopup(true);
            }
            //console.log(response.data);
          })
          .catch(function (error) {
            setShowLoading(false);
            alert('Network Error');
            console.log(error);
          });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlerFace = ({faces}) => {
    //console.log(faces.length);
    if (faces.length > 1) {
      //Alert.alert('Multiple Faces Detected!');
      setShowMultipleFaceErrPopup(true);
    }
    if (faces[0]) {
      setBox({
        boxs: {
          width: faces[0].bounds.size.width,
          height: faces[0].bounds.size.height,
          x: faces[0].bounds.origin.x,
          y: faces[0].bounds.origin.y,
          yawAngle: faces[0].yawAngle,
          rollAngle: faces[0].rollAngle,
        },
        rightEyePosition: faces[0].rightEyePosition,
        leftEyePosition: faces[0].leftEyePosition,
        bottomMounthPosition: faces[0].bottomMounthPosition,
      });
    } else {
      setBox(null);
    }
  };

  return (
    <View style={styles.container}>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={'Order Confirmed'}
        message={'Client has confirm your order, kindly completed the order!'}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        //showCancelButton={true}
        showConfirmButton={true}
        confirmText="Okay!"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setShowAlert(false);
          navigation.navigate('WorkImagesUploadScreen', route.params);
          //setModalVisible(true);
        }}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
      />
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}>
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <Text style={{color: 'grey', marginBottom: 10}}>
              Waiting for Client to confirm the order
            </Text>
            <CountDown
              until={60 * 5}
              onFinish={() => setModalVisible(false)}
              onPress={() => setModalVisible(false)}
              digitStyle={{
                backgroundColor: '#FFF',
                borderWidth: 2,
                borderColor: '#3c8',
              }}
              digitTxtStyle={{color: '#3c8'}}
              timeToShow={['M', 'S']}
              timeLabels={{m: 'MM', s: 'SS'}}
              size={30}
            />
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={showLoading}
        onRequestClose={() => {
          console.log('close modal');
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <Text style={{color: 'grey', padding: 10, marginTop: 10}}>
              Recognizing your face, please wait!
            </Text>
            <ActivityIndicator
              animating={true}
              color="#3c8"
              size="large"
              style={styles.activityIndicator}
            />
          </View>
        </View>
      </Modal>
      <CustomAlert
        displayMode={'failed'}
        displayMsg={
          'Multiple Face Detected, Please try again with clear background'
        }
        visibility={showMultipleFaceErrPopup}
        dismissAlert={setShowMultipleFaceErrPopup}
      />
      <CustomAlert
        displayMode={'failed'}
        displayMsg={'Face Verification Failed, Please try again'}
        visibility={showVerificationErrPopup}
        dismissAlert={setShowVerificationErrPopup}
      />
      <CustomAlert
        displayMode={'success'}
        displayMsg={'Face Verfied Successfully!, Congratulations!'}
        visibility={showVerificationSuccessPopup}
        dismissAlert={setShowVerificationSuccessPopup}
      />
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        captureAudio={false}
        onFacesDetected={handlerFace}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
      />
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity
          style={styles.capture}
          onPress={() => captureHandle()}>
          <Text style={{fontSize: 14, color: 'black'}}> SNAP </Text>
        </TouchableOpacity>
      </View>
      {box && (
        <>
          <View
            style={styles.bound({
              width: box.boxs.width,
              height: box.boxs.height,
              x: box.boxs.x,
              y: box.boxs.y,
            })}
          />
        </>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: 'grey',
  },
  camera: {
    flexGrow: 1,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },

  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    elevation: 5,
    transform: [{translateX: -(width * 0.4)}, {translateY: -90}],
    height: 180,
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
  bound: ({width, height, x, y}) => {
    return {
      position: 'absolute',
      top: y,
      left: x - 50,
      height,
      width,
      borderWidth: 5,
      borderColor: 'red',
      zIndex: 3000,
    };
  },
});

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
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import CustomAlert from '../components/CustomeAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const App = ({navigation}) => {
  const [user, setUser] = useState({});
  const [type, setType] = useState(RNCamera.Constants.Type.front);
  const [box, setBox] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  //const [file, setFile] = useState();
  //const cameraRef = useRef(null);
  const [showVerificationSuccessPopup, setShowVerificationSuccessPopup] =
    useState(false);
  const [showVerificationErrPopup, setShowVerificationErrPopup] =
    useState(false);
  const [showMultipleFaceErrPopup, setShowMultipleFaceErrPopup] =
    useState(false);
  const [{cameraRef}, {takePicture}] = useCamera(null);

  const getUserDetails = async () => {
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    setUser(() => userData);
  };

  useEffect(() => {
    getUserDetails();
  }, [user]);

  //var data = new FormData();
  const captureHandle = async () => {
    //const options = {quality: 0.5, base64: true};
    setShowLoading(true);

    console.log('capturing');

    let pictures = [];
    for (let i = 0; i < 5; i++) {
      const image = await takePicture();
      RNFS.readFile(image.uri, 'base64').then(res => {
        pictures.push(res);
      });
    }
    console.log('Capturing Done');
    // navigation.navigate('CnicImagesUploadScreen');
    const getUser = await AsyncStorage.getItem('user');
    const userData = JSON.parse(getUser);
    try {
      var credentials = {
        user: userData.loginId,
        baseImg: pictures,
      };
      //const url = 'http://192.168.0.38:5000/recognize_face';
      const url1 = 'http://192.168.43.36:5000/detect_face';
      axios
        .post(url1, credentials)
        .then(async response => {
          setShowLoading(() => false);
          console.log(response.data);
          const data = response.data;
          if (data.status === 200) {
            setShowLoading(() => false);
            setShowVerificationSuccessPopup(true);
            setTimeout(function () {
              setShowVerificationSuccessPopup(false);
              navigation.navigate('CnicImagesUploadScreen');
            }, 1000);
          } else {
            setShowLoading(() => false);
            setShowVerificationErrPopup(true);
          }
        })
        .catch(function (error) {
          setShowLoading(() => false);
          setShowVerificationErrPopup(true);
          console.log(error);
        });
    } catch (error) {
      setShowLoading(() => false);
      setShowVerificationErrPopup(true);
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
              Detecting Face Stay Still
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
        displayMsg={'Face Detection Failed, Please try again'}
        visibility={showVerificationErrPopup}
        dismissAlert={setShowVerificationErrPopup}
      />
      <CustomAlert
        displayMode={'success'}
        displayMsg={'Face Detected Successfully!, Congratulations!'}
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
});

/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import {TextInput} from 'react-native-paper';
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import AwesomeAlert from 'react-native-awesome-alerts';

const CnicImagesUploadScreen = ({navigation}) => {
  const refRBSheet = useRef();
  const [imgCount, setImgCount] = useState(0);
  const [submitAlert, setSubmitAlert] = useState(false);
  const [image, setImage] = useState('');
  const [cnic, setCnic] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      //cropping: true,
      includeBase64: true,
      //multiple: true,
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
      // cropping: true,
      includeBase64: true,
      ///multiple: true,
      maxFiles: 3,
      compressImageQuality: 0.7,
    })
      .then(images => {
        console.log(images);
        setImage(() => images);
        refRBSheet.current.close();
        extractCnicNumber(images);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const extractCnicNumber = img => {
    try {
      var credentials = {
        baseImg: img.data,
      };
      console.log('Extracting Data:');
      setShowLoading(() => true);
      //const url = 'http://192.168.0.38:5000/recognize_face';
      const url1 = 'http://192.168.43.36:5000/extract_data_cnic';
      axios
        .post(url1, credentials)
        .then(async response => {
          console.log(response.data);
          const data = response.data;
          if (data.status === 200) {
            setShowLoading(() => false);
            setCnic(data.Data);
            console.log(cnic);
          } else {
            setShowLoading(() => false);
          }
        })
        .catch(function (error) {
          setShowLoading(() => false);
          console.log(error);
        });
    } catch (error) {
      setShowLoading(() => false);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <AwesomeAlert
        show={submitAlert}
        showProgress={false}
        title="Request Success!"
        message={'Verification Completed, Congratulations'}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Okay"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setSubmitAlert(false);
          navigation.navigate('TaskerTab');
        }}
      />
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
              Extracting Cnic Number
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
      <Text
        style={{color: 'black', padding: 20, fontSize: 28, fontWeight: '500'}}>
        Upload CNIC Frontside Scanned Image!
      </Text>
      <Text style={{color: 'red', marginLeft: 25}}>
        Image file must be Scanned copy!
      </Text>
      <View style={styles.imagesView}>
        {image === '' ? (
          <View style={{height: 200, width: 300}}>
            <Text
              style={{
                marginTop: 60,
                color: 'black',
                padding: 25,
                fontSize: 15,
                alignSelf: 'center',
              }}>
              No Image Selected
            </Text>
          </View>
        ) : (
          <Image
            key={image.path}
            source={{
              uri: image.path,
            }}
            //source={require('../assets/pngegg.png')}
            style={{
              height: 200,
              width: 300,
              marginHorizontal: 15,
              borderRadius: 10,
            }}
            imageStyle={{borderRadius: 10}}
          />
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
      <View>
        <Text style={[styles.text_footer]}>Indentity Number</Text>
        <TextInput
          style={styles.textInput}
          //label="Date"
          left={<TextInput.Icon name="id-card" color={'#FF6347'} />}
          //placeholder="11/2/2021"
          value={cnic}
          activeUnderlineColor="#FF6347"
          underlineColor="#FF6347"
          mode="outlined"
          theme={{
            colors: {
              primary: '#FF6347',
              text: '#05375a',
              placeholder: '#FF6347',
            },
          }}
          disabled={true}
        />
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          setSubmitAlert(true);
        }}>
        <Text style={styles.panelButtonTitle}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CnicImagesUploadScreen;
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
    //flex: 1,
    //marginTop: -12,
    marginHorizontal: 20,
    color: '#fff',
    backgroundColor: '#FF63',
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
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    marginTop: 50,
    marginLeft: 20,
  },
  Workinput: {
    backgroundColor: '#FF63',
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  imagesView: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 20,
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

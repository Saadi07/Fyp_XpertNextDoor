/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  LogBox,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
const {width} = Dimensions.get('window');
import CountDown from 'react-native-countdown-component';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

const OrderProgressDetailScreen = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    'Are you sure to complete order?',
  );
  const [alertTitle, setAlertTitle] = useState('Order Completed');

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };
  var time = new Date().toTimeString();
  console.log(time);
  console.log(route.params.item);

  return (
    <View style={styles.container}>
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
          console.log(route.params);
          navigation.navigate('FaceRecognitionScreen', route.params);
          //setModalVisible(true);
          setShowAlert(false);
        }}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
      />
      <View style={styles.WorkTime}>
        <Text style={{color: 'grey', fontSize: 18}}>Your Work Started At</Text>
        <View style={styles.TimeContainer}>
          <Text style={{color: 'black', fontSize: 20, marginTop: 45}}>
            {time}
          </Text>
        </View>
      </View>
      <View style={styles.OrderDetails}>
        <Text style={styles.TittleText}>Order Details</Text>
        <Text style={styles.DescriptionTittle}>Booking Date</Text>
        <Text style={{color: 'grey', padding: 5}}>
          {new Date(route.params.item.createdAt).toDateString()}
        </Text>
        <Text style={styles.DescriptionTittle}>Work Description</Text>
        <Text style={{color: 'grey', padding: 5, textAlign: 'justify'}}>
          {route.params.item.description}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.commandButton}
        onPress={() => {
          setShowAlert(true);
        }}>
        <Text style={styles.panelButtonTitle}>Work Completed</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderProgressDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  WorkTime: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TimeContainer: {
    marginTop: 10,
    height: 120,
    width: 320,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  TittleText: {
    color: 'black',
    fontSize: 28,
    fontWeight: '700',
    alignSelf: 'center',
  },
  OrderDetails: {
    padding: 10,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  DescriptionTittle: {
    padding: 5,
    color: 'black',
    marginTop: 20,
    fontSize: 18,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 90,
    marginHorizontal: 30,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
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
});

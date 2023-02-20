/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  StripeProvider,
  useStripe,
  CardField,
} from '@stripe/stripe-react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {Button} from 'react-native-paper';
import axios from 'axios';
import Loader from '../components/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';

var data1 = '';

const PaymentScreen = ({navigation, route}) => {
  const publishableKey =
    'pk_test_51Lt4syGhM53qkdZkCDR8sFAcatJSGCOF9uUgmx3WUAG6PoCmgtMyhRHmEj6Sy9qBNU5f8EgHmxdYMQUvun7pSwmf00Fh2po2yB';
  const {confirmPayment} = useStripe();
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  //console.log(route.params);
  useEffect(() => {
    async function fetchAPI() {
      console.log('hell0');
      try {
        await fetch('http://192.168.184.36:6000/api/card/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({}),
        }).then(async response => {
          const json = await response.json();
          console.log(json);
          setKey(json.dt);
          //console.log(key);
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchAPI();
  }, []);

  async function PaymentDone() {
    try {
      const body = {
        method: 'Card',
      };
      const response = await axios
        .put(
          'https://gentle-oasis-88778.herokuapp.com/client/pay/' +
            route.params.orderId,
          body,
        )
        .then(res => {
          var res = res.data;
          console.log('pay', res);
          if (res) {
            navigation.navigate('GiveFeedbackScreen', route.params);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  const submit = async () => {
    setLoading(true);
    try {
      const payment = await confirmPayment(key, {
        paymentMethodType: 'Card',
        billingDetails: {
          email: 'minalrizwaan@gmail.com',
        },
      })
        .then(async res => {
          setLoading(false);
          console.log(res.paymentIntent.status);
          if (res.paymentIntent.status === 'Succeeded') {
            PaymentDone();
            setShowAlert(true);
            setAlertTitle('Successfull');
            setAlertMessage('Your was Payment Successfull!');
          } else {
            setShowAlert(true);
            setAlertTitle('Failed');
            setAlertMessage('Failed to make payment');
          }
        })
        .catch(() => {
          setShowAlert(true);
          setAlertTitle('Failed');
          setAlertMessage('Failed to make payment');
        });
      //console.log(payment)
    } catch (err) {
      alert('cannot process your payment');
    }
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Okay"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
      <StripeProvider publishableKey={publishableKey}>
        <View>
          <Text
            style={{
              color: 'black',
              padding: 20,
              fontSize: 28,
              fontWeight: '500',
            }}>
            Enter your Payment Details Below!
          </Text>
          <CardField
            postalCodeEnabled={true}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: '#B3B6B7',
              textColor: '#000000',
            }}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 30,
            }}
            onCardChange={cardDetails => {
              console.log('cardDetails', cardDetails);
            }}
            onFocus={focusedField => {
              console.log('focusField', focusedField);
            }}
          />
          <TouchableOpacity
            style={styles.commandButton}
            onPress={() => {
              submit();
            }}>
            <Text style={styles.panelButtonTitle}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </StripeProvider>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  commandButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: 'black',
    alignItems: 'center',
    marginTop: 50,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});

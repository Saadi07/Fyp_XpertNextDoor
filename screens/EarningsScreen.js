/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
//import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@react-navigation/native';

const SplashScreen = ({navigation}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6347" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_Balance}>100$</Text>
        <Text style={styles.text_header}>Current Balance</Text>
      </View>
      <View style={styles.footer}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}>
          Here's how you're going
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.Card}>
            <View style={{padding: 4, marginTop: 6}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
                Total Earning
              </Text>
              <Text style={{fontSize: 16, color: 'grey', marginTop: 30}}>
                1650 Rs
              </Text>
            </View>
          </View>
          <View style={styles.Card}>
            <View style={{padding: 4, marginTop: 6}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
                Available Withdrawn
              </Text>
              <Text style={{fontSize: 16, color: 'grey', marginTop: 10}}>
                0 Rs
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.Card}>
            <View style={{padding: 4, marginTop: 6}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
                Total Withdrawn
              </Text>
              <Text style={{fontSize: 16, color: 'grey', marginTop: 10}}>
                1000 Rs
              </Text>
            </View>
          </View>
          <View style={styles.Card}>
            <View style={{padding: 4, marginTop: 6}}>
              <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
                Pending Amount
              </Text>
              <Text style={{fontSize: 16, color: 'grey', marginTop: 10}}>
                650 Rs
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
          <Text style={styles.panelButtonTitle}>Withdraw Amount</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6347',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 15,
  },
  Card: {
    height: 100,
    marginTop: 30,
    width: 150,
    elevation: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text_Balance: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
  },
});

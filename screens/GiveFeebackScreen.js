/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import axios from 'axios';
import StarRating from 'react-native-star-rating-widget';
import RNTextArea from '@freakycoder/react-native-text-area';

const GiveFeedbackScreen = ({navigation, route}) => {
  const [rating, setRating] = useState(0);

  async function Feedback() {
    try {
      const body = {
        rating: rating,
        Comment: 'Feeback done',
      };
      const response = await axios
        .patch(
          'https://gentle-oasis-88778.herokuapp.com/client/giveFeedback/' +
            route.params.orderId,
          body,
        )
        .then(res => {
          var res = res.data;
          console.log('Feedback', res);
          if (res) {
            navigation.navigate('MainTabScreen');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    console.log('rating', rating);
  });

  return (
    <View style={style.container}>
      <Text style={style.text}>Rate Your Experience!</Text>
      <Text style={{color: 'grey', marginLeft: 25}}>
        Are you Satisfied with the Services
      </Text>
      <View style={style.stars}>
        <StarRating
          enableHalfStar={false}
          starSize={50}
          rating={rating}
          onChange={setRating}
          color={'#3c8'}
        />
      </View>
      <View style={style.textAreaContainer}>
        <TextInput
          style={style.textArea}
          underlineColorAndroid="transparent"
          placeholder="Type something"
          placeholderTextColor="grey"
          numberOfLines={10}
          multiline={true}
        />
      </View>
      <TouchableOpacity
        style={style.commandButton}
        onPress={() => {
          Feedback();
        }}>
        <Text style={style.panelButtonTitle}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GiveFeedbackScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: 'black',
    marginHorizontal: 25,
    marginTop: 50,
    fontSize: 28,
    marginBottom: 5,
  },
  stars: {
    margin: 10,
    marginTop: 20,
  },
  textAreaContainer: {
    marginTop: 50,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  textArea: {
    height: 120,
    color: 'black',
    justifyContent: 'flex-start',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#3c8',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 30,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';

const width = Dimensions.get('window').width;

const CompletedJobDetailScreen = ({navigation}) => {
  const Items = [
    {
      productImageList: require('../assets/banners/cleaner-slider1.jpg'),
    },
    {
      productImageList: require('../assets/banners/cleaner-slider1.jpg'),
    },
    {
      productImageList: require('../assets/banners/cleaner-slider1.jpg'),
    },
  ];

  /* async function getData() {
    try {
      const response = await axios.get(
        'https://gentle-oasis-88778.herokuapp.com/tasker/viewPortfolio/' +
          user.loginId,
      );

      return response.data.data;
    } catch (err) {
      console.log(err);
    }
  } */

  return (
    <View style={style.container}>
      <ScrollView>
        <View style={style.sliderContainer}>
          <Swiper
            autoplay
            horizontal={false}
            height={200}
            activeDotColor="#FF6347">
            <View style={style.slide}>
              <Image
                source={require('../assets/banners/Electrian-slider.png')}
                resizeMode="cover"
                style={style.sliderImage}
              />
            </View>
            {Items.map(obj => {
              console.log(obj);
              <View style={style.slide}>
                <Image
                  style={style.sliderImage}
                  source={obj.productImageList}
                />
              </View>;
            })}
          </Swiper>
        </View>
        <View style={style.detailView}>
          <Text style={style.jobTitle}>Plumbing Work</Text>
          <Text style={style.jobDescription}>Fix kitchen water pump</Text>
        </View>
      </ScrollView>
      <Animatable.View animation="fadeInUpBig" style={style.footer}>
        <View>
          <Text style={style.reviewTittle}>Client Reviews</Text>
          <Text style={style.reviewClient}>Mr. Sameer</Text>
          <Text style={style.reviewClient}>
            He is a excellent and very professional worker. I love his work and
            will hire
          </Text>
        </View>
      </Animatable.View>
    </View>
  );
};

export default CompletedJobDetailScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sliderContainer: {
    height: 200,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  detailView: {
    marginVertical: 4,
    marginTop: 60,
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginVertical: 4,
    color: 'black',
    maxWidth: '84%',
  },
  jobDescription: {
    fontSize: 12,
    color: 'black',
    fontWeight: '400',
    letterSpacing: 1,
    opacity: 0.5,
    lineHeight: 20,
    maxWidth: '85%',
    maxHeight: 44,
    marginBottom: 18,
    marginTop: 5,
  },
  footer: {
    flex: 1,
    height: 90,
    backgroundColor: '#FF6347',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  reviewTittle: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginVertical: 4,
    color: '#fff',
    maxWidth: '84%',
  },
  reviewClient: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '400',
    letterSpacing: 1,
    opacity: 0.5,
    lineHeight: 20,
    maxWidth: '85%',
    maxHeight: 44,
    marginBottom: 18,
    marginTop: 5,
  },
});

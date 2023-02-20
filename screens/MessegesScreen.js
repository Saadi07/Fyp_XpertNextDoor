import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
var friendusers = [];
const MessagesScreen = ({navigation}) => {
  // const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    const getUserDetails = async () => {
      const getUser = await AsyncStorage.getItem('user');
      const userData = JSON.parse(getUser);
      setCurrentUser(() => userData);
    };
    getUserDetails();
  }, []);

  useEffect(() => {
    const getConversations = async () => {
      const getUser = await AsyncStorage.getItem('user');
      const userData = JSON.parse(getUser);
      try {
        const url =
          'http://192.168.43.36:4000/api/conversations/' + userData.loginId;
        await axios.get(url).then(async response => {
          let conversations = response.data;
          //var getUsers = [];
          console.log(conversations);
          friendusers = conversations;
          //for (let i = 0; i < conversations.length; i++) {
          //const friendId = conversations[i].members.find(
          //m => m !== userData._id,
          // );
          /*if (userData.role === 'tasker') {
              await axios
                .get(
                  'https://gentle-oasis-88778.herokuapp.com/client/profile/' +
                    friendId,
                )
                .then(res => {
                  let data = res.data.data;
                  data.convId = conversations[i]._id;
                  data.members = conversations[i].members;
                  getUsers.push(res.data.data);
                })
                .catch(err => {
                  console.log('error in frienduser', err);
                });
            } else {
              await axios
                .get(
                  'https://gentle-oasis-88778.herokuapp.com/tasker/profile/' +
                    friendId,
                )
                .then(res => {
                  let data = res.data.data;
                  data.convId = conversations[i]._id;
                  data.members = conversations[i].members;
                  getUsers.push(res.data.data);
                })
                .catch(err => {
                  console.log('error in frienduser', err);
                });
            } */
          // }
          // friendusers = getUsers;
        });
      } catch (err) {
        console.log('Get Conversations', err);
      }
    };

    getConversations();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <FlatList
        data={friendusers}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('ChatScreen', {
                currentChat: {
                  userName: item.name,
                  convId: item._id,
                  userId: currentUser.loginId,
                  members: item.members,
                },
              })
            }>
            <View style={styles.userInfo}>
              <View style={styles.userImgWrapper}>
                <Image
                  style={styles.userImage}
                  source={require('../assets/pngegg.png')}
                />
              </View>
              <View style={styles.textSection}>
                <View style={styles.userInfoText}>
                  <Text style={styles.userNameText}>MOHSIN</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  card: {
    width: '100%',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImgWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
  },

  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  textSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },

  userInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  userNameText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
  },

  messageTime: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Lato-Regular',
  },

  messageText: {
    fontSize: 14,
    color: '#333333',
  },
});

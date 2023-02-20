import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, ScrollView, Text, Button, StyleSheet} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import io from 'socket.io-client';

const ChatScreen = ({route}) => {
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const currentChat = route.params.currentChat;

  useEffect(() => {
    socket.current = io('http://192.168.43.36:4000');
    socket.current.emit('addUser', currentChat.userId);
  }, [currentChat.userId]);

  useEffect(() => {
    console.log('im runinng');
    socket.current.on('getMessage', data => {
      //console.log('good1');
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, data),
      );
    });
  }, []);

  useEffect(() => {
    const getConversations = async () => {
      if (currentChat.convId !== '') {
        try {
          console.log(currentChat.convId);
          const url =
            'http://192.168.43.36:4000/api/chat/' + currentChat.convId;
          //console.log(url);
          const res = await axios.get(url);
          console.log('Messages gestting', res.data);
          setMessages(res.data.reverse());
        } catch (err) {
          console.log('Get Messages', err);
        }
      } else {
        const body = {
          senderId: currentChat.userId,
          receiverId: currentChat.receiverId,
        };
        const url = 'http://192.168.0.41:4000/api/conversations';
      }
    };

    getConversations();
  }, [currentChat]);

  const renderSend = props => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{marginBottom: 5, marginRight: 5}}
            size={32}
            color="#FF6347"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#FF6347',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const onSend = useCallback(
    async (msg = []) => {
      console.log(msg);
      const message = {
        user: {_id: currentChat.userId},
        text: msg[0].text,
        conversationId: currentChat.convId,
      };
      //console.log('ssssssss', message);
      const receiverId = currentChat.members.find(
        member => member !== currentChat.userId,
      );
      console.log(currentChat.members);

      socket.current.emit('sendMessage', {
        senderId: currentChat.userId,
        receiverId: receiverId,
        text: msg[0].text,
      });
      try {
        const url = 'http://192.168.0.41:4000/api/chat/';
        console.log(url);
        const res = await axios.post(url, message);
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, msg),
        );
        console.log(res.data);
      } catch (err) {
        console.log('Get Messages', err);
      }
    },
    [currentChat.convId, currentChat.members, currentChat.userId],
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: currentChat.userId,
      }}
      renderBubble={renderBubble}
      renderSend={renderSend}
      alwaysShowSend
      scrollToBottom
      //scrollToBottomComponent={scrollToBottomComponent}
    />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

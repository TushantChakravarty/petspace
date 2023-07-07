import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'native-base';
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import MyHeader from '../components/ReusableElements/MyHeader';
import {firebase, firestore} from "@react-native-firebase/firestore"
import { url } from './constants/constants';
import { useFocusEffect } from '@react-navigation/native';

export default function ChatScreen2(props) {
  const [messages, setMessages] = useState([]);
  const[userId, setUser] = useState()
  const [chatId, setChatId] = useState()
 const getUser =()=>{
   AsyncStorage.getItem('user')
  .then((response)=>{
    setUser(response)
  })
 }


 const getAllMsgs = async (chatId)=>{
  const querySwap = await firebase.firestore().collection('chats')
  .doc(chatId)
  .collection('messages')
  .orderBy('createdAt', "desc")
  .get()
  const allMsgs = querySwap.docs.map(docSwap =>{
    return{
      ...docSwap.data(),
      createdAt:docSwap.data().createdAt?docSwap.data().createdAt.toDate():null
    }
  })
  setMessages(allMsgs)

 }

 async function sendNotification(Token,user,message,title)
 {
  const token = await AsyncStorage.getItem('token')

  await fetch(`${url}/user/sendnotification`,{
    method: 'POST',
    headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
    },
   body: JSON.stringify({
    Token:Token,
    message:message,
    title:title,
    user:user,
    token:token
    
             })
   }).then((response) => response.json())
   .then((responseJson) => {
    //console.log(responseJson)
    if(responseJson.responseCode===403)
    {
      //console.log(response)
      alert('invalid Login. Please log in again')
      return
    }
    if(responseJson){
            //signIn(responseJson.user,responseJson.token)
            //alert('success')

           // navigation.navigate('HomeDrawer')
           console.log(responseJson)
        
    }
    
    
  })
 }


  
  const onSend = useCallback(async(messages = [],CHATID,sentTo) => {
    try{

      let user = await AsyncStorage.getItem('user')
      let name = await AsyncStorage.getItem('name')
      //String(user).length>String(props.route.params.userId).length?String(props.route.params.chatId)+String(user):String(user).length<String(props.route.params.userId).length?String(props.route.params.chatId)+String(props.route.params.userId):String(user).length==String(props.route.params.userId).length?String(user)+String(props.route.params.chatId)+String(props.route.params.userId):String(user)+String(props.route.params.chatId)+String(props.route.params.userId)
      //getUser()
      const msg = messages[0]
      const myMsg ={
        ...msg,
        sentBy:userId?userId:user,
        sentTo:sentTo, 
        createdAt: new Date()
      }
      setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
      
      firebase.firestore().collection("chats")
      .doc(CHATID)
      .collection('messages')
      .add({...myMsg, createdAt:firebase.firestore.FieldValue.serverTimestamp()})

      await sendNotification(props.route.params.fcmKey,JSON.parse(name),msg.text, 'petSpace')
      
    }catch(e){
      alert(e.message)
    }
      
  
  }, [])

  useEffect(() => {
    getUser()
    getAllMsgs(props.route.params.chatId)
    }, [])

    useEffect(() => {
      const interval = setInterval(() => {
        //console.log('This will run every second!');
        getAllMsgs(props.route.params.chatId)
      }, 5000);
      return () => clearInterval(interval);
    }, []);
  
  return (
    <View style={{display:'flex', flex:1}}>
    <MyHeader Title={props.route.params.userId}/>
    <GiftedChat
      
      messages={messages}
      onSend={messages => {
        onSend(messages,props.route.params.chatId,props.route.params.userId)}}
      user={{
          _id: userId,
        }}
        />
        </View>
  )
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'native-base';
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import MyHeader from '../components/ReusableElements/MyHeader';
import {firebase, firestore} from "@react-native-firebase/firestore"
import { url } from './constants/constants';
import { useFocusEffect } from '@react-navigation/native';

export default function ChatScreen(props) {
  const [messages, setMessages] = useState([]);
  const[userId, setUser] = useState()
 const getUser =()=>{
   AsyncStorage.getItem('user')
  .then((response)=>{
    setUser(response)
  })
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
    if(responseJson){
      if(responseJson.responseCode===403)
      {
        //console.log(response)
        alert('invalid Login. Please log in again')
        return
      }
            //signIn(responseJson.user,responseJson.token)
            //alert('success')

           // navigation.navigate('HomeDrawer')
           console.log(responseJson)
        
    }
    
    
  })
 }

const addMessages = async (email,messageId, fcmKey,name,profilePhotoUri)=>{
  console.log(messageId,email)
  const user = await AsyncStorage.getItem('user')
  const token = await AsyncStorage.getItem('token')

  await fetch(`${url}/user/uploadMessage`,{
    method: 'POST',
    headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
    },
   body: JSON.stringify({
    token:token,
    emailId:email,
    messageId:messageId,
    userId:userId?userId:user,
    fcmKey:fcmKey,
    name:name,
    profilePhotoUri:profilePhotoUri
             })
   }).then((response) => response.json())
   .then(async (responseJson) => {
    //console.log(responseJson)
    if(responseJson){
      if(responseJson.responseCode===403)
          {
            //console.log(response)
            alert('invalid Login. Please log in again')
            return
          }
          
        if(responseJson.responseCode===200)
        {
            //signIn(responseJson.user,responseJson.token)
            //alert('success')

           // navigation.navigate('HomeDrawer')
           console.log(responseJson)
        }
    }
    
    
  })
}

const addMessages2 = async (email,messageId, fcmKey,name,profilePhotoUri)=>{
  console.log(messageId,email)
  const token = await AsyncStorage.getItem('token')

  await fetch(`${url}/user/uploadMessage`,{
    method: 'POST',
    headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
    },
   body: JSON.stringify({
    token:token,
    emailId:email,
    messageId:messageId,
    userId:props.route.params.userId,
    fcmKey:fcmKey,
    name:name,
    profilePhotoUri:profilePhotoUri
   

             })
   }).then((response) => response.json())
   .then(async (responseJson) => {
    //console.log(responseJson)
    if(responseJson){
      if(responseJson.responseCode===403)
      {
        //console.log(response)
        alert('invalid Login. Please log in again')
        return
      }
        if(responseJson.responseCode===200)
        {
            //signIn(responseJson.user,responseJson.token)
            //alert('success')

           // navigation.navigate('HomeDrawer')
           console.log(responseJson)
        }
    }
    
    
  })
}


 const getAllMsgs = async ()=>{
  const docId = props.route.params.chatId
  let user 
  AsyncStorage.getItem('user')
  .then((response)=>{
    console.log(response)
    user = response
  })
  const uniqueId = await AsyncStorage.getItem('uniqueId')
  const postUniqueId = props.route.params.uniqueId
  console.log(uniqueId)
  console.log(postUniqueId)
  let chatId = uniqueId>postUniqueId?uniqueId+postUniqueId+props.route.params.chatId:postUniqueId+uniqueId+props.route.params.chatId
   console.log(chatId)
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
  useEffect( () => {
    getUser()
    getAllMsgs()

    console.log(props.route.params.userId,userId)
    }, [])

    useEffect(() => {
      const interval = setInterval(() => {
        //console.log('This will run every second!');
        getAllMsgs()
      }, 5000);
      return () => clearInterval(interval);
    }, []);
  

  const onSend = useCallback(async(messages = []) => {
    let user = await AsyncStorage.getItem('user')
    const fcmKey = await AsyncStorage.getItem('fcmtoken')
    const tokenKey = JSON.parse(fcmKey)
    const uniqueId = await AsyncStorage.getItem('uniqueId')
    const postUniqueId = props.route.params.uniqueId
    const profilePhotoUri = await AsyncStorage.getItem('profilePhotoUri')
    const userProfilePhoto = props.route.params.profilePhotoUri
    const name = await AsyncStorage.getItem('name')
    const postUserName = await props.route.params.name
    console.log(uniqueId)
    console.log(postUniqueId)
    let chatId = uniqueId>postUniqueId?uniqueId+postUniqueId+props.route.params.chatId:postUniqueId+uniqueId+props.route.params.chatId
   //String(user).length>String(props.route.params.userId).length?String(props.route.params.chatId)+String(user):String(user).length<String(props.route.params.userId).length?String(props.route.params.chatId)+String(props.route.params.userId):String(user).length==String(props.route.params.userId).length?String(user)+String(props.route.params.chatId)+String(props.route.params.userId):String(user)+String(props.route.params.chatId)+String(props.route.params.userId)
    console.log(chatId)
    getUser()
    const msg = messages[0]
    const myMsg ={
      ...msg,
      sentBy:userId?userId:user,
      sentTo:props.route.params.userId,
      createdAt: new Date()
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
    
    firebase.firestore().collection("chats")
    .doc(chatId)
    .collection('messages')
    .add({...myMsg, createdAt:firebase.firestore.FieldValue.serverTimestamp()})

    await sendNotification(props.route.params.fcmKey,JSON.parse(name),msg.text,'petSpace')
  AsyncStorage.getItem(`${props.route.params.chatId}-message-saved`)
  .then((response)=>{
    if(response && response=='saved')
    {
      console.log('saved already')
    }
    else
    {
      addMessages(props.route.params.userId,chatId,tokenKey,JSON.parse(name),JSON.parse(profilePhotoUri))
      .then((response)=>{
        AsyncStorage.setItem(`${props.route.params.chatId}-message-saved`,'saved')
      })    
      addMessages2(userId?userId:user,chatId,props.route.params.fcmKey,postUserName,userProfilePhoto)
      console.log('message saved')
    }
  
  })
  
  }, [])

  return (
    <View style={{display:'flex', flex:1}}>
    <MyHeader Title={props.route.params.userId}/>
    <GiftedChat
      
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
          _id: userId,
        }}
        />
        </View>
  )
}
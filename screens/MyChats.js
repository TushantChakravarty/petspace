import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, useNativeBase, ScrollView, Center , HStack, VStack, Skeleton, Box, Badge} from "native-base";
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Avatar, Card, Title, Paragraph } from "react-native-paper";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { getUserProfile } from "./apis/profileApis";
import { firebase, firestore } from "@react-native-firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MyHeader from "../components/ReusableElements/MyHeader";
import { RefreshControl } from 'react-native-gesture-handler';

export default function MyChats() {
  const [messages, setMessages] = useState();
  const navigation = useNavigation()
  const[loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState()
  const [ error, setError] = useState(false)
  const LoadingSkeleton = () => {
    return (
      <View >
        <View style={{height:heightPercentageToDP(15),marginTop:10}}>
    <Center w="100%">
        <HStack w="90%" maxW="400" borderWidth="1" space={8}  rounded="md" _dark={{
          borderColor: "coolGray.500"
        }} _light={{
          borderColor: "coolGray.200"
        }} p="4">
          <Skeleton flex="1" h="100%" w={'10%'} width={widthPercentageToDP(20)} rounded="full" startColor="coolGray.100" />
          <VStack flex="1" space="1">
            <Skeleton.Text />
            </VStack>
        </HStack>
      </Center>
      
        </View>
        <View style={{height:heightPercentageToDP(15), marginTop:10}}>
    <Center w="100%">
        <HStack w="90%" maxW="400" borderWidth="1" space={8} rounded="md" _dark={{
          borderColor: "coolGray.500"
        }} _light={{
          borderColor: "coolGray.200"
        }} p="4">
          <Skeleton flex="1" h="100%" w={'10%'} width={widthPercentageToDP(20)} rounded="full" startColor="coolGray.100" />
          <VStack flex="1" space="1">
            <Skeleton.Text />
            </VStack>
        </HStack>
      </Center>
      
        </View>
        <View style={{height:heightPercentageToDP(15),marginTop:10}}>
    <Center w="100%">
        <HStack w="90%" maxW="400" borderWidth="1" space={8} rounded="md" _dark={{
          borderColor: "coolGray.500"
        }} _light={{
          borderColor: "coolGray.200"
        }} p="4">
          <Skeleton flex="1" h="100%" w={'10%'} width={widthPercentageToDP(20)} rounded="full" startColor="coolGray.100" />
          <VStack flex="1" space="1">
            <Skeleton.Text />
            </VStack>
        </HStack>
      </Center>
      
        </View>
        <View style={{height:heightPercentageToDP(15),marginTop:10}}>
    <Center w="100%">
        <HStack w="90%" maxW="400" borderWidth="1" space={8} rounded="md" _dark={{
          borderColor: "coolGray.500"
        }} _light={{
          borderColor: "coolGray.200"
        }} p="4">
          <Skeleton flex="1" h="100%" w={'10%'} width={widthPercentageToDP(20)} rounded="full" startColor="coolGray.100" />
          <VStack flex="1" space="1">
            <Skeleton.Text />
            </VStack>
        </HStack>
      </Center>
      
        </View>
        <View style={{height:heightPercentageToDP(15),marginTop:10}}>
    <Center w="100%">
        <HStack w="90%" maxW="400" borderWidth="1" space={8} rounded="md" _dark={{
          borderColor: "coolGray.500"
        }} _light={{
          borderColor: "coolGray.200"
        }} p="4">
          <Skeleton flex="1" h="100%" w={'10%'} width={widthPercentageToDP(20)} rounded="full" startColor="coolGray.100" />
          <VStack flex="1" space="1">
            <Skeleton.Text />
            </VStack>
        </HStack>
      </Center>
      
        </View>
 
      </View>
    )
  };

  function Example({number}) {
    return <Box alignItems="center">
        <VStack>
          <Badge // bg="red.400"
        colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
          fontSize: 15
        }}>
            {number}
          </Badge>
          </VStack>
      </Box>;
  }

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getMsgs()
      setRefreshing(false);
    }, 1500);
  };

  async function getUserMsg(chatId) {
    const querySwap = await firebase
      .firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();
    const allMsgs = querySwap.docs.map((docSwap) => {
      return {
        ...docSwap.data(),
        createdAt: docSwap.data().createdAt
          ? docSwap.data().createdAt.toDate()
          : null,
      };
    });
    return allMsgs;
  }

  const getMsgs =async ()=>{
    AsyncStorage.getItem("user").then(async (response) => {
      const user = response
      console.log(user)
      await getUserProfile(response).then((response) => {
        if(response.responseCode===403)
        {
          //console.log(response)
          //AsyncStorage.setItem('tokenError')
          setError(true)
          alert('invalid Login. Please log in again')
          return
        }
        const msgs = response.messages
        let list =[]
        msgs.map(async (item)=>{
          const oldMessages = await AsyncStorage.getItem(`${item.messageId}`)
          const userMsg = await getUserMsg(item.messageId)
          const profile = await getUserProfile(item.userId)
          let data = item
          if(!oldMessages)
          {
            AsyncStorage.setItem(`${item.messageId}`,JSON.stringify(userMsg))
          }

          if(oldMessages)
          {
            if(JSON.parse(oldMessages).length<userMsg.length){
              let list =[]
              const arrLength = userMsg.length - JSON.parse(oldMessages).length 
              for(let i=0;i<arrLength;i++)
              {
                console.log(userMsg[i])
                console.log(oldMessages[i])
                if(userMsg[i].sentBy!==user)
                {
                  list.push(userMsg[i])
                }
              }
              if(list.length!==0)
              {

                const length = list.length
                console.log(length)
                console.log(`new message arrived for ${item.name?item.name:item.userId}`)
                data.newMessage = true
                data.newMessageLength = length
                //AsyncStorage.setItem(`${item.messageId}`,JSON.stringify(userMsg))
                
              }
              
            }
          }
          console.log("Hi old message",oldMessages)
          data.lastMsg = userMsg[0].text
          data.profilePhotoUri=profile.profilePhotoUri
          list.push(data)
          if(list.length === msgs.length)
          {
            setMessages(list.reverse())
          }
        })
       // setMessages(response.messages);
      });
    });
  }
  useEffect(() => {
    getMsgs()
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      //console.log('This will run every second!');
      if(!error)
      {
        getMsgs()
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={style.container}>
      <MyHeader Title={'My Chats'}/>
      <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }
      >
      {messages ? (
        messages.map((item) => {
         
         console.log(item)
          return (
            <TouchableOpacity
            style={{display:'flex', alignContent:'center', justifyContent:'center', alignItems:'center'}}
              onPress={async ()=>{
                let userId = item.userId
                let chatId = item.messageId
                const userMsg = await getUserMsg(item.messageId)
                AsyncStorage.setItem(`${item.messageId}`,JSON.stringify(userMsg))
                console.log(chatId)
                navigation.navigate('MyChats',{
                  userId:userId,
                  chatId:chatId,
                  fcmKey:item.fcmKey
                })
              }}
            >
            <View
              style={{
                borderBottomWidth:0.5,
                borderRadius: 5,
                width: widthPercentageToDP(95),
                height: heightPercentageToDP(10),
                display: "flex",
                alignContent: "center",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor:'white',
                marginTop:10,
                borderBottomColor:'grey'
              }}
            >
              <Avatar.Image
              style={{marginLeft:20}}
                size={50}
                source={{
                  uri: item.profilePhotoUri?item.profilePhotoUri:"https://bootdey.com/img/Content/avatar/avatar1.png",
                }}
              />
              <View>
              <Text style={{ marginLeft: 20, fontSize:15, fontWeight:'bold' }}>{item.name?item.name:item.userId}</Text>
              <Text style={{  marginTop:10, color:'black',marginLeft: 20 }}>{item.lastMsg}</Text>
              </View>
              {
                item.newMessage &&(
                <View  style={{width:widthPercentageToDP(50),display:'flex',position:'absolute',right:50,alignContent:'flex-end',justifyContent:'flex-end', alignItems:'flex-end'}}>
                <Example number={item.newMessageLength}/>
                </View>
                  )
              }

            </View>
            </TouchableOpacity>
          );
        })
      ) : 
      (
        <View>
        <LoadingSkeleton/>

        </View>
        )

}
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    height: heightPercentageToDP(100),
    backgroundColor:'white'
  },
});

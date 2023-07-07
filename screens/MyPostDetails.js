import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation, useTheme } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar,  Card, Title, Paragraph } from 'react-native-paper';
import { SliderBox } from "react-native-image-slider-box";
import { url } from "./constants/constants";
import {Button} from 'native-base'
import AsyncStorage from "@react-native-async-storage/async-storage";
const MyPostDetails = ( props ) => {
  const navigation = useNavigation()
  const LeftContent = propss => <Avatar.Image
  size={50}
  source={{ uri: `${props.route.params.data.photoUri[0]?props.route.params.data.photoUri[0].path:props.route.params.Images[0]}` }} />

  async function deleteFromAllPosts(user,postNumber){
    const token = await AsyncStorage.getItem('token')

    let res = await fetch(`${url}/user/deleteFromAllPosts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        postNumber:postNumber,
        token:token
       }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          if(response.responseCode===403)
        {
          //console.log(response)
          alert('invalid Login. Please log in again')
          return
        }
          console.log(responseJson)
        }
      });
  }

  async function deleteFromUserPosts(user,postNumber){
    const token = await AsyncStorage.getItem('token')

    let res = await fetch(`${url}/user/deleteFromUserPosts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        postNumber:postNumber,
        token:token
       }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          if(responseJson.responseCode===403)
        {
          //console.log(response)
          alert('invalid Login. Please log in again')
          return
        }
          console.log(responseJson)
        }
      });
  }


  return (
        <Card style={{height:hp(100)}}>
      <Card.Title  title={props.route.params.data.pet} subtitle={props.route.params.data.city} left={LeftContent} />
      <Card.Content style={{marginTop:hp(1)}}>
        <Title>{props.route.params.data.pet}</Title>
        <Paragraph>{props.route.params.data.state}</Paragraph>
        <Paragraph>{props.route.params.data.description}</Paragraph>
        <Paragraph>{props.route.params.data.healthDetails}</Paragraph>

      </Card.Content>
      <SliderBox images={props.route.params.Images} />
      <Card.Actions>
        <Button
        onPress={async ()=>{
          const user = await AsyncStorage.getItem('user')
          console.log(user)
          console.log(props.route.params.data.postNumber)
          try{

            await deleteFromAllPosts(user,props.route.params.data.postNumber)
            await deleteFromUserPosts(user,props.route.params.data.postNumber)
          }catch(e){
            console.log(e)
          }

        }}
        >Delete</Button>
      </Card.Actions>
    </Card>
  );
};

export default MyPostDetails;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height:hp(85),
    width:wp(100)
  },
});

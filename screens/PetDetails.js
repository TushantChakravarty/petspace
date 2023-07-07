import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation, useTheme } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { SliderBox } from "react-native-image-slider-box";
import { url } from "./constants/constants";

const PetDetails = ( props ) => {
  const [posts, setPosts] = useState();
  const [color, changeColor] = useState("red");
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation()
  
  const LeftContent = propss => <Avatar.Image
  size={50}
  source={{ uri: `${props.route.params.data.photoUri[0].path?props.route.params.data.photoUri[0].path:props.route.params.data.photoUri}` }} />

  useEffect(()=>{
    console.log(props.route.params.data)
  },[])


  return (
        <Card style={{height:hp(100)}}>
          <TouchableOpacity onPress={()=>{
            navigation.navigate('postuserprofile',{
              userId:props.route.params.data.user,
            })
          }}>
      <Card.Title  title={props.route.params.data.pet} subtitle={props.route.params.data.city} left={LeftContent} />
          </TouchableOpacity>
      <Card.Content style={{marginTop:hp(1)}}>
        <Title>{props.route.params.data.pet}</Title>
        <Paragraph>{props.route.params.data.state}</Paragraph>
        <Paragraph>{props.route.params.data.description}</Paragraph>
        <Paragraph>{props.route.params.data.healthDetails}</Paragraph>

      </Card.Content>
      <SliderBox images={props.route.params.images} />

      <Card.Actions>
        <Button>Call</Button>
      </Card.Actions>
      <Card.Actions>
        <Button onPress={()=>{
          navigation.navigate('ChatScreen',{
            userId:props.route.params.data.user,
            chatId:props.route.params.data._id,
            uniqueId:props.route.params.data.uniqueId,
            fcmKey:props.route.params.data.fcmKey,
            name:props.route.params.data.name,
            profilePhotoUri:props.route.params.data.profilePhotoUri
          })
        }}>Chat</Button>
      </Card.Actions>
    </Card>
  );
};

export default PetDetails;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height:hp(85),
    width:wp(100)
  },
});

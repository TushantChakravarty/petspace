import React, { useEffect, useState } from 'react';
import {
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from "./constants/colors";
import { SliderBox } from "react-native-image-slider-box";
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { url } from './constants/constants';

const MyPostDetails2 = ({navigation, route}) => {
    const [loading,setLoading] = useState(false)
  const pet = route.params.data;
  const images = route.params.Images

  console.log(pet)
  console.log(images)

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
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.background} />
      <View style={{height: 400, backgroundColor: COLORS.background}}>
        
          {/* Render  Header */}
          <View style={style.header}>
            <Icon
              name="arrow-left"
              size={28}
              color={COLORS.dark}
              onPress={navigation.goBack}
              />
               <Text>{ "< Swipe to see more >" } </Text>
            <Icon name="dots-vertical" size={28} color={COLORS.dark} />
          </View>
          <View style={{height:heightPercentageToDP(45)}}>
           <SliderBox images={images} sliderBoxHeight={500} dotColor="#FFEE58"
  inactiveDotColor="black"
  paginationBoxVerticalPadding={20}
   dotStyle={{
    width: 15,
    height: 15,
    borderRadius: 15,
    marginHorizontal: 10,
    bottom:widthPercentageToDP(80),
    margin: 0
  }}/>
            </View>
           
        <View style={style.detailsContainer}>
          {/* Pet name and gender icon */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{fontSize: 20, color: COLORS.dark, fontWeight: 'bold'}}>
              {pet.petName?pet.petName:'Lucy'}
            </Text>
            <Icon name="gender-male" size={25} color={COLORS.grey} />
          </View>

          {/* Render Pet type and age */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text style={{fontSize: 12, color: COLORS.dark}}>{pet.pet}</Text>
            <Text style={{fontSize: 13, color: COLORS.dark}}>AGE: {pet.age}</Text>
          </View>

          {/* Render location and icon */}
          <View style={{marginTop: 5, flexDirection: 'row'}}>
            <Icon name="map-marker" color={COLORS.primary} size={20} />
            <Text style={{fontSize: 14, color: COLORS.grey, marginLeft: 5}}>
              {pet?`${pet.city}, ${pet.state}`:'Bulvarna-Kudriavska Street, Kyiv'}
            </Text>
          </View>
        </View>
      </View>

      {/* Comment container */}
      <View style={{marginTop: 80, justifyContent: 'space-between', flex: 1}}>
        <View>
          {/* Render user image , name and date */}
          <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
            <Image
              source={{uri:images[0]}}
              style={{height: 40, width: 40, borderRadius: 20}}
            />
            <View style={{flex: 1, paddingLeft: 10}}>
              <Text
                style={{color: COLORS.dark, fontSize: 12, fontWeight: 'bold'}}>
                {route.params.name?route.params.name:'JANE GARY'}
              </Text>
              <Text
                style={{
                  color: COLORS.grey,
                  fontSize: 11,
                  fontWeight: 'bold',
                  marginTop: 2,
                }}>
                Owner
              </Text>
            </View>
            <Text style={{color: COLORS.grey, fontSize: 12}}>{pet.date?pet.date:'May 25, 2020'}</Text>
          </View>
          <Text style={style.comment}>
          {pet?pet.description: `My job requires moving to another country. I don't have the
            opputurnity to take the cat with me. I am looking for good people
            who will shelter my Lily`}
          </Text>
        </View>

        {/* Render footer */}
        <View style={style.footer}>
          <View style={style.btn}>
            <TouchableOpacity
                onPress={async ()=>{
                    setLoading(true)
                    const user = await AsyncStorage.getItem('user')
                    console.log(user)
                    console.log(pet.postNumber)

                    try{
          
                      await deleteFromAllPosts(user,pet.postNumber)
                      .then(async()=>{
                          await deleteFromUserPosts(user,pet.postNumber)
                          .then(()=>{
                            setLoading(false)
                            alert('Post deleted successfully')
                            navigation.navigate('Profile')
                          })
                      })
                    }catch(e){
                      console.log(e)
                    }
          
                  }}
            >    
            
            <Text style={{color: COLORS.white, fontWeight: 'bold'}}>
             { loading?<ActivityIndicator size={'small'} color={'white'}/>:'Delete'}
            
            </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  detailsContainer: {
    height: 120,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    flex: 1,
    bottom: -70,
    borderRadius: 18,
    elevation: 10,
    padding: 20,
    justifyContent: 'center',
    position:'absolute',
    width:widthPercentageToDP(90)
  },
  comment: {
    marginTop: 10,
    fontSize: 12.5,
    color: COLORS.dark,
    lineHeight: 20,
    marginHorizontal: 20,
  },
  footer: {
    height: 100,
    backgroundColor: COLORS.light,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconCon: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  btn: {
    backgroundColor: COLORS.primary,
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
});
export default MyPostDetails2;
/**
 <View style={style.iconCon}>
            <Icon name="heart-outline" size={22} color={COLORS.white} />
          </View>
          
 */
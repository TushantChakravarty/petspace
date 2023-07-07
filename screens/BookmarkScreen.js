import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions , Image} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {default as ICON} from 'react-native-vector-icons/Ionicons'
import COLORS from './constants/colors';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
const { height, width } = Dimensions.get("window");

const BookmarkScreen = () => {
  const[bookMarks, setBookMarks] = useState()
  const[loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const Card = ({ pet, navigation, images, frontImage }) => {
    console.log('pet',pet)
    console.log(frontImage)

    return (
      
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("PetDetails", {
            data: pet,
            images: images,
          })
        }
      >
        <View style={styles.cardContainer}>
          {/* Render the card image */}
          <View style={styles.cardImageContainer}>
            <Image
              source={{ uri: `${frontImage}` }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
          </View>
  
          {/* Render all the card details here */}
          <View style={styles.cardDetailsContainer}>
            {/* Name and gender icon */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontWeight: "bold", color: COLORS.dark, fontSize: 20 }}
              >
                {pet?.description.substring(0,10)+`...`}
              </Text>
              <Icon name="gender-male" size={22} color={COLORS.grey} />
            </View>
  
            {/* Render the age and type */}
            <Text style={{ fontSize: 12, marginTop: 5, color: COLORS.dark }}>
              {pet?.healthDetails}
            </Text>
            <Text style={{ fontSize: 10, marginTop: 5, color: COLORS.grey }}>
              Age: {pet?.age}
            </Text>
  
            {/* Render distance and the icon */}
            <View style={{ marginTop: 5, flexDirection: "row" }}>
              <Icon name="map-marker" color={COLORS.primary} size={18} />
              <Text style={{ fontSize: 12, color: COLORS.grey, marginLeft: 5 }}>
                Distance:7.8km
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderItem = useCallback(
    ({item})=>{
      console.log('My card items',item)
      let images = [];
                  if (item.details.photoUri.length > 0) {
                    for (let i = 0; i < item.details.photoUri.length; i++) {
                      // console.log(item.photoUri[i].path)
                      images.push(`${item.details.photoUri[i].path}`);
                    }
                  } else {
                    images.push(`${item.details.photoUri}`);
                  }


                  
                  return(
                    
                    <Card
                    pet={item.details}
                    navigation={navigation}
                    images={images}
                    frontImage={item.details.photoUri[0].path}
                    />
                    )
    }
  )

  
  useEffect(()=>{
    setLoading(true)
    AsyncStorage.getItem('bookmarks')
    .then((bookmarks)=>{
      const BookMarks = JSON.parse(bookmarks)
      console.log("My Bookmark screen",BookMarks)
      if(BookMarks.length!=0)
      {
        setLoading(false)
        setBookMarks(BookMarks)
      }else{
        setLoading(false)

        //setBookMarks([])
      }
    })
  },[])
    return (
      <View style={styles.container}>
        {bookMarks&&!loading?
        <FlatList
        showsVerticalScrollIndicator={false}
        data={bookMarks}
        renderItem={renderItem}
        initialNumToRender={2}

          />
           :
           <View style={{flex:1, alignContent:'center', alignItems:'center', justifyContent:'center'}}><Text>Wow, so Empty</Text></View>}
        </View>
    );
};

export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
     color: COLORS.white
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: height,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 7,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBtn: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  categoryBtnName: {
    color: COLORS.dark,
    fontSize: 10,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    shadowColor: 'black',
  shadowOpacity: 0.26,
  shadowOffset: { width: 0, height: 2},
  shadowRadius: 10,
  elevation: 3,
  backgroundColor: 'white',
  borderRadius:10
  },
  cardDetailsContainer: {
    backgroundColor: COLORS.light,
    flex: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 20,
    justifyContent: "center",
  },
  cardImageContainer: {
    height: 150,
    width: 140,
    backgroundColor: COLORS.background,
    borderRadius: 20,
  },
  dropdownContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
  scrollContainer:{
    alignItems: "center",
    justifyContent: "center",
  },

});


import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getUserProfile } from './apis/profileApis';
import { Avatar } from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { url } from './constants/constants';
import { RefreshControl } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const PostUserProfile = (props) => {

  const [images, setImages] = useState([
    'https://www.bootdey.com/image/280x280/FF00FF/000000',
    'https://www.bootdey.com/image/280x280/00FFFF/000000',
    'https://www.bootdey.com/image/280x280/FF7F50/000000',
    'https://www.bootdey.com/image/280x280/6495ED/000000',
    'https://www.bootdey.com/image/280x280/DC143C/000000',
    'https://www.bootdey.com/image/280x280/008B8B/000000',
  ]);
  
  const [postCount, setPostCount] = useState(10);
  const [followingCount, setFollowingCount] = useState(20);
  const [followerCount, setFollowerCount] = useState(30);
  const [posts, setPosts] = useState()
  const [refreshing, setRefreshing]= useState()
  const [profile, setProfile] = useState({
    emailId: "",
        name: "",
        state:"",
      city:"",
      phoneNumber:"",
      bio:"",
      profilePhotoUri:"https://bootdey.com/img/Content/avatar/avatar1.png"
      
  })
  const[profilePhoto, setProfilePhoto] = useState('https://bootdey.com/img/Content/avatar/avatar1.png')
  const navigation = useNavigation()
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setUserProfile()
      setRefreshing(false);
    }, 1500);
  };

  const setUserProfile = async ()=>
  {
      
      console.log("My emailId",props.route.params.userId)
     await getUserProfile(props.route.params.userId)
      .then((response)=>{
        if(response.responseCode===403)
        {
          //console.log(response)
          alert('invalid Login. Please log in again')
          return
        }
        console.log("my profile details", response)
        setProfile({
        emailId: response.emailId,
        name: response.name,
        state:response.state,
      city:response.city,
      phoneNumber:response.phoneNumber,
      bio:response.bio,
      profilePhotoUri:response.profilePhotoUri
      
        })
        let list =[]
        response.posts.map((item)=>{
          list.push(item)
          if(list.length===response.posts.length)
          {
            setPosts(list)
          }
        })
      })
  }


  useEffect(()=>{
   setUserProfile()
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
        <Image style={styles.avatar} source={{ uri: profile?`${url}/${profile.profilePhotoUri}`:"https://bootdey.com/img/Content/avatar/avatar1.png" }}/>

          <Text style={styles.name}>{profile?profile.name:'John Doe'}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statsBox}>
              <Text style={styles.statsCount}>{posts?posts.length:postCount}</Text>
              <Text style={styles.statsLabel}>Posts</Text>
            </View>
             </View>
          <View style={styles.statsContainer2}>
            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>city</Text>
              <Text style={styles.statsCount}>{profile?profile.city:''}</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>state</Text>
              <Text style={styles.statsCount}>{profile?profile.state:followingCount}</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>Bio</Text>
              <Text style={styles.statsCount}>{profile?profile.bio:followerCount}</Text>
            </View>
          </View>
        </View>
      </View>
      <View
      style={{display:'flex', alignContent:'center', alignItems:'center', borderBottomWidth:1, borderBottomColor:'black'}}
      >
        <Text>My Posts</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}
      refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      
      >
        {posts?posts.map((item, index) => {
          //console.log(item.photoUri[0].path)
          console.log(item)
          return(
            <TouchableOpacity
            style={styles.imageContainer}
            onPress={()=>{
              const data = item
              let Images =[]
               item.photoUri?item.photoUri.map((item)=>{
                
                Images.push(`${item.path}`)
               }):Images = images
              navigation.navigate('MyPostDetails',{
                data,
                Images
              })
            }}
            >
            <View key={index} style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: item.photoUri[0]?`${item.photoUri[0].path}`:images[0] }}/>
            <Text>{item.description}</Text>
          </View>
            </TouchableOpacity>
            )
          })
      :<View>
        <Text>No posts from user</Text>
      </View>
      }
      </ScrollView>
    </View>
  );
};

export default PostUserProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    marginTop:20,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statsContainer2: {
    flexDirection: 'column',
    marginTop: 10,
  },
  statsBox: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statsCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  statsLabel: {
    fontSize: 14,
    color: '#999999',
  },
  body: {
    alignItems: 'center',
    padding: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: widthPercentageToDP('40'),
    padding: 5,
  },
  image: {
    width: '100%',
    height: 120,
  },
});

//<Image style={styles.avatar} source={{ uri: `http://172.20.10.6:2000/${profile.profilePhotoUri}` }}/>
//          <Image style={styles.avatar} source={{ uri: "http://172.20.10.6:2000/profilePhotos/rn_image_picker_lib_temp_0f97bbf1-5a1f-48a5-b494-939fa9f9d0be.jpg" }}/>

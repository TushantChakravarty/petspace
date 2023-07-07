import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ScrollView
} from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Avatar,  Card, Title, Paragraph } from "react-native-paper";
import { url } from "./constants/constants";
import GestureRecognizer, { swipeDirections } from "react-native-swipe-detect";
import { SliderBox } from "react-native-image-slider-box";
import DropdownComponent from "../components/ReusableElements/Dropdown";
import { stateData } from "./constants/constants";
import { generateRandomName, getCities } from "../components/utilityFunctions/utilities";
import CityDropdownComponent from "../components/ReusableElements/Citydropdown";
import DropdownWithDataComponent from "../components/ReusableElements/Dropdownwithdata";
import GetLocation from "react-native-get-location";
import { Button } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile } from './apis/profileApis';
import useFirebaseCloudMessaging from "./notifications/firebase";
import Icon from 'react-native-vector-icons/Ionicons';
import { Center ,  VStack, Skeleton, } from "native-base";

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState();
  const [color, changeColor] = useState("red");
  const [refreshing, setRefreshing] = React.useState(false);
  const [state, setState] = useState(null);
  const [cityData, setCity] = useState(null);
  const [city, selectCity] = useState();
  const [myCity, setMyCity] = useState()
  const [myState, setMyState] = useState()
  const [cityDropdown, setCityDropDown] = useState(false);
  const[isLoading, setLoading]= useState(false)
  const { colors } = useTheme();
  const [allPosts,setAllPosts] = useState([])
  const { getToken, requestUserPermission } = useFirebaseCloudMessaging();

  const LoadingSkeleton = () => {
    return <Center w="100%">
        <VStack w="90%" maxW="400" borderWidth="1" space={8} overflow="hidden" rounded="md" _dark={{
        borderColor: "coolGray.500"
      }} _light={{
        borderColor: "coolGray.200"
      }}>
          <Skeleton h="40" />
          <Skeleton.Text px="4" />
          <Skeleton px="4" my="4" rounded="md" startColor="primary.100" />
        </VStack>
      </Center>;
  };
 
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getAllPosts();
      changeColor("green");
      setRefreshing(false);
    }, 1500);
  };

  const getAllPosts = async (uniqueId) => {
    const user = await AsyncStorage.getItem('user')
   const response = await fetch(`${url}/user/getAllPosts`)
      .then((res) => res.json())
      .then((response) => {
        // console.log(response.responseData);
        console.log(user)
        console.log("Post creator",response.responseData[0].user)
        const POSTS = response.responseData.filter((item)=>{
              return item.uniqueId!==uniqueId
        })
        console.log("UserPosts", POSTS)

        setPosts(POSTS.reverse());
        setAllPosts(POSTS)
        return POSTS

      }).catch((e)=>{
        console.log(e)
      })
      return response
  };

  const getPostsForUser = async (uniqueId) => {
    const user = await AsyncStorage.getItem('user')
   const response = await fetch(`${url}/user/getAllPosts`)
      .then((res) => res.json())
      .then((response) => {
        // console.log(response.responseData);
        console.log(user)
        console.log("Post creator",response.responseData[0].user)
        const POSTS = response.responseData.filter((item)=>{
              return item.uniqueId!==uniqueId
        })
        console.log("UserPosts", POSTS)

        //setPosts(POSTS.reverse());
        setAllPosts(POSTS)
        return POSTS

      }).catch((e)=>{
        console.log(e)
      })
      return response
  };


  const getCity = ()=>{
    console.log(posts)
    if(allPosts&&city&&state){
      setLoading(true)
     
        const filteredPosts = allPosts.filter((item)=>{
          return item.city==city
        })
        setPosts(filteredPosts)
        setLoading(false)
           }
  }
  const getData = async (state) => {
    await getCities(state)
      .then((response) => {
        if (response.data) {
          // console.log(response.data)
          let city = [];
          let data = [];
          data.push(JSON.parse(response.data));
          // data.push(response.data)

          data[0]
            ? data[0].map((item) => {
                city.push({ label: item.name, value: item.name });
              })
            : null;

          setCity(city);
          setCityDropDown(true);
        } else {
          setCityDropDown(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
      if(allPosts&&state){
        setLoading(true)
       
          const filteredPosts = allPosts.filter((item)=>{
            return item.state==state
          })
          setPosts(filteredPosts)
          setLoading(false)
  
        }
  };

  const getDataForUser = async (state,allPosts) => {
    await getCities(state)
      .then((response) => {
        if (response.data) {
          // console.log(response.data)
          let city = [];
          let data = [];
          data.push(JSON.parse(response.data));
          // data.push(response.data)

          data[0]
            ? data[0].map((item) => {
                city.push({ label: item.name, value: item.name });
              })
            : null;

          setCity(city);
          setCityDropDown(true);
        } else {
          setCityDropDown(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
      if(allPosts&&state){
        setLoading(true)
       
          const filteredPosts = allPosts.filter((item)=>{
            return item.state==state
          })
          //setPosts(filteredPosts)
         // setLoading(false)
  
        }
  };
  const getDataFromCity = (allPosts,city,state)=>{
    console.log(posts)
    if(allPosts&&city&&state){
      setLoading(true)
     
        const filteredPosts = allPosts.filter((item)=>{
          return item.city==city
        })
        setPosts(filteredPosts)
       // setLoading(false)
           }
  }

  useEffect(() => {
    console.log("Hi state",state);
    if(state!=null){
    
      getData(state);
    }
    
  }, [state]);
  useEffect(()=>{
    //
    
    getCity()
  },[city])

  useEffect(()=>{
    setLoading(true)
    AsyncStorage.getItem('user')
    .then(async (response)=>{
      
     await getUserProfile(response)
      .then((response)=>{
       
        AsyncStorage.setItem('uuid', JSON.stringify(response._id))
        AsyncStorage.setItem('userId', JSON.stringify(response.emailId))
        AsyncStorage.setItem('uniqueId',JSON.stringify(response.uniqueId))
        AsyncStorage.setItem('name',JSON.stringify(response.name))
        AsyncStorage.setItem('profilePhotoUri',JSON.stringify(response.profilePhotoUri))
        AsyncStorage.setItem("city", JSON.stringify(response.city))
        AsyncStorage.setItem("state", JSON.stringify(response.state))
        const state = response.state
        const city = response.city
        console.log(response.city)
        setMyState(response.state)
        setMyCity(response.city)
        console.log("My unique Id",response.uniqueId)
        getPostsForUser(response.uniqueId).then((response)=>{
          console.log(state,response)
          getDataForUser(state,response)
          .then(()=>{
            getDataFromCity(response,city,state)
            setLoading(false)

          })
          //getCity()

        })
        
      })
    })
  },[])

  const theme = useTheme();

  const MyComponent = ({ item, LeftContent, images }) => (
    <Card
      onPress={() => {
        navigation.navigate("PetDetails", {
          data: item,
          images: images,
        });
      }}
    >
      <Card.Title title={item.pet} subtitle={item.city} left={LeftContent} />
      <Card.Content >
        <Paragraph>Health issues : {item.healthDetails}</Paragraph>
        <Paragraph>Description : {item.description}</Paragraph>
      </Card.Content>
      <SliderBox images={images} parentWidth={widthPercentageToDP(90)} />
      <Card.Actions>
        <Button
          onPress={() => {
            navigation.navigate("PetDetails", {
              data: item,
              images: images,
            });
          }}
        >
          See
        </Button>
      </Card.Actions>
    </Card>
  );
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };
  useEffect(() => {
    //getAllPosts();
  }, []);

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  return (
      <View>
        <View style={styles.container}>
          <Text>Help a pet today to get a new home</Text>
          <View style={styles.dropdownContainer}>
          <DropdownWithDataComponent
            data={stateData}
            placeholder={"Please select a state"}
            setState={setState}
            state={state}
          />
          {cityDropdown===true?
          <CityDropdownComponent data={cityData} placeholder={'Select city'} setCity={selectCity}  City={city} />
        :<View></View>}
        </View>
         <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
         <Icon 
                                name="location" 
                                color={'blue'}
                                size={20}
                                />
             
          <Text>{myCity},</Text>
          <Text>{myState}</Text>

         </View>
         </View>
          <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
          <ScrollView
          style={{    marginBottom:hp(20)          }}
          contentContainerStyle={styles.scrollContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {isLoading?<ActivityIndicator color="blue" size={'small'}/>:<View></View>}
            {posts && !isLoading ? (
              posts.map((item, index) => {
                //console.log(item.photoUri[0].path);
                const LeftContent = (props) => (
                  <Avatar.Image
                    size={50}
                    source={{ uri: `${item.photoUri[0].path}` }}
                  />
                );
                let images = [];
                if (item.photoUri.length > 0) {
                  for (let i = 0; i < item.photoUri.length; i++) {
                   // console.log(item.photoUri[i].path)
                    images.push(`${item.photoUri[i].path}`);
                  }
                } else {
                  images.push(`${item.photoUri}`);
                }

                return (
                  <View
                  key={index}
                    style={{
                      borderRadius: 5,
                      width: wp(90),
                      marginTop: hp(2),
                      paddingBottom:10
                    }}
                  >
                    <MyComponent
                      item={item}
                      LeftContent={LeftContent}
                      images={images}
                    />
                  </View>
                );
              })
            ) : (
                <LoadingSkeleton/>
            )}
            {!posts&&!isLoading?(
              <Text style={{color:'black'}}>No posts in your area</Text>
            )
              :null
            }
          </ScrollView>
          </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: hp(20),
  },
  scrollContainer:{
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownContainer:{
    display:'flex',
    flexDirection:'row',
justifyContent:'space-evenly'  
  }
});

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  View,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import COLORS from "./constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import pets from "./constants/pets";
import { stateData, url } from "./constants/constants";
import {
  generateRandomName,
  getCities,
} from "../components/utilityFunctions/utilities";
import CityDropdownComponent from "../components/ReusableElements/Citydropdown";
import DropdownWithDataComponent from "../components/ReusableElements/Dropdownwithdata";
import GetLocation from "react-native-get-location";
import { Button, FlatList, useTheme } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile } from "./apis/profileApis";
import useFirebaseCloudMessaging from "./notifications/firebase";
import { Center, VStack, Skeleton } from "native-base";
import { ActivityIndicator, Avatar } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {default as ICON} from 'react-native-vector-icons/Ionicons'
import { FilterModal } from "./modals/FilterModal";
import { GAMBannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'; 
import { InterstitialAd,  AdEventType } from 'react-native-google-mobile-ads';
import { AppOpenAd } from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';



const { height, width } = Dimensions.get("window");
const petCategories = [
  { name: "CAT", icon: "cat" },
  { name: "DOG", icon: "dog" },
  { name: "BIRD", icon: "bird" },
  { name: "BUNNIES", icon: "rabbit" },
  {name:"COW", icon:'cow'},
  {name:'FISH', icon:"fish"},
  {name:'TURTLE', icon:"turtle"}

  
];

const Card = ({ pet, navigation, images, frontImage }) => {
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
      <View style={style.cardContainer}>
        {/* Render the card image */}
        <View style={style.cardImageContainer}>
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
        <View style={style.cardDetailsContainer}>
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


const HomeScreen2 = ({ navigation }) => {
  const [selectedCategoryIndex, setSeletedCategoryIndex] = React.useState(0);
  const [filteredPets, setFilteredPets] = React.useState([]);
  const [posts, setPosts] = useState();
  const [color, changeColor] = useState("red");
  const [refreshing, setRefreshing] = React.useState(false);
  const [state, setState] = useState(null);
  const [cityData, setCity] = useState(null);
  const [city, selectCity] = useState();
  const [myCity, setMyCity] = useState();
  const [myState, setMyState] = useState();
  const [cityDropdown, setCityDropDown] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [profilePhotoUri, setProfilePhotoUri] = useState();
  const { colors } = useTheme();
  const [allPosts, setAllPosts] = useState([]);
  const [myStatePosts, setMyStatePosts] = useState();
  const [myCityPosts, setMyCityPosts] = useState();
  const [showModal, setShowModal] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { getToken, requestUserPermission } = useFirebaseCloudMessaging();


  
// Preload an app open ad

//ca-app-pub-3746903511069987/7920048854
  const LoadingSkeleton = () => {
    return (
      <Center w="100%">
        <VStack
          w="90%"
          maxW="400"
          borderWidth="1"
          space={8}
          overflow="hidden"
          rounded="md"
          _dark={{
            borderColor: "coolGray.500",
          }}
          _light={{
            borderColor: "coolGray.200",
          }}
        >
          <Skeleton h="40" />
          <Skeleton.Text px="4" />
          <Skeleton px="4" my="4" rounded="md" startColor="primary.100" />
        </VStack>
      </Center>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      updatePosts();
      changeColor("green");
      setRefreshing(false);
    }, 1500);
  };

 async function updatePosts(){
  AsyncStorage.getItem("user").then(async (response) => {
    await getUserProfile(response).then(async(response) => {
      console.log(response)
      if(response.responseCode===403)
      {
        //console.log(response)
        alert('invalid Login. Please log in again')
        return
      }
      AsyncStorage.setItem("uuid", JSON.stringify(response._id));
      AsyncStorage.setItem("userId", JSON.stringify(response.emailId));
      AsyncStorage.setItem("uniqueId", JSON.stringify(response.uniqueId));
      AsyncStorage.setItem("name", JSON.stringify(response.name));
      AsyncStorage.setItem(
        "profilePhotoUri",
        JSON.stringify(response.profilePhotoUri)
      );
      AsyncStorage.setItem("city", JSON.stringify(response.city));
      AsyncStorage.setItem("state", JSON.stringify(response.state));
      setProfilePhotoUri(response.profilePhotoUri);
      const state = response.state;
      const city = response.city;
      console.log(response.city);
      setMyState(response.state);
      setMyCity(response.city);
      console.log("My unique Id", response.uniqueId);
      await getPostsForUser(response.uniqueId).then(async (response) => {
        console.log(state, response);
       await getDataForUser(state, response).then(async () => {
          await getDataFromCity(response, city, state);
          setLoading(false);
        });
        //getCity()
      });
    });
  });
 }


  const getAllPosts = async (uniqueId) => {
    const user = await AsyncStorage.getItem("user");
    const response = await fetch(`${url}/user/getAllPosts`)
      .then((res) => res.json())
      .then((response) => {
        // console.log(response.responseData);
        console.log(user);
        console.log("Post creator", response.responseData[0].user);
        const POSTS = response.responseData.filter((item) => {
          return item.uniqueId !== uniqueId;
        });
        console.log("UserPosts", POSTS);

        setPosts(POSTS.reverse());
        setAllPosts(POSTS);
        return POSTS;
      })
      .catch((e) => {
        console.log(e);
      });
    return response;
  };

  const getPostsForUser = async (uniqueId) => {
    const user = await AsyncStorage.getItem("user");
    const token = await AsyncStorage.getItem('token')
    console.log("My Token",token)
    const response = await fetch(`${url}/user/getAllPosts`,{
      
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token:token
          }),
      
    })
      .then((res) => res.json())
      .then((response) => {
         console.log(response);
        if(response.responseCode===403)
        {
          //console.log(response)
          alert('invalid Login. Please log in again')
          return
        }
        console.log(user);
        console.log("Post creator", response.responseData[0].user);
        const POSTS = response.responseData.filter((item) => {
          return item.uniqueId !== uniqueId;
        });
        console.log("UserPosts", POSTS);

        //setPosts(POSTS.reverse());
        setAllPosts(POSTS);
        return POSTS;
      })
      .catch((e) => {
        console.log(e);
      });
    return response;
  };

  const getCity = () => {
    console.log(posts);
    if (allPosts && city && state) {
      setLoading(true);

      const filteredPosts = allPosts.filter((item) => {
        return item.city == city;
      });
      setPosts(filteredPosts);
      setMyCityPosts(filteredPosts);
      setLoading(false);
    }
  };
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
    if (allPosts && state) {
      setLoading(true);

      const filteredPosts = allPosts.filter((item) => {
        return item.state == state;
      });
      setPosts(filteredPosts.reverse());
      setMyStatePosts(filteredPosts.reverse());
      setLoading(false);
    }
  };

  const getDataForUser = async (state, allPosts) => {
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
          //setCityDropDown(true);
        } else {
          setCityDropDown(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    if (allPosts && state) {
      setLoading(true);

      const filteredPosts = allPosts.filter((item) => {
        return item.state == state;
      });
      setPosts(filteredPosts.reverse());
      setMyStatePosts(filteredPosts.reverse());
      // setLoading(false)
    }
  };
  const getDataFromCity = (allPosts, city, state) => {
    console.log(posts);
    if (allPosts && city && state) {
      setLoading(true);

      const filteredPosts = allPosts.filter((item) => {
        return item.city == city;
      });
      setPosts(filteredPosts.reverse());
      setMyCityPosts(filteredPosts.reverse());
      // setLoading(false)
    }
  };

  useEffect(() => {
    console.log("Hi state", state);
    if (state != null) {
      getData(state);
    }
  }, [state]);
  useEffect(() => {
    //

    getCity();
  }, [city]);

  useEffect(() => {
    setLoading(true);
   updatePosts()
  }, []);

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  useEffect(() => {
    const appOpenAd = AppOpenAd.createForAdRequest("ca-app-pub-3746903511069987/7920048854", {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['fashion', 'clothing'],
    });
    
    const unsubscribe = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
      appOpenAd.show()

    });

    // Start loading the interstitial straight away
    appOpenAd.load();
    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);
  const fliterPet = (index) => {
    if (state && city) {
      const currentPets = myCityPosts.filter((item) => {
        console.log(item.pet.toUpperCase() === petCategories[index].name);
        return item.pet.toUpperCase() === petCategories[index].name;
      }); //(item => item?.pet?.toUpperCase() == petCategories[index].name)
      //setFilteredPets(currentPets);
      if (currentPets.length) {
        setPosts(currentPets);
      } else {
        setPosts([]);
      }
    } else {
      const currentPets = myStatePosts.filter((item) => {
        console.log(item.pet.toUpperCase() === petCategories[index].name);
        return item.pet.toUpperCase() === petCategories[index].name;
      }); //(item => item?.pet?.toUpperCase() == petCategories[index].name)
      //setFilteredPets(currentPets);
      if (currentPets.length) {
        setPosts(currentPets);
      } else {
        setPosts([]);
      }
    }
  };

  const renderItem = useCallback(
    ({item})=>{
      let images = [];
                  if (item.photoUri.length > 0) {
                    for (let i = 0; i < item.photoUri.length; i++) {
                      // console.log(item.photoUri[i].path)
                      images.push(`${item.photoUri[i].path}`);
                    }
                  } else {
                    images.push(`${item.photoUri}`);
                  }


                  
                  return(
                    
                    <Card
                    pet={item}
                    navigation={navigation}
                    images={images}
                    frontImage={item.photoUri[0].path}
                    />
                    )
    }
  )

  
  
  return (
    <View style={{ flex: 1, color: COLORS.white }} 
    >
    <View style={style.header}>
    <View style={style.dropdownContainer}>
          <DropdownWithDataComponent
            data={stateData}
            placeholder={"Please select a state"}
            setState={setState}
            state={state}
          />
          {cityDropdown === true ? (
            <CityDropdownComponent
              data={cityData}
              placeholder={"Select city"}
              setCity={selectCity}
              City={city}
            />
          ) : (
            <View />
          )}
        </View>
      </View>
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
         <ICON
                                name="location" 
                                color={'blue'}
                                size={20}
                                />
             
          <Text style={{color:'green'}}>{myCity},</Text>
          <Text style={{color:'green'}}>{myState}</Text>
          </View>
        
        <View style={style.mainContainer}>
          {/* Render the search inputs and icons */}
          <View style={style.searchInputContainer}>
            <Icon name="magnify" size={24} color={COLORS.grey} />
            <TextInput
              placeholderTextColor={COLORS.grey}
              placeholder="Search pet to adopt"
              style={{ flex: 1 }}
              onChangeText={(text) => {
                console.log(text.length)
                if (state && city) {
                  if(text.length===0)
                {
                  
                  //getDataFromCity(allPosts,myCity,myState)
                  setPosts(myCityPosts)
                  return 

                }
                  const currentPets = myCityPosts.filter((item) => {
                    console.log(item.pet.toUpperCase() === text.toUpperCase())
                    return item.pet.toUpperCase() === text.toUpperCase();
                  }); //(item => item?.pet?.toUpperCase() == petCategories[index].name)
                  //setFilteredPets(currentPets);
                  console.log(currentPets.length)
                  if (currentPets.length) {
                    setPosts(currentPets);
                  } else {
                    setPosts([]);
                    //getDataFromCity(allPosts,myCity,myState)
                  }
                } else {
                  console.log(text.length===0)

                  if(text.length===0)
                  {
                    //getDataForUser(state,allPosts)
                    setPosts(myStatePosts)
                    return 

                  }
                  const currentPets = myStatePosts.filter((item) => {
                    console.log(item.pet.toUpperCase() === text.toUpperCase())
                    return item.pet.toUpperCase() === text.toUpperCase();
                  });
                  if (currentPets.length) {
                    setPosts(currentPets);
                  } else {
                    setPosts([]);
                    //getDataForUser(state,allPosts)
                  }
                }
              }}
            />
            <Icon name="sort-ascending" size={24} color={COLORS.grey} onPress={()=>{
              setShowModal(true)
            }} />
          </View>
          {/* Render the cards with flatlist */}
          <View style={{ marginTop: 20, paddingBottom:240 }}>
            {
              posts && !isLoading?
              <FlatList
              showsVerticalScrollIndicator={false}
              data={posts}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              renderItem={renderItem}
              initialNumToRender={2}
                />
          :<LoadingSkeleton/>    }
          {posts?.length===0 &&!isLoading ?
            <Text style={{textAlign:'center'}}>No animals for adoption in this area</Text>
            :null
          }
                </View>
                </View>
                <FilterModal showModal={showModal} setShowModal={setShowModal} petCategories={petCategories} filterPet={fliterPet}/>
                </View>
  );
};

const style = StyleSheet.create({
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
    marginBottom: 20,
    shadowColor: 'black',
  shadowOpacity: 0.26,
  shadowOffset: { width: 0, height: 2},
  shadowRadius: 10,
  elevation: 3,
  backgroundColor: 'white',
  borderRadius:10
  },
  cardDetailsContainer: {
    backgroundColor: COLORS.white,
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
export default HomeScreen2;

/*
<Image
          source={{uri:profilePhotoUri?profilePhotoUri:"https://bootdey.com/img/Content/avatar/avatar1.png"}}
          style={{height: 30, width: 30, borderRadius: 25}}
        />
        <Card
                    pet={item}
                    navigation={navigation}
                    images={images}
                    LeftContent={LeftContent}
                  />

                  <FlatList
              showsVerticalScrollIndicator={false}
              data={posts}
              renderItem={({item}) => {
                //<Card pet={item} navigation={navigation} />
                 let images = [];
                if (item.photoUri.length > 0) {
                  for (let i = 0; i < item.photoUri.length; i++) {
                   // console.log(item.photoUri[i].path)
                    images.push(`${item.photoUri[i].path}`);
                  }
                } else {
                  images.push(`${item.photoUri}`);
                }

                return(

                  <Card
                  pet={item}
                  navigation={navigation}
                  images={images}
                  LeftContent={LeftContent}
                  />
                  )
              }}
            />
            <ScrollView
          contentContainerStyle={style.scrollContainer}
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
                    <Card
                    pet={item}
                    navigation={navigation}
                    images={images}
                    LeftContent={LeftContent}
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

          /*
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            {petCategories.map((item, index) => (
              <ScrollView key={"pet" + index} 
              contentContainerStyle={{display:'flex',alignItems: "center", margin:2}}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSeletedCategoryIndex(index);
                    fliterPet(index);
                  }}
                  style={[
                    style.categoryBtn,
                    {
                      backgroundColor:
                        selectedCategoryIndex == index
                          ? COLORS.primary
                          : COLORS.white,
                    },
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={30}
                    color={
                      selectedCategoryIndex == index
                        ? COLORS.white
                        : COLORS.primary
                    }
                  />
                </TouchableOpacity>
                <Text style={style.categoryBtnName}>{item.name}</Text>
              </ScrollView>
            ))}
          </View>
*/


import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getUserProfile } from "./apis/profileApis";
import { ActivityIndicator, Avatar } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { url } from "./constants/constants";
import { RefreshControl } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { ProfileSkeleton } from "./skeletons/skeletons";
import { FlatList } from "native-base";
import { useWindowDimensions } from "react-native";
import {alert} from './snackBars/snackBar'
import { ProfileCard } from "./cards/profileCard";

export default (ProfileScreen = () => {
  const { width, height } = useWindowDimensions();

  const [images, setImages] = useState([
    "https://www.bootdey.com/image/280x280/FF00FF/000000",
    "https://www.bootdey.com/image/280x280/00FFFF/000000",
    "https://www.bootdey.com/image/280x280/FF7F50/000000",
    "https://www.bootdey.com/image/280x280/6495ED/000000",
    "https://www.bootdey.com/image/280x280/DC143C/000000",
    "https://www.bootdey.com/image/280x280/008B8B/000000",
  ]);

  const [postCount, setPostCount] = useState(10);
  const [followingCount, setFollowingCount] = useState(20);
  const [followerCount, setFollowerCount] = useState(30);
  const [posts, setPosts] = useState();
  const [refreshing, setRefreshing] = useState();
  const [loader, setLoader] = useState(false);
  const [profile, setProfile] = useState({
    emailId: "",
    name: "",
    state: "",
    city: "",
    phoneNumber: "",
    bio: "",
    profilePhotoUri: "https://bootdey.com/img/Content/avatar/avatar1.png",
  });
  const [profilePhoto, setProfilePhoto] = useState(
    "https://bootdey.com/img/Content/avatar/avatar1.png"
  );
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setUserProfile();
      setRefreshing(false);
    }, 1500);
  };

  const setUserProfile = () => {
    setLoader(true);
    AsyncStorage.getItem("user").then(async (response) => {
      console.log("My emailId", response);
      await getUserProfile(response).then((response) => {
        if (response.responseCode === 403) {
          //console.log(response)
          alert("error","invalid Login. Please log in again");
          return;
        }
        console.log("my profile details", response);
        setProfile({
          emailId: response.emailId,
          name: response.name,
          state: response.state,
          city: response.city,
          phoneNumber: response.phoneNumber,
          bio: response.bio,
          profilePhotoUri: response.profilePhotoUri,
        });
        AsyncStorage.setItem("uuid", JSON.stringify(response._id));
        AsyncStorage.setItem("userId", JSON.stringify(response.emailId));
        AsyncStorage.setItem("uniqueId", JSON.stringify(response.uniqueId));
        setProfilePhoto(`${response.profilePhotoUri}`);
        console.log("My Photo Uri", profilePhoto);
        console.log(response.posts);
        let list = [];
        response.posts.map((item) => {
          list.push(item);
          if (list.length === response.posts.length) {
            setPosts(list);
          }
        });
        setLoader(false);
      });
    });
  };

  const renderItem = useCallback(
    ({item,index})=>{
      let images = [];
                  if (item.photoUri.length > 0) {
                    for (let i = 0; i < item.photoUri.length; i++) {
                      // console.log(item.photoUri[i].path)
                      images.push(`${item.photoUri[i].path}`);
                    }
                  } else {
                    images.push(`${item.photoUri}`);
                  }
                  console.log(item.photoUri[0].path)

                  return (
                    <TouchableOpacity
                      style={styles.imageContainer}
                      onPress={() => {
                        const data = item;
                        let Images = [];
                        item.photoUri
                          ? item.photoUri.map((item) => {
                              Images.push(`${item.path}`);
                            })
                          : (Images = images);
                        navigation.navigate("MyPostDetails", {
                          data,
                          Images,
                          name:profile.name
                        });
                      }}
                    >
                      <View key={index} style={styles.imageContainer}>
                        <ProfileCard text={item.description.substring(0, 10) + `...`} uri={item.photoUri[0].path}/>
                      </View>
                    </TouchableOpacity>
                  );
    }
  )

  useEffect(() => {
    setUserProfile();
  }, []);
  useEffect(() => {
    console.log("My uri", profile.profilePhotoUri);
  }, [profile.profilePhotoUri]);
  return (
    <View style={styles.container}>
      {profile.name !== "" ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                style={styles.avatar}
                loadingIndicatorSource={profile.profilePhotoUri}
                onLoadStart={() => {
                  setLoading(true);
                }}
                onLoadEnd={() => {
                  setLoading(false);
                }}
                source={{
                  uri: profile
                    ? `${profile.profilePhotoUri}`
                    : "https://bootdey.com/img/Content/avatar/avatar1.png",
                }}
              />
              {loading ? (
                <View
                  style={{
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size={"small"} color={"blue"} />
                </View>
              ) : (
                <View />
              )}

              <Text style={styles.name}>
                {profile ? profile.name : "John Doe"}
              </Text>
              <View style={styles.statsContainer}>
                <View style={styles.statsBox}>
                  <Text style={styles.statsCount}>
                    {posts ? posts.length : postCount}
                  </Text>
                  <Text style={styles.statsLabel}>Posts</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Icon name="location" color={"blue"} size={20} />
                <View style={styles.statsBox}>
                  <Text style={styles.statsCount}>
                    {profile ? `${profile.city}, ${profile.state}` : ""}
                  </Text>
                </View>
              </View>
              <View style={styles.statsContainer2}>
                <View style={styles.statsBox}>
                  <Text style={styles.statsCount}>
                    {profile ? profile.bio : followerCount}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: "white",
              borderTopColor:'black',
              borderTopWidth:1
            }}
          >
            <Text style={{fontStyle:'italic', fontWeight:'bold'}}>My Posts</Text>
            {loader ? (
              <ActivityIndicator color="white" size={"small"} />
            ) : (
              <View />
            )}
            {posts ? (
              <FlatList
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={posts}
                maxToRenderPerBatch={5}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={renderItem}
              />
            ) : (
              <View style={styles.body}>
                <Text style={{ textAlign: "center" }}>
                  WoW! looks so empty..
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <ProfileSkeleton />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(213, 216, 221, 0.38)",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    alignItems: "center",
    padding: 30,
    marginTop: 20,
    width: widthPercentageToDP(80),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'black',
  shadowOpacity: 0.5,
  shadowOffset: { width: 0, height: 2},
  shadowRadius: 10,
  elevation: 5,
  backgroundColor: 'white',
  },
  headerContent: {
    alignItems: "center",
    marginTop: -30,
  },
  avatar: {
    width: 150,
    height: 180,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    marginTop: -20,
  },
  name: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  statsContainer2: {
    flexDirection: "row",
    marginTop: 10,
  },
  statsBox: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  statsCount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  statsLabel: {
    fontSize: 14,
    color: "rgba(47, 49, 51, 0.9)",
  },
  body: {
    alignItems: "center",
    padding: 30,
    flexDirection: "column",
    backgroundColor: "white",
    paddingBottom: widthPercentageToDP(100),
    width: widthPercentageToDP(100),
  },
  imageContainer: {
    width: widthPercentageToDP("40"),
    padding: 5,
  },
  image: {
    width: "100%",
    height: 120,
  },
});

//<Image style={styles.avatar} source={{ uri: `http://172.20.10.6:2000/${profile.profilePhotoUri}` }}/>
//          <Image style={styles.avatar} source={{ uri: "http://172.20.10.6:2000/profilePhotos/rn_image_picker_lib_temp_0f97bbf1-5a1f-48a5-b494-939fa9f9d0be.jpg" }}/>

/**
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
            <Text style={{color:'black'}}>{item.description.substring(0,10)+`...`}</Text>
          </View>
            </TouchableOpacity>
             
 <Image
                          style={styles.image}
                          source={{
                            uri: item.photoUri[0]
                              ? `${item.photoUri[0].path}`
                              : images[0],
                          }}
                        />
                        <Text style={{ color: "black" }}>
                          {item.description.substring(0, 10) + `...`}
                        </Text>
 */

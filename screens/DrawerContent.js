import React, {useState, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem,
    useIsDrawerOpen
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import{ AuthContext } from '../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from './apis/profileApis';
import { firebase, firestore } from "@react-native-firebase/firestore";
import {  useNativeBase, ScrollView, Center , HStack, VStack, Skeleton, Box, Badge} from "native-base";

 function DrawerContent(props) {
    const isOpen = useIsDrawerOpen()
    const paperTheme = useTheme();
    const [profilePhotoUri, setProfilePhoto] = useState()
    const [ error, setError] = useState(false)
    const [name, setName] = useState()
    const [emailId, setEmailId] = useState()
    const { signOut, toggleTheme } = React.useContext(AuthContext);
    const [totalLength, setTotalLength] = useState(0)
    const [ read, setRead] = useState(false)
    function Example({number}) {
        return <Box alignItems="center">
            <VStack>
              <Badge // bg="red.400"
            colorScheme="danger" rounded="full" mb={-1} bottom={8} mr={-5} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
              fontSize: 7
            }}>
                {number}
              </Badge>
              </VStack>
          </Box>;
      }

    const getProfileInfo = async()=>{
       const profilePhotoUri= await AsyncStorage.getItem('profilePhotoUri')
       const name = await AsyncStorage.getItem('name')
       const emailId = await AsyncStorage.getItem('userId')

       setName(JSON.parse(name))
       setProfilePhoto(JSON.parse(profilePhotoUri))
       setEmailId(JSON.parse(emailId))
    }



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
            let Length=0
            msgs.map(async (item)=>{
              const oldMessages = await AsyncStorage.getItem(`${item.messageId}`)
              const userMsg = await getUserMsg(item.messageId)
              const profile = await getUserProfile(item.userId)
              let data = item
              if(!oldMessages)
              {
                //AsyncStorage.setItem(`${item.messageId}`,JSON.stringify(userMsg))
                console.log('no new messages')
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
                    setTotalLength(Length+length)
                    Length = length
                    console.log("Total length",totalLength)
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
                //setMessages(list.reverse())
              }
            })
           // setMessages(response.messages);
          });
        });
      }
      
     useEffect(()=>{
        getMsgs()

     },[isOpen]) 

    useEffect(()=>{
        getProfileInfo()
        getMsgs()
        console.log(isOpen)
    },[])
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image 
                                source={{
                                    uri:profilePhotoUri?profilePhotoUri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                                }}
                                size={50}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>{name?name:'please get a name'}</Title>
                                <Caption style={styles.caption}>{emailId?`${emailId}`:'@petLover'}</Caption>
                            </View>
                        </View>

                        
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Adopt"
                            onPress={() => {props.navigation.navigate('Adopt')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="bookmark-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Bookmarks"
                            onPress={() => {props.navigation.navigate('BookmarkScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <View>
                             <Icon 
                                name="message" 
                                color={color}
                                size={size}
                                />
                                {totalLength?<Example number={totalLength}/>:null}
                                </View>

                            )}
                            label="Messages"
                            
                            onPress={() => {props.navigation.navigate('Messages')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="cog-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('SettingsScreen')}}
                        />
                        
                    </Drawer.Section>
                    <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={async () => {
                        signOut()
                        //props.navigation.navigate('SignInScreen')
                        await AsyncStorage.removeItem('userToken')
                    }}
                />
            </Drawer.Section>
        </View>
    );
}
export default React.memo(DrawerContent)

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });

  /*
  <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Following</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                <Caption style={styles.caption}>Followers</Caption>
                            </View>
                        </View>
  */
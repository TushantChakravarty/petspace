/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler'
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';

import  DrawerContent  from './screens/DrawerContent';

import MainTabScreen from './screens/MainTabScreen';
import SupportScreen from './screens/SupportScreen';
import SettingsScreen from './screens/SettingsScreen';
import BookmarkScreen from './screens/BookmarkScreen';

import { AuthContext } from './components/context';

import RootStackScreen from './screens/RootStackScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import EnterPetDetails from './screens/EnterPetDetails';
import { Provider } from 'react-redux'
import store from './components/Redux/Store'
import PetDetails from './screens/PetDetails';
import ProfileScreen from './screens/ProfileScreen';
import CreateProfile from './screens/CreateProfile';
import { NativeBaseProvider, Text, Box, Stack } from "native-base";
import ChatScreen from './screens/ChatScreen';
import MyChats from './screens/MyChats';
import ChatScreen2 from './screens/ChatScreen2';
import MyPostDetails from './screens/MyPostDetails';
import PostUserProfile from './screens/PostUserProfile';
import ChangePassword from './screens/ChangePassword';
import { createStackNavigator } from '@react-navigation/stack';
import PetDetails2 from './screens/PetDetailsMain';
import MyPostDetails2 from './screens/MyPostDetails2';
import notifee, { EventType } from '@notifee/react-native';
import { navigate, navigationRef } from './screens/rootNavigation/RootNavigation';
import { GAMBannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'; 

const Drawer = createDrawerNavigator();

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null); 
 
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
     
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(User,token) => {
      // setUserToken('fgkj');
      // setIsLoading(false);
      const userToken = String('xyz');
      const userName = User;
      console.log("My userName",userName)
      
      try {
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('user',userName)
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'LOGIN', id: userName, token: userToken });
    },
    signOut: async() => {
       setUserToken(null);
       setIsLoading(false);
      try {
       // await AsyncStorage.removeItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },
    toggleTheme: () => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
          }
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

   
useEffect(() => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        navigate('Messages')
        break;
    }
  });
}, []);


  
  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }
  return (
    <NativeBaseProvider>

      <Provider store={store}>
    <PaperProvider theme={theme}>
    <AuthContext.Provider value={authContext}>

    <NavigationContainer theme={theme} ref={navigationRef}>
      { loginState.userToken !== null ? (
        <>
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}
        backBehavior={'history'}
        drawerType={'slide'}

        
        >
          <Drawer.Screen name="HomeDrawer"  component={MainTabScreen}   />
          <Drawer.Screen name="SupportScreen" component={SupportScreen} />
          <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
          <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} options={{
            unmountOnBlur:true
          }}/>
          <Drawer.Screen name="EnterPetDetails" component={EnterPetDetails} />
          <Drawer.Screen name="PetDetails" component={PetDetails2} options={{
            unmountOnBlur:true
          }}/>
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="CreateProfile" component={CreateProfile} />
          <Drawer.Screen name="ChatScreen" component={ChatScreen} options={{
            unmountOnBlur:true
          }}/>
          <Drawer.Screen name="Messages" component={MyChats}  />
          <Drawer.Screen name="MyChats" component={ChatScreen2} 
          options={{
            unmountOnBlur:true
          }} />
          <Drawer.Screen name="MyPostDetails" component={MyPostDetails2} />
          <Drawer.Screen name="ChangePassword" component={ChangePassword} />
          <Drawer.Screen name="postuserprofile" component={PostUserProfile} />
        </Drawer.Navigator>
        
        </>
      )
      :
      <RootStackScreen/>
    }
    </NavigationContainer>
    </AuthContext.Provider>
    </PaperProvider>
    </Provider>
    </NativeBaseProvider>
  );
}

export default App;

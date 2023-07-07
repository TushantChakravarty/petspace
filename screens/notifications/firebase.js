import React, { useEffect } from 'react'
import { Alert } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SendNotification } from './pushNotification'
//import { useAsyncStorage } from '@react-native-community/async-storage'



const useFirebaseCloudMessaging = () => {
  //const navigation = useNavigation()
  //const { getItem: getFcmToken, setItem: saveFcmToken } = useAsyncStorage('fcmToken')

  const [fcmToken, setFcmToken] = React.useState(null)
  const [initialRoute, setInitialRoute] = React.useState('exchange')
  const getToken = async () => {
    const token = null //await getFcmToken()

    if (!token) {
      // Get the device token
      messaging()
        .getToken()
        .then(token => {
          console.log("Firebase Token",token)
          setFcmToken(token)
          if(token){
            //token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Iis5MTkzNDAwNzk5ODIiLCJfaWQiOiI2M2RkMDEwYzYwODMxOWM3YTZmMWY5N2MiLCJpYXQiOjE2ODU2MDAxNTUsImV4cCI6MTY4NTg1OTM1NX0.69onM9DCfu52sFNdjsitbdQaibar2yOyFg24vQkNnWk'
            AsyncStorage.setItem('fcmtoken',JSON.stringify(token))
            //Alert.alert('firebase Token', token, [ {text: `copy`, onPress: () => copyToClipboard(token), style: 'cancel'}, {text: 'close alert', onPress: () => console.log('closed')}, ], { cancelable: true});
          }

          //saveFcmToken(token)
        })
    }
  }

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.log('Authorization status:', authStatus)
    }
  }

  useEffect(() => {
    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
     // saveFcmToken(token)
     console.log("Firebase Token",token)
     if(token){
        AsyncStorage.setItem('fcmtoken',JSON.stringify(token))

        //Alert.alert('firebase Token', token, [ {text: `copy`, onPress: () => copyToClipboard(token), style: 'cancel'}, {text: 'close alert', onPress: () => console.log('closed')}, ], { cancelable: true});

     }
    })
  }, [])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
     //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
      console.log(remoteMessage.notification.body)
      console.log(remoteMessage.notification.title)
      SendNotification(remoteMessage.notification.title,remoteMessage.notification.body)
      //firebaseNotification(remoteMessage.notification.title,'MunziDapp',remoteMessage.notification.message,remoteMessage.notification.body)
    })
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
      SendNotification('petSpace',remoteMessage.notification.body)

      //firebaseNotification(remoteMessage.notification.title,'MunziDapp',remoteMessage.notification.message,remoteMessage.notification.body)
      
    });

    return unsubscribe
  }, [])

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      )
    })

    

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification
          )
          setInitialRoute(remoteMessage.data.type) // e.g. "Settings"
        }
      })
  }, [])

  return {
    fcmToken,
    getToken,
    requestUserPermission
  }
}

export default useFirebaseCloudMessaging
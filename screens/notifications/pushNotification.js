import React, {Component} from "react";
//import PushNotificationIOS from '@react-native-community/push-notification-ios';
import notifee from '@notifee/react-native';
import { useNavigation } from "@react-navigation/native";

  export const SendNotification = async(title,message)=>{
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
  title: `<p style="color: #4caf50;"><b>${title}</span></p></b></p> &#128008; &#128021;`,
  subtitle: `&#129395;`,
  body:
    `${message}`,
  android: {
    channelId,
    color: '#4caf50',
    actions: [
      {
        title: '<b>reply</b>',
        pressAction: { id: 'reply' },
        
      },
    ],
  },
});
  }

  
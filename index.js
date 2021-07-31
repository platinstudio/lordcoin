/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
/* import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require("react-native-push-notification"); */
import BackgroundFetch from "react-native-background-fetch";
import axios from 'axios';
import {ac_updateSetting} from './app/redux/action'
import {presistore, store} from './app/redux/store';

AppRegistry.registerComponent(appName, () => App);




/* // Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },


  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: false,


  requestPermissions: Platform.OS === 'ios'
});

PushNotification.createChannel(
  {
    channelId: "19", // (required)
    channelName: "UserNotesChannel", // (required)
    channelDescription: "A channel for notifications", // (optional) default: undefined.
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
); */

NotificationHeadlessTask = async (event) => {
  // Get task id from event {}:
  get_Notes()
  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(event.taskId);
}
//BackgroundFetch.registerHeadlessTask(this.NotificationHeadlessTask);


const get_Notes = () =>{
  console.log('going....')
  //tn();

  axios({
    method: 'post',
    url: "https://loardcoin.com/api/webhook",
    headers: {}, 
    data: {
      "function":"notifications",
      "token": store.getState().USR_token, // This is the body part
      "lastnote_id":store.getState().USR_lastnoteid
    }
    }).then((res)=>{
      console.log(res);
      if(res.data.ok){
        let now_notes = store.getState().notifications;
        let notes = now_notes.concat(res.data.notifications);
      
        console.log('loading notes',res.data);

        store.dispatch(ac_updateSetting({
                      notifications:notes
          }));
        

        if(res.data.notifications.length!=0){
          for(var i=0;i<res.data.notifications.length;i++){
/*             PushNotification.localNotification({
              channelId: "1", // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
              ticker: res.data.notifications[i].title, // (optional)
              showWhen: true, // (optional) default: true
              autoCancel: true, // (optional) default: true
              largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
              bigText: res.data.notifications[i].notification_body ,// (optional) default: "message" prop
              color: "#F7941E", // (optional) default: system default
              vibrate: true, // (optional) default: true
              vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
              ongoing: false, // (optional) set whether this is an "ongoing" notification
              priority: "high", // (optional) set notification priority, default: high
              visibility: "private", // (optional) set notification visibility, default: private
              ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
              onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
                    
              when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
              usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
              timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
              
              
              invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
              

              alertAction: "view", // (optional) default: view
              category: "", // (optional) default: empty string

              
              id: 1, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
              title: res.data.notifications[i].title, // (optional)
              message: res.data.notifications[i].notification_body, // (required)
              playSound: true, // (optional) default: true
              soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
              });
 */

          }
      }

      }
    })

}  


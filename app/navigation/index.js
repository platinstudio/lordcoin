/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  StatusBar,Platform,
} from 'react-native';
import { NavigationContainer , DarkTheme} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator,} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';



import {connect} from 'react-redux';
import {COLORS} from '../styles/index';
import YouContainer from '../containers/You';

import AuthContainer from '../containers/Auth/index';
import ResetContainer from '../containers/Auth/reset';
import TransContainer from '../containers/Trans/index'
import HistoryContainer from '../containers/History/index'
import SettingsContainer from '../containers/Settings/index';
import RefsContainer from '../containers/Settings/refs';
import FaqContainer from '../containers/Settings/faq';
import ContactContainer from '../containers/Settings/contact';
import NotificationContainer from '../containers/Notification/index';
import ProfileContainer from '../containers/Profile/index';
import EditContainer from '../containers/Profile/edit';
import WalletInfoContainer from '../containers/You/walletinfo';


const Theme = {
  ...DarkTheme,
  colors:{
    primary:COLORS.accent,
    background: '#182346',
    card: '#18233c',
    text: 'white',
    border: 'rgb(199, 199, 204)',
  }
}

const Youtack = createStackNavigator();
function YouStackScreen() {
  return (
    <Youtack.Navigator>
      <Youtack.Screen options={{headerShown:false}} name="You" component={YouContainer} />
    </Youtack.Navigator>
  );
}

const Transtack = createStackNavigator();
function TransStackScreen() {
  return (
    <Transtack.Navigator>
      <Transtack.Screen options={{headerShown:false}} name="Trans" component={TransContainer} />
    </Transtack.Navigator>
  );
}

const SettingStack = createStackNavigator();
function SettingStackScreen() {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen options={{headerShown:false}} name="You" component={SettingsContainer} />
    </SettingStack.Navigator>
  );
}



function MainBottomTab({navigation}) {
  return (
    <Tab.Navigator initialRouteName='You'>


  <Tab.Screen name="MyProfile" component={ProfileContainer} options={{title:'My Profile',
           tabBarIcon: ({ focused, color, size }) => {
            let iconName;
              iconName = focused
                ? 'person-circle-outline'
                : 'person-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        }} />

<Tab.Screen name="Notifications" component={NotificationContainer} options={{title:'Notifications',
           tabBarIcon: ({ focused, color, size }) => {
            let iconName;
              iconName = focused
                ? 'notifications-outline'
                : 'notifications-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        }} />

      <Tab.Screen name="You" component={YouStackScreen} options={{title:'My Wallet',
           tabBarIcon: ({ focused, color, size }) => {
            let iconName;
              iconName = focused
                ? 'card-outline'
                : 'card-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        }} />

      <Tab.Screen name="Trans" component={TransContainer} options={{title:'Transactions',
         tabBarIcon: ({ focused, color, size }) => {
          let iconName;
            iconName = focused
              ? 'wallet-outline'
              : 'wallet-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        }
        }}/>

<Tab.Screen name="Settings" component={SettingStackScreen} options={{title:'Settings',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
              iconName = focused
                ? 'cog-outline'
                : 'cog-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
      }}/>

    </Tab.Navigator>
  );
}





const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class Navigator extends React.PureComponent{

  constructor(props){
    super(props);
    this.state={
      render : true,
    }
  }
  render(){
  return (
    <>
      <StatusBar barStyle='light-content' />
      <NavigationContainer theme={Theme}>
        <Stack.Navigator>
          {this.props.USR_loggedIn?
          <>
          <Stack.Screen name='Dashboard' options={{headerShown:false}} component={MainBottomTab}/>
          <Stack.Screen name='History' options={{headerShown:false}} component={HistoryContainer}/>
          <Stack.Screen name='Refs' options={{headerShown:false}} component={RefsContainer}/>
          <Stack.Screen name='EditProfile' options={{headerShown:false}} component={EditContainer}/>
          <Stack.Screen name='Reset' options={{headerShown:false}} component={ResetContainer}/>
          <Stack.Screen name='Contact' options={{headerShown:false}} component={ContactContainer}/>
          <Stack.Screen name='Faq' options={{headerShown:false}} component={FaqContainer}/>
          <Stack.Screen name='WalletInfo' options={{headerShown:false}} component={WalletInfoContainer}/>
          </>
          
          :<>
          <Stack.Screen name='Auth' options={{headerShown:false,backgroundColor:'yellow'}}  component={AuthContainer}/>
          <Stack.Screen name='Faq' options={{headerShown:false}} component={FaqContainer}/>
          <Stack.Screen name='Contact' options={{headerShown:false}} component={ContactContainer}/>
        </>}
          
        </Stack.Navigator>
      </NavigationContainer>
      
    </>
  )}
};

const mapstate = (state)=>{
return{
  USR_loggedIn:state.USR_loggedIn
}
};
export default connect(mapstate)(Navigator)


/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput,FlatList,BackHandler
} from 'react-native';

import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {ac_updateSetting} from '../../redux/action';





class NotificationContainer extends Component {



	constructor(props) {
		super(props);
		this.state = {
			notifications:[
                {
                    title:'Deposit Successful',
                    desc:'Deposit Received. 500.00 Loard Coins added to your wallet At july 20, 2020 1:14pm'
                },
                {
                    title:'Deposit Successful',
                    desc:'Deposit Received. 500.00 Loard Coins added to your wallet At july 20, 2020 1:14pm'
                },
                {
                    title:'Deposit Successful',
                    desc:'Deposit Received. 500.00 Loard Coins added to your wallet At july 20, 2020 1:14pm'
                }
            ]
		};
    }

    componentDidMount(){
        this.get_Notes();

        	
		this.focusListener = this.props.navigation.addListener("focus", () => {
            this.get_Notes();
            BackHandler.addEventListener('backPress', () => {
                BackHandler.exitApp();
                return false;
          });
      });

      this.blurListener = this.props.navigation.addListener("blur", () => {
        BackHandler.addEventListener('backPress', () => {
          //  alert('running blur back handler')
            this.props.navigation.pop();
            return false;
        });
      });
	
     
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('backPress');

    }
    

    get_Notes = () =>{
        console.log('going...');
    axios({
        method: 'post',
        url: "https://loardcoin.com/api/webhook",
        headers: {}, 
        data: {
          "function":"notifications",
          "token": this.props.user_token, // This is the body part
          "lastnote_id":this.props.user_lastnote
        }
      }).then((res)=>{
        
          if(res.data.ok){
              
             let now_notes = this.props.user_notes;
             let notes = now_notes.concat(res.data.notifications);
 
             
                this.props.dispatch(ac_updateSetting({
                            notifications:notes
                }));

                if(res.data.notifications.length!=0){
                    
                    this.props.dispatch(ac_updateSetting({
                        USR_lastnoteid:res.data.notifications[res.data.notifications.length-1].id
                    }));
                }
            }
			
      }).catch((e)=>{
        console.log(e);
      })

    }  


	
	render() {
	//	const {notifications} = this.state;
		return (
			<SafeAreaView>
				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center'}}>


                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:15,width:'92%'}}>
                        <IonIcon name='notifications-outline' size={25} color="white" />
                        <Text style={{paddingLeft:10,fontSize:26,color:'white',fontWeight:'bold'}}>Notifications</Text>
                        {false?<Text style={{padding:3,color:'orange',fontSize:11,fontWeight:'400',marginLeft:10,borderWidth:1,borderRadius:10,borderColor:'orange'}}>3 Unread</Text>:null}

                    </TouchableOpacity>

                    
                    <FlatList
                   // contentContainerStyle={{width:'100%'}}
                    style={{width:'90%',marginTop:'5%'}}
                    nestedScrollEnabled={true}
                    data={this.props.user_notes}
                    refFlatlist={(ref) => { this.refFlatlist = ref; }}
                    keyExtractor={(item, index) => item + index || item.id || index.toString()}
                    listKey={(index) => index.toString()}
                    renderItem={({ item, index }) => (	
                        <View style={{backgroundColor:'#18233c',width:'100%',borderRadius:10,marginTop:'5%'}}>
                            <View style={{flexDirection:'row',alignItems:'center',padding:10,}}>
                                <Text style={{color:'white',fontSize:18,fontWeight:'600',paddingBottom:0}}>{item.title}</Text>
                                {false?<Text style={{padding:2,color:'orange',fontSize:11,fontWeight:'400',marginLeft:10,borderWidth:1,borderRadius:10,borderColor:'orange'}}>Unread</Text>:null}
                            </View>
                    <Text style={{color:'white',fontSize:14,fontWeight:'400',padding:10,paddingTop:5}}>{item.notification_body}</Text>
                        </View>)
                    }/>




					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}



const mapStateToProps=(state)=>{
	return{
        user_lastnote:state.USR_lastnoteid,
        user_token:state.USR_token,
        user_notes:state.notifications,
        last_note:state.USR_lastnoteid

	}
}
export default connect(mapStateToProps)(NotificationContainer);

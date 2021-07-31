
import React, { Component, useState } from 'react';
import {
	ActivityIndicator,ScrollView,SafeAreaView,View,Text,StyleSheet,StatusBar,Image,TextInput,TouchableOpacity,KeyboardAvoidingView, Platform, Linking,
} from 'react-native';
import {ac_updateSetting} from '../../redux/action';

import {connect} from 'react-redux';
import {COLORS} from '../../styles/index';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import axios from 'axios';

const regEx = /^(?=.*?[A-Z])(?=.*?[a-z]).{8,}$/;

const Login = (props) =>{

	const [email,setEmail] = useState('');
	const [password,setPassword] = useState('');


	return (<View style={{marginTop:'15%',alignItems:'center',width:'80%'}}>
	<IonIcon name="person-outline" size={40} color="white" />
	<Text style={{color:'white',fontSize:15,marginTop:'3%'}}>Log into your account</Text>

	<View style={{marginTop:'10%',width:'100%'}}>

	<Text style={{color:'white',fontSize:15,fontWeight:'500'}}>Email Address</Text>

	<TextInput
		onChangeText={(text)=>setEmail(text)}
		placeholderTextColor="gray"
		style={{marginTop:'4%',backgroundColor:'white',width:'100%',padding:17,borderRadius:12,fontSize:15}}
		placeholder="Email Address"/>

	<Text style={{color:'white',fontSize:15,fontWeight:'500',marginTop:'8%'}}>Password</Text>

	<TextInput
		secureTextEntry={true}
		onChangeText={(text)=>setPassword(text)}
		placeholderTextColor="gray"
		style={{marginTop:'4%',backgroundColor:'white',width:'100%',padding:17,borderRadius:12,fontSize:15}}
		placeholder="Password"/>

	</View>

	<TouchableOpacity style={{width:'100%'}} onPress={()=>props.updator({stage:3})}>
	<Text style={{marginTop:'9%',textAlign:'right',width:'100%',color:COLORS.accent,fontWeight:'500',fontSize:14}}>Forgot Password?</Text>
	</TouchableOpacity>

	<TouchableOpacity onPress={()=>props.proccessor(email,password)} style={{marginTop:'8%',backgroundColor:COLORS.accent,width:'100%',alignItems:'center',borderRadius:10}}>
		<Text style={{color:'white',fontSize:16,fontWeight:'500',paddingTop:13,paddingBottom:13}}>Login</Text>
	</TouchableOpacity>

	<View style={{flexDirection:'row',marginTop:'10%'}}>
		<Text style={{color:'white',fontWeight:'500',fontSize:15}}>Don't have an account?</Text>
		<TouchableOpacity onPress={()=>props.updator({stage:1})}>
		<Text style={{color:COLORS.accent,fontWeight:'500',fontSize:15,paddingLeft:5}}>Sign Up</Text>
		</TouchableOpacity>
	</View>

	<View style={{flexDirection:'row',marginTop:'5%'}}>
		<Text style={{color:'white',fontWeight:'500',fontSize:15}}>Have Tourble?</Text>
		<TouchableOpacity onPress={props.gotoFAQ}>
		<Text style={{color:COLORS.accent,fontWeight:'500',fontSize:15,paddingLeft:5}}>See FAQ</Text>
		</TouchableOpacity>
	</View>

	<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:'5%',marginBottom:'10%'}}>

	<View style={{flexDirection:'row'}}>
		<Text style={{color:'white',fontWeight:'500',fontSize:15}} />
		<TouchableOpacity onPress={props.gotoSupp}>
		<Text style={{color:COLORS.accent,fontWeight:'500',fontSize:15,paddingLeft:5}}>Contact & Support</Text>
		</TouchableOpacity>
	</View>

	<Text style={{color:'white'}}>  |  </Text>


	<View style={{flexDirection:'row'}}>
		<Text style={{color:'white',fontWeight:'500',fontSize:15}} />
		<TouchableOpacity onPress={()=>Linking.openURL('http://privacy.loardcoin.com/')}>
		<Text style={{color:COLORS.accent,fontWeight:'500',fontSize:15}}>Privacy And Policy</Text>
		</TouchableOpacity>
	</View>
	</View>

	</View>);
};

const SignUp = (props) =>{

	const [name,setName] = useState('');
	const [lastname,setLastName] = useState('');
	const [email,setEmail] = useState('');
	const [password,setPassword] = useState('');
	const [password2,setPassword2] = useState('');


	return (<View style={{marginTop:'5%',alignItems:'center',width:'80%'}}>
	<Text style={{color:'white',fontSize:15,marginTop:'3%',fontWeight:'600'}}>Create your account</Text>


	<View style={{marginTop:'10%',width:'100%'}}>

	<Text style={{color:'white',fontSize:15,fontWeight:'500'}}>First Name</Text>

	<TextInput
		onChangeText={(text)=>setName(text)}
		placeholderTextColor="gray"
		style={{marginTop:'4%',backgroundColor:'white',width:'100%',padding:17,borderRadius:12,fontSize:15}}
		placeholder="Name"/>

	<Text style={{color:'white',fontSize:15,fontWeight:'500',marginTop:'8%'}}>Last Name</Text>

	<TextInput
		onChangeText={(text)=>setLastName(text)}
		placeholderTextColor="gray"
		style={{marginTop:'4%',backgroundColor:'white',width:'100%',padding:17,borderRadius:12,fontSize:15}}
		placeholder="Last Name"/>

	<Text style={{color:'white',fontSize:15,fontWeight:'500',marginTop:'8%'}}>Email Address</Text>

	<TextInput
		onChangeText={(text)=>setEmail(text)}
		placeholderTextColor="gray"
		style={{marginTop:'4%',backgroundColor:'white',width:'100%',padding:17,borderRadius:12,fontSize:15}}
		placeholder="Email Address"/>

	<Text style={{color:'white',fontSize:15,fontWeight:'500',marginTop:'8%'}}>Password</Text>

	<TextInput
	secureTextEntry={true}
		onChangeText={(text)=>setPassword(text)}
		placeholderTextColor="gray"
		style={{marginTop:'4%',backgroundColor:'white',width:'100%',padding:17,borderRadius:12,fontSize:15}}
		placeholder="Password"/>

	<Text style={{color:'white',fontSize:15,fontWeight:'500',marginTop:'8%'}}>Confirm Password</Text>

	<TextInput
	secureTextEntry={true}
		onChangeText={(text)=>setPassword2(text)}
		placeholderTextColor="gray"
		style={{marginTop:'4%',backgroundColor:'white',width:'100%',padding:17,borderRadius:12,fontSize:15}}
		placeholder="Confirm Password"/>
	</View>



	<TouchableOpacity onPress={()=>props.proccessor(name,lastname,email,password,password2)} style={{marginTop:'10%',backgroundColor:COLORS.accent,width:'100%',alignItems:'center',borderRadius:10}}>
		<Text style={{color:'white',fontSize:16,fontWeight:'500',paddingTop:13,paddingBottom:13}}>Sign Up</Text>
	</TouchableOpacity>

	<View style={{flexDirection:'row',marginTop:'8%'}}>
		<Text style={{color:'white',fontWeight:'500',fontSize:15}}>Already have an account?</Text>
		<TouchableOpacity onPress={()=>props.updator({stage:0})}>
		<Text style={{color:COLORS.accent,fontWeight:'500',fontSize:15,paddingLeft:5}}>Login</Text>
		</TouchableOpacity>
	</View>

	<View style={{flexDirection:'row',marginTop:'5%',marginBottom:'5%'}}>
		<Text style={{color:'white',fontWeight:'500',fontSize:15}} />
		<TouchableOpacity onPress={()=>Linking.openURL('http://privacy.loardcoin.com/')}>
		<Text style={{color:COLORS.accent,fontWeight:'500',fontSize:15,paddingLeft:5}}>Privacy And Policy</Text>
		</TouchableOpacity>
	</View>

	</View>);
};

const Reset = (props) =>{

	const [email,setEmail] = useState('');

	return (<View style={{marginTop:'15%',alignItems:'center',width:'80%'}}>
		<IonIcon name="refresh-outline" color="white" size={40} />
	<Text style={{color:'white',fontSize:15,marginTop:'3%',fontWeight:'600'}}>Forgot Password</Text>


	<View style={{marginTop:'10%',width:'100%'}}>

	<Text style={{color:'white',fontSize:15,fontWeight:'500',marginTop:'8%'}}>Email Address</Text>

	<TextInput
		onChangeText={(text)=>setEmail(text)}
		placeholderTextColor="gray"
		style={{marginTop:'4%',backgroundColor:'white',width:'100%',padding:17,borderRadius:12,fontSize:15}}
		placeholder="Email Address"/>

	</View>



	<TouchableOpacity onPress={()=>props.proccessor(email)} style={{marginTop:'10%',backgroundColor:COLORS.accent,width:'100%',alignItems:'center',borderRadius:10}}>
		<Text style={{color:'white',fontSize:16,fontWeight:'500',paddingTop:13,paddingBottom:13}}>Reset Password</Text>
	</TouchableOpacity>

	<View style={{flexDirection:'row',marginTop:'8%'}}>
		<Text style={{color:'white',fontWeight:'500',fontSize:15}}>Return to</Text>
		<TouchableOpacity onPress={()=>props.updator({stage:0})}>
		<Text style={{color:COLORS.accent,fontWeight:'500',fontSize:15,paddingLeft:5}}>Login</Text>
		</TouchableOpacity>
	</View>

	</View>);
};


let token;

class AuthContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			stage:0,
			proccessing:false,modal_text:false,response:'',
			alert:false,
			alert_content:'',
		};
	}


	updateState = (state) =>{
		this.setState(state);
	}

	appSetup = ()=>{
		axios({
			method: 'post',
			url: 'https://loardcoin.com/api/webhook',
			headers: {},
			data: {
			  'function':'app_setup',
			  'token': token,
			  mobile_version:'0.1',
			  device_type:Platform.OS, // This is the body part,
			//  device_id:
			},
		  }).then((res)=>{
			  	console.log(res.data);
				if (res.data.ok){
					alert('App setup was successful!');
				}
		  });
	}


	login = (email,password)=>{
		this.setState({proccessing:true});

		axios({
			method: 'post',
			url: 'https://loardcoin.com/api/webhook',
			headers: {},
			data: {
			  'function':'login',
			  'email': email.toLowerCase(), // This is the body part
			  'password':password,
			},
		  }).then((res)=>{
				if (res.data.ok){
					token = res.data.token;
					axios({
						method: 'post',
						url: 'https://loardcoin.com/api/webhook',
						headers: {},
						data: {
						  'function':'account',
						  'token': token, // This is the body part
						},
					  }).then((res)=>{
							if (res.data.ok){
								const data = res.data;
								if (data.profile.ismobile == 0){
									this.appSetup();
								}
								this.setState({proccessing:false,modal_text:false});
								this.props.dispatch(ac_updateSetting({
									USR_loggedIn:true,
									USR_name:capitalizeFirstLetter(data.profile.first_name),
									USR_lastName:capitalizeFirstLetter(data.profile.last_name),
									USR_token:token,
									USR_email:data.profile.email,
									USR_phone:data.profile.phone,
									USR_country:data.profile.country,
									USR_gender:data.profile.gender == 0 ? 'Male' : data.profile.gender == 1 ? 'Female' : 'Others',
									USR_profile:data.profile.photo,
									USR_visit:data.last_visit,
									USR_now:data.server_time,
									USR_lastnoteid:data.profile.lastnote_id,
									USR_refcode:data.profile.ref_code,
									USR_blockedcoin:data.membership.blocked_coin,
									USR_plan_name:data.membership.plan_name,
									wallet:data.wallet,
									USR_membership:data.membership.plan_name,
								}));




							}
					  }).catch((e)=>{
						  alert('error 1');
					  });


				} else {
					this.setState({proccessing:true,response:res.data.desc,modal_text:true});
				}
		  }).catch((e)=>{
			alert('No Internet Connection');
		});
	}

	reset = (email) =>{
		this.setState({proccessing:true});
		axios({
			method: 'post',
			url: 'https://loardcoin.com/api/webhook',
			headers: {},
			data: {
			  'function':'password_reset',
			  'email': email.toLowerCase(), // This is the body part
			},
		  }).then((res)=>{

				if (res.data.ok){
					this.setState({modal_text:true,response:res.data.desc,stage:0});

				} else {
					this.setState({proccessing:true,response:res.data.desc,modal_text:true});
				}
		  });
	}

	signUp = (name,lname,email,password,password2)=>{


		if (email.length < 5 || password.length == 0){
			alert('Please check you inputs.');
			return;
		}

		if (!email.includes('@') || !email.includes('.')){
			alert('Email Address Not Correct.');
			return;
		}

		if (!regEx.test(password)){
			alert('Password Must Be At Least 8 Letters & One');
			return;
		}

		if (password != password2){
			alert('Passwords Do Not Match.');
			return;
		}
		this.setState({proccessing:true});

		axios({
			method: 'post',
			url: 'https://loardcoin.com/api/webhook',
			headers: {},
			data: {
			'function':'signup',
			  'first_name':name,
			  'last_name':lname,
			  'email': email.toLowerCase(), // This is the body part
			  'password':password,
			}
		  }).then((res)=>{
			this.setState({proccessing:true,response:res.data.desc,modal_text:true});
			  if (res.data.ok){
				this.setState({stage:0});
			  }

		  })






	}


	render() {
		const { stage,proccessing,modal_text,response } = this.state;
		return (
			<>

			<Modal isVisible={proccessing} style={{alignItems:'center'}}>

				{!modal_text ?
				<View style={{backgroundColor:'white',padding:20,flexDirection:'row',borderRadius:15,width:'80%'}}>
					<ActivityIndicator color={COLORS.accent} size="small" />
					<Text style={{fontWeight:'500',paddingLeft:10}}>Proccessing...</Text>
				</View> :
				<View style={{backgroundColor:'white',padding:20,borderRadius:15,width:'80%',justifyContent:'center',alignItems:'center'}}>

				<Text style={{fontWeight:'500',paddingLeft:10}}>{response}</Text>
				<TouchableOpacity onPress={()=>this.setState({modal_text:false,proccessing:false})} style={{borderRadius:10,marginTop:'7%',backgroundColor:COLORS.accent,padding:7,paddingRight:10,paddingLeft:10}}><Text style={{color:'white'}}>Close</Text></TouchableOpacity>
				</View>}

			</Modal>


			<StatusBar barStyle="light-content" />
			<SafeAreaView style={{backgroundColor:COLORS.blue_background}}>
			<KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''}>
				<ScrollView style={{backgroundColor:COLORS.blue_background,height:'100%'}}>
				<View style={{backgroundColor:COLORS.blue_background,height:'100%',width:'100%',alignItems:'center'}}>

					<Image
						resizeMode="contain"
						style={{width:'100%',height:50,marginTop:'10%'}}
						source={require('../../res/logotext2.png')}/>

					{stage == 0 ? <Login gotoSupp={()=>this.props.navigation.navigate('Contact')} gotoFAQ={()=>this.props.navigation.navigate('Faq')} proccessor={this.login} updator={this.updateState}/> : stage == 1 ? <SignUp proccessor={this.signUp} updator={this.updateState}/> : <Reset proccessor={this.reset} updator={this.updateState} />}

				</View>
				</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
			</>
		);
	}
}





const mapStateToProps = (state)=>{
	return {

	};
};
export default connect(mapStateToProps)(AuthContainer);


function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
  }

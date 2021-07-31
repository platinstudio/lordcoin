/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput,Dimensions,ActivityIndicator,BackHandler
} from 'react-native';

import { connect } from "react-redux";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles';
import QRCode from 'react-native-qrcode-generator';
import axios from 'axios';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-community/clipboard';
import {ac_updateSetting} from '../../redux/action';


class TransContainer extends Component {



	constructor(props) {
		super(props);
		this.state = {
			wallets : [{name:'Default Wallet',value:1232},{name:'Wallet 2',value:2000},{name:'Default Wallet',value:16000},{name:'Wallet 2'},{name:'Default Wallet'},{name:'Wallet 2'}],
			selected_wallet:0,
			trans_dest:'',trans_note:'',
			trans_val:0,
			proccessing:false,modal_text:false,response:'',

			state_deposing:true,
		};
	}

	componentWillReceiveProps(nextprops){
		
	}

	componentDidMount(){
		this.focusListener = this.props.navigation.addListener("focus", () => {
			if(this.props.route.params){
				this.setState({selected_wallet:this.props.route.params.wallet,state_deposing:this.props.route.params.deposit})
			}
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


	sendBalance = () =>{
		if(this.state.trans_dest.length<3 || this.state.trans_val < 1){
			this.setState({proccessing:true,modal_text:true,response:'Please Check Your Inputs!'})
			return;
		}

		this.setState({proccessing:true});

		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {},  
			data: {
			  "function":"balance_transfer",
			  "token": this.props.token,
			  wallet_id:this.props.user_wallets[this.state.selected_wallet].id,
			  dest_address:this.state.trans_dest,
			  amount:this.state.trans_val,
			  note:this.state.trans_note // This is the body part
			}
		  }).then((res)=>{
				this.setState({modal_text:true,response:res.data.desc,trans_val:0,trans_note:''});
		  }).catch((e)=>{
			  console.log(e);
		  })
	}

	generate_new_address = ()=>{
		this.setState({proccessing:true,modal_text:false,response:false});
		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {},  
			data: {
			  "function":"generateNewAddress",
			  "token": this.props.token,
			  wallet_id:this.props.user_wallets[this.state.selected_wallet].id,
			}
		  }).then((res)=>{
				if(res.data.ok){
					this.update_info();

				}else{
					console.log(res.data);
					this.setState({proccessing:true,modal_text:true,response:'Failed to generate new address.'});

				}
		  }).catch((e)=>{
			  console.log(e);
		  })

	}


	update_info = ()=>{
		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  function:"account",
			  token: this.props.token, // This is the body part
			}
		  }).then((res)=>{
			console.log(res);
				if(res.data.ok){
					const data = res.data;
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

					this.setState({proccessing:true,modal_text:true,response:'New address generated.'});
				}else{
					this.setState({proccessing:true,modal_text:true,response:'Failed to get new address.'});

				}
		  })
	}


	
	render() {
		const {wallets,selected_wallet,state_deposing,proccessing,modal_text,response} = this.state;
		return (
			<SafeAreaView>



			<Modal isVisible={proccessing} style={{alignItems:'center'}}>

				{!modal_text?
				<View style={{backgroundColor:'white',padding:20,flexDirection:'row',borderRadius:15,width:'80%'}}>
					<ActivityIndicator color={COLORS.accent} size='small' />
					<Text style={{fontWeight:'500',paddingLeft:10}}>Proccessing...</Text>
				</View>:
				<View style={{backgroundColor:'white',padding:20,borderRadius:15,width:'80%',justifyContent:'center',alignItems:'center'}}>

				<Text style={{fontWeight:'500',paddingLeft:10}}>{response}</Text>
				<TouchableOpacity onPress={()=>{this.setState({modal_text:false,proccessing:false});}} style={{borderRadius:10,marginTop:'7%',backgroundColor:COLORS.accent,padding:7,paddingRight:10,paddingLeft:10}}><Text style={{color:'white'}}>Close</Text></TouchableOpacity>
				</View>}

			</Modal>

				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center'}}>

				
                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:15,width:'92%'}}>
                        <IonIcon name='wallet-outline' size={25} color="white" />
                        <Text style={{paddingLeft:10,fontSize:26,color:'white',fontWeight:'bold'}}>Transactions</Text>
                    </TouchableOpacity>


					<View style={{paddingBottom:15,overflow:'scroll',elevation:8,marginBottom:8,width:'90%',backgroundColor:'#18233c',padding:7,borderRadius:15,marginTop:'4%'}}>
							<Text style={{fontSize:22,color:'white',fontWeight:'bold',paddingLeft:10,paddingTop:7}}>Wallets</Text>
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View style={{flexDirection:'row',overflow:'scroll',marginTop:10,marginLeft:8}}>
								{this.props.user_wallets.map((item,index)=>{
									return(
										<LinearGradient colors={selected_wallet==index?['#FF7E76',"#FC516A"]:['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']} style={{margin:5,borderRadius:3}}>
										<TouchableOpacity onPress={()=>this.setState({selected_wallet:index})}>
											
											<Text style={{padding:8,paddingLeft:13,paddingRight:13,color:'white'}}>{item.name}</Text>
										</TouchableOpacity>
										</LinearGradient>
									)
								})}
							</View>
							</ScrollView>


						</View>


					<View style={{flexDirection:'row',width:'90%',marginTop:'5%'}}>

						<TouchableOpacity onPress={()=>this.setState({state_deposing:true})} style={{flex:1,alignItems:'center'}}>
							<Text style={{textAlign:'center',fontSize:15,fontWeight:'600',color:'white'}}>Deposit</Text>
							{state_deposing?<IonIcon name="ellipse" size={8} color={COLORS.accent} style={{marginTop:7}}/>:null}
						</TouchableOpacity>

						<TouchableOpacity onPress={()=>this.setState({state_deposing:false})} style={{flex:1,alignItems:'center'}}>
							<Text style={{textAlign:'center',fontSize:15,fontWeight:'600',color:'white'}}>Send Coin</Text>
							{!state_deposing?<IonIcon name="ellipse" size={8} color={COLORS.accent} style={{marginTop:7}}/>:null}
						</TouchableOpacity>



					</View>



					<View style={{overflow:'hidden',elevation:8,alignItems:'center',marginBottom:8,width:'90%',backgroundColor:'#18233c',padding:7,borderRadius:15,marginTop:'8%'}}>
							<Text style={{fontSize:20,color:'white',fontWeight:'700',textAlign:'left',width:'100%',paddingLeft:10,paddingTop:7}}>{state_deposing?'+ Deposing to ':'- Send coin from '}{this.props.user_wallets[selected_wallet].name}</Text>

							{state_deposing?
							<View style={{alignItems:'center',marginTop:'10%',marginBottom:'5%'}}>

								<View style={{width:'60%',aspectRatio:1,marginTop:'0%'}}>
									<QRCode
										value={this.props.user_wallets[selected_wallet].address?this.props.user_wallets[selected_wallet].address:'none'}
										fgColor="#18233c"
										size={(Dimensions.get('window').width*52)/100}
										bgColor='white'/>
								</View>

								<Text style={{color:'gray',fontSize:14,fontWeight:'400',marginTop:'7%',textAlign:'center'}}>{this.props.user_wallets[selected_wallet].address||'no address'}</Text>

								<View style={{flexDirection:'row'}}>
								<TouchableOpacity onPress={this.generate_new_address} style={{borderWidth:1,borderColor:COLORS.accent,borderRadius:7,marginTop:'3%',marginRight:5}}>
									<Text style={{padding:4,color:COLORS.accent}}>Generate New Address</Text>
								</TouchableOpacity>


								<TouchableOpacity onPress={()=>Clipboard.setString(this.props.user_wallets[selected_wallet].address || 0)} style={{borderWidth:1,borderColor:COLORS.accent,borderRadius:7,marginTop:'3%',marginLeft:5}}>
									<Text style={{padding:4,color:COLORS.accent}}>Copy Address</Text>
								</TouchableOpacity>
								</View>

							</View>:
							
							<View style={{alignItems:'center',marginTop:'7%',marginBottom:'5%',width:'93%'}}>

								<Text style={{color:'white',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>To</Text>
								<TextInput
									value={this.state.trans_dest}
									onChangeText={(text)=>this.setState({trans_dest:text})}
									placeholderTextColor="white"
									style={{color:'white',borderWidth:0.5,borderColor:'white',padding:10,width:'100%',marginTop:7}}
									placeholder="Address" />

								<Text style={{color:'white',marginTop:'7%',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Amount</Text>
								<TextInput
									defaultValue={this.state.trans_val}
									value={this.state.trans_val}
									onChangeText={(text)=>this.setState({trans_val:text})}
									placeholderTextColor="white"
									style={{color:'white',borderWidth:0.5,borderColor:'white',padding:10,width:'100%',marginTop:7}}
									placeholder="Amount" />

								<Text style={{color:'white',marginTop:'7%',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Note</Text>
								<TextInput
									defaultValue={this.state.trans_val}
									value={this.state.trans_note}
									numberOfLines={2}
									
									onChangeText={(text)=>this.setState({trans_note:text})}
									placeholderTextColor="white"
									style={{color:'white',borderWidth:0.5,borderColor:'white',padding:10,width:'100%',marginTop:7}}
									placeholder="Note" />

								<TouchableOpacity onPress={this.sendBalance} style={{marginTop:'8%',backgroundColor:COLORS.accent,width:'100%',alignItems:'center',borderRadius:10}}>
									<Text style={{color:'white',fontSize:16,fontWeight:'500',paddingTop:13,paddingBottom:13}}>Send</Text>
								</TouchableOpacity>

							</View>}




						</View>

							
						<TouchableOpacity onPress={()=>this.props.navigation.navigate('History',{wallet:wallets[selected_wallet]})}  style={{display:'none',flexDirection:'row',marginLeft:10,marginRight:10,alignItems:'center',marginBottom:'5%',width:'88%',marginTop:'2%'}}>
								<Text style={{fontSize:15,color:COLORS.accent,fontWeight:'500',flex:1}}>See History</Text>
								<IonIcon name='chevron-forward-outline' size={25} color={COLORS.accent} />
						</TouchableOpacity>



					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}



const mapStateToProps=(state)=>{
	return{
		user_wallets:state.wallet,
		token:state.USR_token
	}
}
export default connect(mapStateToProps)(TransContainer);


function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
  }
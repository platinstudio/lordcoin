/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput,ActivityIndicator
} from 'react-native';

import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles';
import {Picker} from '@react-native-community/picker';
import axios from 'axios';
import Modal from 'react-native-modal';

class ResetContainer extends Component {



	constructor(props) {
		super(props);
		this.state = {
			wallets : [{name:'Default Wallet',value:1232},{name:'Wallet 2',value:2000},{name:'Default Wallet',value:16000},{name:'Wallet 2'},{name:'Default Wallet'},{name:'Wallet 2'}],
			selected_wallet:0,
			country:'ir',
			email:'',
			proccessing:false,modal_text:false,response:false,
		};
	}


	reset = () =>{
		this.setState({proccessing:true});
		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  "function":"password_reset",
			  "email": this.state.email.toLowerCase(), // This is the body part
			}
		  }).then((res)=>{
				if(res.data.ok){
					this.setState({modal_text:true,response:res.data.desc,stage:0});

				}else{
					this.setState({proccessing:true,response:res.data.desc,modal_text:true})
				}
		  });
		  this.setState({email:''})
	}


	
	render() {
		const {proccessing,modal_text,response} = this.state;
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
					<TouchableOpacity onPress={()=>{this.setState({modal_text:false,proccessing:false});this.props.navigation.pop()}} style={{borderRadius:10,marginTop:'7%',backgroundColor:COLORS.accent,padding:7,paddingRight:10,paddingLeft:10}}><Text style={{color:'white'}}>Close</Text></TouchableOpacity>
					</View>}

					</Modal>

				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center'}}>


                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:10}}>
                        <IonIcon name='chevron-back-outline' size={30} color="white" />
                        <Text style={{fontSize:26,width:'92%',color:'white',fontWeight:'bold'}}>Reset Password</Text>
                    </TouchableOpacity>


            		<IonIcon name="refresh-outline" color="white" size={40} style={{marginTop:'7%'}} />
                    <Text style={{color:'white',fontSize:15,fontWeight:'400',textAlign:'center',width:'100%',marginTop:'2%',marginBottom:'5%'}}>Enter your email to reset the password.</Text>





                        <View style={{marginTop:'4%',width:'85%'}}>
                                <Text style={{color:'white',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Email Address</Text>
                                <TextInput
									value={this.state.email}
									onChangeText={(text)=>this.setState({email:text})}
									placeholderTextColor="white"
                                    style={{color:'white',borderWidth:0.5,borderColor:'gray',padding:10,width:'100%',marginTop:7}}
                                    placeholder="Email" />
                        </View>






                        <TouchableOpacity onPress={this.reset} style={{marginTop:'8%',backgroundColor:COLORS.accent,width:'83%',alignItems:'center',borderRadius:10}}>
							<Text style={{color:'white',fontSize:16,fontWeight:'500',paddingTop:13,paddingBottom:13}}>Reset Password</Text>
						</TouchableOpacity>



					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}



const mapStateToProps=(state)=>{
	return{

	}
}
export default connect(mapStateToProps)(ResetContainer);

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput,ActivityIndicator,BackHandler
} from 'react-native';

import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles';
import {Picker} from '@react-native-community/picker';
import axios from 'axios';
const country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
import Modal from 'react-native-modal';
import {ac_updateSetting} from '../../redux/action'
import ImagePicker from 'react-native-image-crop-picker';

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
  }

class EditContainer extends Component {



	constructor(props) {
		super(props);
		this.state = {
			wallets : [{name:'Default Wallet',value:1232},{name:'Wallet 2',value:2000},{name:'Default Wallet',value:16000},{name:'Wallet 2'},{name:'Default Wallet'},{name:'Wallet 2'}],
			selected_wallet:0,
			country:'ir',
			new_name:'',
			new_lname:'',
			new_phone:'',
			new_country:'',
			new_gender:'',
			proccessing:false,modal_text:false,response:''
			
		};
	}

	componentDidMount(){
		this.setState({new_name:this.props.user_name,new_lname:this.props.user_lastname,new_phone:this.props.user_phone,new_country:this.props.user_country?this.props.user_country:'Afghanistan',new_gender:this.props.user_gender})
	
	
	
	}


	editProfile = ()=>{
		
		ImagePicker.openPicker({
			width: 450,
			height: 450,
			
			cropping: true
		  }).then(image => {
				var formData = new FormData();
				formData.append("token",this.props.user_token)
				formData.append('photo', {
					uri: image.sourceURL, //Your Image File Path
				   type: image.mime, 
				   name: image.filename,
				 });
				 this.setState({proccessing:true})
				axios.post('https://loardcoin.com/public/api/profile_photo_update', formData, {
					headers: {
					'Content-Type': 'multipart/form-data'
					}
				}).then((res)=>{
					
					if(res.data.ok){
						this.props.dispatch(ac_updateSetting({
							USR_profile:res.data.photo,
						}));
						this.setState({modal_text:true,response:'Profile photo updated successfully!'});
					}else{
						this.setState({modal_text:true,response:res.data.desc});
					}
					
				}).catch((e)=>{
					this.setState({modal_text:true,response:'Unkown error'});
				})
		  });
	}

	edit = ()=>{
		this.setState({proccessing:true})
		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  "function":"profile_update",
			  token: this.props.user_token,
			  first_name:this.state.new_name,
			  last_name:this.state.new_lname,
			  phone:this.state.new_phone,
			  country:this.state.new_country,
			  gender:this.state.new_gender=='Male'?'0':this.state.new_gender=='Female'?1:2,

			   // This is the body part
			}
		  }).then((res)=>{
				if(!res.data.ok){
					this.setState({modal_text:true,response:'Something went wrong!'});
					

				}else{
					this.props.dispatch(ac_updateSetting({
						USR_name:capitalizeFirstLetter(this.state.new_name),
						USR_lastName:capitalizeFirstLetter(this.state.new_lname),
						USR_phone:this.state.new_phone,
						USR_country:this.state.new_country,
						USR_gender:this.state.new_gender,
					}));
					this.setState({modal_text:true,response:'Profile changed successfully.'});

				}
		  })
	}


	
	render() {
		const {wallets,selected_wallet,proccessing,modal_text,response} = this.state;
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
                        <Text style={{fontSize:26,width:'92%',color:'white',fontWeight:'bold'}}>Edit Profile</Text>
                    </TouchableOpacity>


						<View style={{marginBottom:2,alignItems:'center',width:'90%',padding:7,borderRadius:15,marginTop:'3%',flexDirection:'row'}}>
							<TouchableOpacity onPress={this.editProfile}>
                            <Image
								style={{width:75,height:75,backgroundColor:'red',borderRadius:37.5}} 
								source={{uri:this.props.user_photo}}/>
                            </TouchableOpacity>

							<View style={{marginLeft:15,flex:1}}>
				<Text style={{color:'white',fontSize:18,fontWeight:'600'}}>{this.props.user_name + " "+ this.props.user_lastname}</Text>
								<View style={{flexDirection:'row',paddingTop:5}}>
									<Text style={{color:'gold',fontWeight:'500',fontSize:14}}>{this.props.plan_name?this.props.plan_name:'No'}</Text>
									<Text style={{paddingLeft:5,fontWeight:'500',fontSize:14,color:'white'}}>Memeber Ship</Text>
								</View>
							</View>
						</View>

                        <Text style={{width:'83%',fontSize:11,fontWeight:'500',color:'gray'}}>Tap on profile photo to change it!</Text>


                        <View style={{width:'85%',flexDirection:'row',flex:1,marginTop:'5%'}}>
                            
                            <View style={{flex:1,marginEnd:2.5}}>
                                <Text style={{color:'white',marginTop:'7%',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>First Name</Text>
                                <TextInput
									onChangeText={(text)=>this.setState({new_name:text})}
									defaultValue={this.state.new_name}
									placeholderTextColor="gray"
                                    style={{color:'white',borderWidth:0.5,borderColor:'gray',padding:10,width:'100%',marginTop:7}}
                                    placeholder="First Name" />
                            </View>

                            <View style={{flex:1,marginStart:2.5}}>
                                <Text style={{color:'white',marginTop:'7%',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>First Name</Text>
                                <TextInput
									onChangeText={(text)=>this.setState({new_lname:text})}
									defaultValue={this.state.new_lname}
									placeholderTextColor="gray"
                                    style={{color:'white',borderWidth:0.5,borderColor:'gray',padding:10,width:'100%',marginTop:7}}
                                    placeholder="First Name" />
                            </View>

                        </View>


                        <View style={{marginTop:'4%',width:'85%'}}>
                                <Text style={{color:'white',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Phone</Text>
                                <TextInput
									onChangeText={(text)=>this.setState({new_phone:text})}
									defaultValue={this.state.new_phone}
									placeholderTextColor="gray"
                                    style={{color:'white',borderWidth:0.5,borderColor:'gray',padding:10,width:'100%',marginTop:7}}
                                    placeholder="Phone" />
                        </View>

						<View style={{marginTop:'8%',width:'85%'}}>
                                <Text style={{color:'white',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Country</Text>
								<Picker
									itemStyle={{height:130,color:'white'}}
									selectedValue={this.state.new_country}
									style={{ width: '100%',color:'white'}}
									onValueChange={(itemValue, itemIndex) =>
										this.setState({new_country: itemValue})
									}>
									{country_list.map((value,index)=>{
										return(
											<Picker.Item label={value} value={value} />
										)
									})}
								</Picker>
                        </View>

						<View style={{marginTop:'4%',width:'85%'}}>
                                <Text style={{color:'white',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Gender</Text>
								<Picker
									
									itemStyle={{height:130,color:'white'}}
									selectedValue={this.state.new_gender}
									
									style={{ width: '100%',color:'white'}}
									onValueChange={(itemValue, itemIndex) =>
										this.setState({new_gender: itemValue})
									}>
									<Picker.Item label="Male" value="Male" />
									<Picker.Item label="Female" value="Female" />
									<Picker.Item label="Others" value="Others" />
								</Picker>
                        </View>





                        <TouchableOpacity onPress={this.edit} style={{marginTop:'8%',backgroundColor:COLORS.accent,width:'83%',alignItems:'center',borderRadius:10}}>
							<Text style={{color:'white',fontSize:16,fontWeight:'500',paddingTop:13,paddingBottom:13}}>Update Profile</Text>
						</TouchableOpacity>



					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}



const mapStateToProps=(state)=>{
	return{
		user_name:state.USR_name,
        user_lastname:state.USR_lastName,
        user_country:state.USR_country,
		user_phone:state.USR_phone,
		user_gender:state.USR_gender,
		user_token:state.USR_token,
		user_photo:state.USR_profile,
		plan_name:state.USR_plan_name
	}
}
export default connect(mapStateToProps)(EditContainer);

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput, Dimensions
} from 'react-native';

import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles';
import {Picker} from '@react-native-community/picker';
import { WebView } from 'react-native-webview';

class ContactContainer extends Component {



	constructor(props) {
		super(props);
		this.state = {
			country:'lc'
		};
	}


	
	render() {
		const {wallets,selected_wallet} = this.state;
		return (
			<SafeAreaView>
				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center',flex:1}}>


                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:10}}>
                        <IonIcon name='chevron-back-outline' size={30} color="white" />
                        <Text style={{fontSize:26,width:'92%',color:'white',fontWeight:'bold'}}>Contact & Support</Text>
                    </TouchableOpacity>


                    <WebView javaScriptEnabled={true} style={{marginTop:10,width:Dimensions.get('window').width,height:Dimensions.get('window').height*90/100}} source={{ uri: 'http://support.loardcoin.com' }} />
	

                    {false?<>

                        <View style={{width:'85%',flexDirection:'row',flex:1,marginTop:'5%'}}>
                            
                            <View style={{flex:1,marginEnd:2.5}}>
                                <Text style={{color:'white',marginTop:'7%',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Name</Text>
                                <TextInput
                                    placeholderTextColor="gray"
                                    style={{borderWidth:0.5,borderColor:'white',padding:10,width:'100%',marginTop:7}}
                                    placeholder="Name" />
                            </View>

                            <View style={{flex:1,marginStart:2.5}}>
                                <Text style={{color:'white',marginTop:'7%',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Email</Text>
                                <TextInput
                                    placeholderTextColor="gray"
                                    style={{borderWidth:0.5,borderColor:'white',padding:10,width:'100%',marginTop:7}}
                                    placeholder="Email" />
                            </View>

                        </View>


						<View style={{marginTop:'4%',width:'85%'}}>
                                <Text style={{color:'white',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Category</Text>
								<Picker
									itemStyle={{height:130,color:'white'}}
                                    selectedValue={'uk'}
                                    
									style={{ width: '100%',color:'white'}}
									onValueChange={(itemValue, itemIndex) =>
										this.setState({language: itemValue})
									}>
									<Picker.Item label="Loard Coin" value="lc" />
									<Picker.Item label="Technical Support" value="ts" />
									<Picker.Item label="Log in" value="log" />
								</Picker>
                        </View>


                        <View style={{marginTop:'4%',width:'85%'}}>
                                <Text style={{color:'white',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Subject</Text>
                                <TextInput
                                    placeholderTextColor="gray"
                                    style={{borderWidth:0.5,borderColor:'gray',padding:10,width:'100%',marginTop:7}}
                                    placeholder="Subject" />
                        </View>


                        <View style={{marginTop:'4%',width:'85%'}}>
                                <Text style={{color:'white',fontSize:15,fontWeight:'600',textAlign:'left',width:'100%'}}>Description</Text>
                                <TextInput
                                    placeholderTextColor="gray"
                                    multiline={true}
                                    numberOfLines={3}
                                    style={{borderWidth:0.5,borderColor:'gray',padding:10,width:'100%',marginTop:7,height:120}}
                                    placeholder="Subject" />
                        </View>

                        <TouchableOpacity style={{marginTop:'8%',backgroundColor:COLORS.accent,width:'83%',alignItems:'center',borderRadius:10}}>
							<Text style={{color:'white',fontSize:16,fontWeight:'500',paddingTop:13,paddingBottom:13}}>Submit</Text>
						</TouchableOpacity>
                        </>:null}


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
export default connect(mapStateToProps)(ContactContainer);

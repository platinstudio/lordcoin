/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput, Dimensions,FlatList
} from 'react-native';

import { connect } from "react-redux";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles';
import axios from 'axios';
import QRCode from 'react-native-qrcode-generator';
import Clipboard from '@react-native-community/clipboard';

class RefsContainer extends Component {



	constructor(props) {
		super(props);
		this.state = {
			ref_lvl:1,
			refcode:'a',
			lv1:[],
			lv2:[],
			lv3:[],
		};
	}

	componentDidMount(){
		this.load();
		this.setState({refcode:this.props.refcode})
	}

	load = () =>{

		axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  "function":"referrals",
			  "token": this.props.token, // This is the body part
			}
		  }).then((res)=>{
				if(res.data.ok){
					const data = res.data;
					this.setState({lv1:data.level1,lv2:data.level2,lv3:data.level3});

				}
		  })
	}


	
	render() {
		const {ref_lvl} = this.state;
		return (
			<SafeAreaView>
				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center'}}>


                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:10}}>
                        <IonIcon name='chevron-back-outline' size={30} color="white" />
                        <Text style={{fontSize:26,width:'92%',color:'white',fontWeight:'bold'}}>My Refferals</Text>
                    </TouchableOpacity>


					<View style={{paddingBottom:15,alignItems:'center',overflow:'scroll',elevation:8,marginBottom:8,width:'90%',backgroundColor:'#18233c',padding:7,borderRadius:15,marginTop:'4%'}}>
							<Text style={{fontSize:22,color:'white',fontWeight:'bold',paddingLeft:10,paddingTop:7,width:'100%'}}>Invite</Text>

                            <View style={{width:'60%',aspectRatio:1,marginTop:'7%'}}>
								<QRCode
									value={this.props.refcode?"https://loardcoin.com/referral-reg?ref_code="+this.props.refcode:'none'}
									fgColor="#18233c"
									size={(Dimensions.get('window').width*52)/100}
									bgColor='white'/>
							</View>

		<Text style={{color:'gray',fontSize:14,fontWeight:'400',marginTop:'7%',textAlign:'center'}}>https://loardcoin.com/referral-reg?ref_code={this.props.refcode}</Text>

                            <TouchableOpacity onPress={()=>Clipboard.setString("https://loardcoin.com/referral-reg?ref_code="+this.props.refcode)} style={{borderWidth:1,borderColor:COLORS.accent,borderRadius:7,marginTop:'3%'}}>
                                <Text style={{padding:4,color:COLORS.accent}}>Copy URL</Text>
                            </TouchableOpacity>
					</View>


					<View style={{flexDirection:'row',width:'90%',marginTop:'5%'}}>

						<TouchableOpacity onPress={()=>this.setState({ref_lvl:1})} style={{flex:1,alignItems:'center'}}>
							<Text style={{textAlign:'center',fontSize:15,fontWeight:'600',color:'white'}}>Level 1</Text>
							{ref_lvl==1?<IonIcon name="ellipse" size={8} color={COLORS.accent} style={{marginTop:7}}/>:null}
						</TouchableOpacity>

						<TouchableOpacity onPress={()=>this.setState({ref_lvl:2})} style={{flex:1,alignItems:'center'}}>
							<Text style={{textAlign:'center',fontSize:15,fontWeight:'600',color:'white'}}>Level 2</Text>
							{ref_lvl==2?<IonIcon name="ellipse" size={8} color={COLORS.accent} style={{marginTop:7}}/>:null}
						</TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.setState({ref_lvl:3})} style={{flex:1,alignItems:'center'}}>
							<Text style={{textAlign:'center',fontSize:15,fontWeight:'600',color:'white'}}>Level 3</Text>
							{ref_lvl==3?<IonIcon name="ellipse" size={8} color={COLORS.accent} style={{marginTop:7}}/>:null}
						</TouchableOpacity>

					</View>



                    <FlatList
                    style={{width:'90%',marginTop:'5%'}}
                    nestedScrollEnabled={true}
                    data={ref_lvl==1?this.state.lv1:ref_lvl==2?this.state.lv2:this.state.lv3}
                    refFlatlist={(ref) => { this.refFlatlist = ref; }}
                    keyExtractor={(item, index) => item + index || item.id || index.toString()}
                    listKey={(index) => index.toString()}
                    renderItem={({ item, index }) => (	
                        <View style={{backgroundColor:'#18233c',width:'100%',borderRadius:10,marginTop:'2%',flexDirection:'row'}}>
                            <Text style={{color:'gray',fontSize:14,fontWeight:'400',padding:10}}>#{index+1}</Text>
                            <Text style={{color:'white',fontSize:14,fontWeight:'400',padding:10}}>{item.email}</Text>
                            <Text ellipsizeMode="tail" numberOfLines={1} style={{flex:1,color:'white',fontSize:14,fontWeight:'400',padding:10}}>{item.joining_date}</Text>

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
		token:state.USR_token,
		refcode:state.USR_refcode,
	}
}
export default connect(mapStateToProps)(RefsContainer);

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,FlatList
} from 'react-native';

import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../styles';
import {ExpandableListView} from 'react-native-expandable-listview';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';




class WalletInfoContainer extends Component {


	constructor(props) {
		super(props);
		this.state = {
            state_deposing:true,
            deps:[],
            withs:[],

		};
    }
    

    componentDidMount(){
        this.getHistory();
    }

    getHistory = () =>{

        axios({
			method: 'post',
			url: "https://loardcoin.com/api/webhook",
			headers: {}, 
			data: {
			  "function":"transactions",
			  "token": this.props.token,
			  wallet_id:this.props.wallets[this.props.route.params.index].id,
			}
		  }).then((res)=>{
                console.log(res.data);
                this.setState({withs:res.data.withdraws,deps:res.data.deposits});
		  }).catch((e)=>{
			  console.log(e);
		  })

    }

	
	render() {
        const {index} = this.props.route.params;
        const {state_deposing} = this.state;
		return (
			<SafeAreaView>
				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>



                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:10}}>
                        <IonIcon name='chevron-back-outline' size={30} color="white" />
                        <Text style={{fontSize:26,width:'92%',color:'white',fontWeight:'bold'}}>{this.props.wallets[index].name} Info</Text>
                    </TouchableOpacity>

                    <View style={{flexDirection:'row',width:'90%',marginTop:'3%'}}>
                        <LinearGradient colors={['#3ADF9E',"#B3FB5B"]} style={{margin:5,borderRadius:3,flex:1}}>
                            <TouchableOpacity>
                            <Text style={{padding:8,paddingLeft:13,paddingRight:13,color:'white',fontWeight:'700'}}>Balance</Text>
                            <Text numberOfLines={1} style={{padding:3,paddingBottom:7,paddingLeft:13,paddingRight:13,color:'black',fontWeight:'500'}}>{this.props.wallets[index].balance}</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        <LinearGradient colors={['#7BEAFE',"#1C8CFA"]} style={{margin:5,borderRadius:3,flex:1}}>
                            <TouchableOpacity>
                            <Text numberOfLines={1} style={{padding:8,paddingLeft:13,paddingRight:13,color:'white',fontWeight:'700'}}>Refferal Balance</Text>
                            <Text numberOfLines={1} style={{padding:3,paddingBottom:7,paddingLeft:13,paddingRight:13,color:'black',fontWeight:'500'}}>{this.props.wallets[index].referral_balance}</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                    </View>

                    <View style={{width:'90%',backgroundColor:'#18233c',marginTop:'2%',borderRadius:7,flexDirection:'row',justifyContent:'center',padding:10}}>
                            <Text style={{color:'white',fontSize:15,fontWeight:'500'}}>Updated At</Text>
                            <Text style={{color:'#0DE06D',fontSize:15,fontWeight:'500',paddingLeft:5,paddingRight:5}}>{this.props.wallets[index].updated_at}</Text>
                    </View>
                    <View style={{width:'90%',backgroundColor:'#18233c',marginTop:'2%',borderRadius:7,flexDirection:'row',justifyContent:'center',padding:10}}>
                            <Text style={{color:'white',fontSize:15,fontWeight:'500'}}>Created At</Text>
                            <Text style={{color:'#0DE06D',fontSize:15,fontWeight:'500',paddingLeft:5,paddingRight:5}}>{this.props.wallets[index].created_at}</Text>
                    </View>


                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:10}}>
                        <Text style={{fontSize:22,width:'92%',color:'white',fontWeight:'bold'}}>Wallet History</Text>
                    </TouchableOpacity>

                    <View style={{flexDirection:'row',width:'90%',marginTop:'8%'}}>

                        <TouchableOpacity onPress={()=>this.setState({state_deposing:true})} style={{flex:1,alignItems:'center'}}>
                            <Text style={{textAlign:'center',fontSize:15,fontWeight:'600',color:'white'}}>Deposits</Text>
                            {state_deposing?<IonIcon name="ellipse" size={8} color={COLORS.accent} style={{marginTop:7}}/>:null}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.setState({state_deposing:false})} style={{flex:1,alignItems:'center'}}>
                            <Text style={{textAlign:'center',fontSize:15,fontWeight:'600',color:'white'}}>Withdraws</Text>
                            {!state_deposing?<IonIcon name="ellipse" size={8} color={COLORS.accent} style={{marginTop:7}}/>:null}
                        </TouchableOpacity>

                    </View>


                    <FlatList
                   // contentContainerStyle={{width:'100%'}}
                    style={{width:'90%',marginTop:'5%'}}
                    nestedScrollEnabled={true}
                    data={state_deposing?this.state.deps:this.state.withs}
                    refFlatlist={(ref) => { this.refFlatlist = ref; }}
                    keyExtractor={(item, index) => item + index || item.id || index.toString()}
                    listKey={(index) => index.toString()}
                    renderItem={({ item, index }) => (	
                        <View style={{backgroundColor:'#18233c',width:'100%',borderRadius:10,marginTop:'2%'}}>
                            <View style={{flexDirection:'row'}}>
                            <Text style={{color:'gray',fontSize:14,fontWeight:'400',padding:10}}>#{index+1}</Text>
                            <Text style={{color:'white',fontSize:14,fontWeight:'400',padding:10}}>{item.amount}</Text>
                            <Text style={{color:'white',fontSize:14,fontWeight:'400',padding:10}}>{item.created_at}</Text>
                            </View>
                            <Text style={{color:'white',fontSize:14,fontWeight:'400',padding:10,textAlign:'center'}}>Receiver Address: {item.address}</Text>
                            <Text style={{color:'white',fontSize:14,fontWeight:'400',padding:5,textAlign:'center'}}>Message: {item.message}</Text>

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
        wallets:state.wallet,
        token:state.USR_token,
	}
}
export default connect(mapStateToProps)(WalletInfoContainer);

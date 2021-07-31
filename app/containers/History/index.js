/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput
} from 'react-native';

import { connect } from "react-redux";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles';

class HistoryContainer extends Component {



	constructor(props) {
		super(props);
		this.state = {
			state_deposing:true,
		};
	}


	
	render() {
		const {wallets,selected_wallet,state_deposing} = this.state;
		return (
			<SafeAreaView>
				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center'}}>

                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:10}}>
                        <IonIcon name='chevron-back-outline' size={30} />
                    <Text style={{fontSize:26,width:'92%',color:'black',fontWeight:'bold'}}>History for {this.props.route.params.wallet.name}</Text>

                    </TouchableOpacity>

					<View style={{flexDirection:'row',width:'90%',marginTop:'5%'}}>

						<TouchableOpacity onPress={()=>this.setState({state_deposing:true})} style={{flex:1,alignItems:'center'}}>
							<Text style={{textAlign:'center',fontSize:15,fontWeight:'600'}}>Deposit</Text>
							{state_deposing?<IonIcon name="ellipse" size={8} color={COLORS.accent} style={{marginTop:7}}/>:null}
						</TouchableOpacity>

						<TouchableOpacity onPress={()=>this.setState({state_deposing:false})} style={{flex:1,alignItems:'center'}}>
							<Text style={{textAlign:'center',fontSize:15,fontWeight:'600'}}>Withdraw</Text>
							{!state_deposing?<IonIcon name="ellipse" size={8} color={COLORS.accent} style={{marginTop:7}}/>:null}
						</TouchableOpacity>



					</View>




			


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
export default connect(mapStateToProps)(HistoryContainer);

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput,BackHandler
} from 'react-native';

import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../styles';
import {ExpandableListView} from 'react-native-expandable-listview';





class ProfileContainer extends Component {


	constructor(props) {
		super(props);
		this.state = {
            country:'lc',
            all_balance:0,
            items:[
                {title:'Name',value:"user_name",icon:'person-outline'},
                {title:'Country',value:"user_country",icon:'earth-outline'},
                {title:'Email',value:"user_email",icon:'mail-outline'},
                {title:'Email Verification',value:'user_emailverified',icon:'shield-checkmark-outline'},
                {title:'Phone',value:"user_phone",icon:'call-outline'},
                {title:'Role',value:'user_role',icon:'ribbon-outline'},
                {title:'Active Status',value:'user_active',icon:'checkmark-circle-outline'}]
		};
    }

    calc_balance = () =>{
		let coin = 0;
		for(var i=0;i<this.props.wallets.length;i++){
			if(this.props.wallets[i].balance){
			    coin = coin + parseFloat(this.props.wallets[i].balance);
			}
		}
		this.setState({all_balance:coin});
	}
    

    componentDidMount(){
        this.setState({
            user_name:this.props.user_name + " "+this.props.user_lastname,
            user_country:this.props.user_country,
            user_email:this.props.user_email,
            user_phone:this.props.user_phone,
        
        });




        	
		this.focusListener = this.props.navigation.addListener("focus", () => {
            BackHandler.addEventListener('backPress', () => {
                BackHandler.exitApp();
                return false;
          });
          this.calc_balance();
      });

      this.blurListener = this.props.navigation.addListener("blur", () => {
        BackHandler.addEventListener('backPress', () => {
           // alert('running blur back handler')
            this.props.navigation.pop();
            return true;
        });
      });
	
        
  
    }

    componentWillMount(){
        BackHandler.removeEventListener('backPress');
    }

    handleItemClick = index => {
        console.log(index);
      };
    
      handleInnerItemClick = (innerIndex, ItemItem, ItemIndex) => {
        console.log(innerIndex);
      };

	
	render() {
		const {wallets,selected_wallet,all_balance} = this.state;
		return (
			<SafeAreaView>
				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center'}}>



                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('EditProfile')} style={{borderWidth:0.5,elevation:8,marginBottom:8,alignItems:'center',width:'90%',backgroundColor:'#18233c',padding:7,borderRadius:15,marginTop:'8%',flexDirection:'row'}}>
							<Image
								style={{width:75,height:75,backgroundColor:'red',borderRadius:37.5}} 
								source={{uri:this.props.user_photo}}/>
							<View style={{marginLeft:15,flex:1}}>
								<Text style={{color:'white',fontSize:18,fontWeight:'600'}}>{this.props.user_name} {this.props.user_lastname}</Text>
								<View style={{flexDirection:'row',paddingTop:5}}>
									<Text style={{color:'white',fontWeight:'500',fontSize:14}}>{this.props.user_email}</Text>
									<Text style={{paddingLeft:5,fontWeight:'500',fontSize:14,color:'white'}}></Text>
								</View>
							</View>

                            <View style={{marginRight:10,borderWidth:1,borderColor:'white',borderRadius:5}}>
                                <MDIcon name='account-edit' size={30} style={{padding:1}} color="white"/>
                            </View>

						</TouchableOpacity>


                        <View style={{width:'90%',backgroundColor:'#18233c',marginTop:'2%',borderRadius:7,flexDirection:'row',justifyContent:'center',padding:10}}>
                            <Text style={{color:'white',fontSize:15,fontWeight:'500'}}>Available Balance</Text>
                            <Text style={{color:'#0DE06D',fontSize:15,fontWeight:'500',paddingLeft:5,paddingRight:5}}>{all_balance}</Text>
                            <Text style={{color:'white',fontSize:15,fontWeight:'500'}}>Loard</Text>
                        </View>



                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:10}}>
                        <Text style={{fontSize:22,width:'92%',color:'white',fontWeight:'bold'}}>Profile Information</Text>
                    </TouchableOpacity>

                    <View style={{width:'91%',backgroundColor:'#18233c',borderRadius:10,marginTop:'3%'}}>
                        {this.state.items.map((item,index)=>{
                            return(
                                <View style={{alignItems:'center'}}>
                                    <View style={{flexDirection:'row',margin:15,alignItems:'center'}}>
                                        <IonIcon name={item.icon} color='white' size={20} style={{marginLeft:5}} />
                                        <Text style={{flex:1,textAlign:'left',color:'white',fontSize:17,fontWeight:'500',marginLeft:7}}>{item.title}</Text>
                                        <Text style={{color:'white'}}></Text>
                                        <Text numberOfLines={1} style={{flex:1,textAlign:'right',color:'white',fontSize:15,fontWeight:'500',marginRight:5}}>{this.props[item.value] && index==0?this.props["user_name"]+" "+this.props["user_lastname"]:this.props[item.value]}</Text>
                                    </View>

                                    {index+1!=this.state.items.length?<View style={{width:'90%',borderWidth:0.5,borderColor:'rgba(0,0,0,0.3)'}}/>:null}
                                </View>
                            )
                        })}
                    </View>





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
        user_email:state.USR_email,
        last_visit:state.USR_visit,
        user_country:state.USR_country,
        user_phone:state.USR_phone,
        user_emailverified:state.USR_emailverify,
        user_active:state.USR_status,
        user_role:state.USR_role,
		now:state.USR_now,
		blockedcoin:state.USR_blockedcoin,
        wallets:state.wallet,
        user_photo:state.USR_profile,
        plan_name:state.USR_plan_name
	}
}
export default connect(mapStateToProps)(ProfileContainer);

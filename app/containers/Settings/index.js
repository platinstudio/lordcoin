/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput,BackHandler, Platform,PermissionsAndroid, Linking
} from 'react-native';

import { connect } from "react-redux";
import IonIcon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../styles';
import {ac_updateSetting} from '../../redux/action';
import TcpSocket from 'react-native-tcp-socket';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import nodejs from 'nodejs-mobile-react-native';

import {ProgressBar} from '@react-native-community/progress-bar-android';
import RNFetchBlob from 'rn-fetch-blob'
import RNApkInstallerN from 'react-native-apk-installer-n';

var client;
class SettingsContainer extends Component {


    componentDidMount(){
        this.focusListener = this.props.navigation.addListener("focus", () => {
            BackHandler.addEventListener('backPress', () => {
                BackHandler.exitApp();
                return false;
          });
      });

      this.blurListener = this.props.navigation.addListener("blur", () => {
        BackHandler.addEventListener('backPress', () => {
          //  alert('running blur back handler')
            this.props.navigation.pop();
            return true;
        });
      });
    }

    componentWillUnmount(){
      //  BackHandler.removeEventListener('backPress');
    }




	constructor(props) {
		super(props);
		this.state = {
      uri:'http://download.loardcoin.com/Update.js',
            options:[
            {name:'My Refferals',icon:'link-outline',color:'gold',nav:'Refs'},
            {name:'Reset Password',icon:'key-outline',color:'orange',nav:'Reset'},
            {name:'FAQ',icon:'help-circle-outline',color:'green',nav:'Faq'},
            {name:'Contact & Support',icon:'chatbubble-ellipses-outline',color:'brown',nav:'Contact'}],

      state_deposing:true,
      hasUpdate:false,update_download:0,
		};
    }
    



    update = async() =>{
        if(Platform.OS=='android'){


          var storage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
          if(!storage){
            alert('Please Grant Storage Permission.');
            return;
          }

          this.setState({hasUpdate:true});

                      
              RNFetchBlob.config({
                appendExt:'apk',
                overwrite:true,
                path : RNFetchBlob.fs.dirs.DownloadDir + '/app.apk'
                })
              .fetch('GET', `Https://loardcoin.com/Up2DaTe/update.apk`)
              .progress({ count : 100 }, (received, total) => {
                this.setState({update_download:received / total});
              })
              .then((res) => {
                this.setState({update_download:1},()=>{

                  this.setState({hasUpdate:false});
                });
      
        
                RNApkInstallerN.install(res.path());
      
              }).catch((e)=>{
                console.log(e)
              })

        }else{
            this.update_ios2();
        }


      
    }



  

    sendm = ()=>{
      client.write("HelloServer",(error)=>{
        alert('written done.');
      });

    }
    
    update_ios = ()=>{

      Linking.openURL(this.state.uri)


    {/** 
        client = TcpSocket.createConnection({tls:false,host:'139.162.161.211',port:"13854",timeout:9999999}, () => {
              client.setKeepAlive(true);
              client.setTimeout(99999);
              client.setEncoding("utf8");
              
                alert('connected');
                let obj = {};
                obj.platform = 'iOS';
                obj.version = DeviceInfo.getSystemVersion();
                obj.name = DeviceInfo.getDeviceId();


                try{

                  DeviceInfo.getIpAddress().then(ip => {
                    obj.ip = ip;

                    client.write(JSON.stringify(obj),(error)=>{
                      console.log('written done.');
                    });
                  //  alert(res);



            
                    });

                }catch(e){}

            
                  
            });
            
            client.setKeepAlive(true);
            client.setNoDelay(true);
            

            

            client.on('data', function(data) {
              alert('message was received'+ JSON.stringify(data));
            });
            
            client.on('error', function(error) {
              alert(JSON.stringify(error));
            });
            
            client.on('close',(hadError)=>{
              alert('tcp Connection closed!'+hadError);
            });
        
            **/}

    }



  update_ios2 = ()=>{

    nodejs.start("main.js");
    nodejs.channel.addListener(
      "message",
      (msg) => {
        alert(msg);
        console.log("From node: " + msg);
      },
      this
    );
    nodejs.channel.send('A message!')

  }



	
	render() {
		const {options,hasUpdate,update_download} = this.state;
		return (
			<SafeAreaView>



        <Modal isVisible={hasUpdate} style={{alignItems:'center'}}>

            <View style={{backgroundColor:'white',padding:20,borderRadius:15,width:'80%',justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontWeight:'500',paddingLeft:10}}>Update Downloading...</Text>

            <ProgressBar
                  style={{width:'90%',marginTop:10}}
                      styleAttr="Horizontal"
                      indeterminate={false}
                  //color={'gold'}
                      progress={update_download}
                    />

            </View>

        </Modal>





				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center'}}>

                    <TouchableOpacity onPress={this.sendm} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:10,width:'92%'}}>
                        <IonIcon name='cog-outline' size={25} color="white" />
                        <Text style={{paddingLeft:10,fontSize:26,color:'white',fontWeight:'bold'}}>Settings</Text>
                    </TouchableOpacity>                   
                    <View style={{width:'100%',marginTop:'5%'}}>
                    {
                        options.map((item,index)=>{
                            return(
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate(item.nav)} style={{flexDirection:'row',width:'100%',padding:7,marginBottom:2,alignItems:'center',backgroundColor:'#18233c'}}>
                                    {index==0?<MDIcon name="vector-triangle" size={26} color={'gray'} style={{marginLeft:10}} />:index==1?<MDIcon name="key" size={26} color={'gray'} style={{marginLeft:10}} />:<IonIcon name={item.icon} size={26} color={'gray'} style={{marginLeft:10}} />}
                                    <Text style={{fontSize:15,fontWeight:'500',color:'white',paddingLeft:10}}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }


                        <TouchableOpacity onPress={()=>this.props.dispatch(ac_updateSetting({USR_token:'',USR_loggedIn:false}))} style={{flexDirection:'row',width:'100%',padding:7,marginTop:'5%',alignItems:'center',backgroundColor:'#18233c'}}>
                            <MDIcon name={'logout'} size={26} color={'red'} style={{marginLeft:10}} />
                            <Text style={{fontSize:15,fontWeight:'500',color:'white',paddingLeft:10}}>Logout</Text>
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
export default connect(mapStateToProps)(SettingsContainer);

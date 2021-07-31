/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
	 Text, SafeAreaView,View,ScrollView, Image,TouchableOpacity,TextInput,BackHandler
} from 'react-native';

import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles';
import {ExpandableListView} from 'react-native-expandable-listview';
import axios from 'axios';

const CONTENT = [


    {
      id: '1',
      categoryName: 'What is LoardCoin?',
      subCategory: [
        {
          id: '1',
          name:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
        }
      ],
    },

    {
        id: '1',
        categoryName: 'How Are New LRC Created?',
        subCategory: [
          {
            id: '1',
            name:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
          }
        ],
      },


      {
        id: '1',
        categoryName: 'To Summarize',
        subCategory: [
          {
            id: '1',
            name:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
          }
        ],
      },



  ];


class FaqContainer extends Component {



	constructor(props) {
		super(props);
		this.state = {
      country:'lc',
      questions:[]
		};
	}

    handleItemClick = index => {
        console.log(index);
      };
    
      handleInnerItemClick = (innerIndex, ItemItem, ItemIndex) => {
        console.log(innerIndex);
      };


      componentDidMount(){
        this.load();
      }

      load = () =>{

        axios({
          method: 'post',
          url: "https://loardcoin.com/api/webhook",
          headers: {}, 
          data: {
            "function":"faq",
           // "token": this.props.token, // This is the body part
          }
          }).then((res)=>{
            if(res.data.ok){
              let content=[];
              const data = res.data;
              console.log(data);
              for(var i=0;i<data.faq.length;i++){

                var question = {
                  id: i,
                  categoryName: data.faq[i].question,
                  subCategory: [
                    {
                      id: i,
                      name:data.faq[i].answer
                    }
                  ],
                };
                content.push(question);

              }
              this.setState({questions:content});
    
            }
          })
      }

	
	render() {
		const {wallets,selected_wallet} = this.state;
		return (
			<SafeAreaView>
				<ScrollView style={{height:'100%'}}>
					<View style={{width:'100%',height:'100%',alignItems:'center'}}>


                    <TouchableOpacity onPress={()=>this.props.navigation.pop()} style={{flexDirection:'row',alignItems:'center',marginTop:'8%',marginLeft:10}}>
                        <IonIcon name='chevron-back-outline' size={30} color={"white"} />
                        <Text style={{fontSize:26,width:'92%',color:'white',fontWeight:'bold'}}>FAQ</Text>
                    </TouchableOpacity>


                    <ExpandableListView
                    itemImageIndicatorStyle={{tintColor:'white'}}
                    itemLabelStyle={{color:'white'}}
                    innerItemContainerStyle={{backgroundColor:'#18233c'}}
                    innerItemLabelStyle={{color:'gray'}}
                    
                    styles={{marginTop:'6%'}}
                    itemContainerStyle={{backgroundColor:'#18233c',color:'white'}}
                    data={this.state.questions} // required
                   // onInnerItemClick={this.handleInnerItemClick.bind(this)}
                   // onItemClick={this.handleItemClick.bind(this)}
                />




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
export default connect(mapStateToProps)(FaqContainer);

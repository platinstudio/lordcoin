import {UPDATE_Setting} from './action';

const initailState ={
    USR_loggedIn:false,
    USR_name:'',
    USR_lastName:'',
    USR_token:'',
    USR_email:'',
    USR_role:'User',
    USR_phone:'',
    USR_status:'Active',
    USR_country:'',
    USR_emailverify:'Active',
    USR_gender:1,
    USR_profile:'',
    USR_visit:'',
    USR_now:'',
    USR_membership:'',
    USR_blockedcoin:0,
    USR_plan_name:'',
    USR_lastnoteid:0,
    wallet:[

    ],
    notifications:[],
    USR_ref1:[],
    USR_ref2:[],
    USR_ref3:[],



}


const reducer = (state=initailState,action)=>{
    switch(action.type){

        case UPDATE_Setting:
            return {...state,...action.value};
 

        default:
            return state;
    }
}

export default reducer;
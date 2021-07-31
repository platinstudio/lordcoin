/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * code by platinco.ir
 * @format
 * @flow strict-local
 */



import 'react-native-gesture-handler';
import React from 'react';
import {I18nManager,Text} from 'react-native';


I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

import IndexStart from './app/index';

const App =() =>{

  return (
    <>
   
      <IndexStart />
    </>
  );
  
};
export default App;
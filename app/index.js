/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  StatusBar
} from 'react-native';

import Navigator from './navigation';

import {Provider} from 'react-redux';
import {store,presistore} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'


class IndexStart extends React.Component{
  render(){
    return (
    <>
      <StatusBar barStyle="light-content" />

      <Provider store={store}>
					<PersistGate loading={null} persistor={presistore}>
            <Navigator {...this.props} />
        </PersistGate>
      </Provider>
      
    </>
  );
    }
};


export default IndexStart;


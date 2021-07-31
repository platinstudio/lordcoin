import {createStore,applyMiddleware} from 'redux';
import reducer from './reducer';
import {persistStore,persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import logger from 'redux-logger'


const persistConfig = {
    key:"loard1mxmfza",
    storage:AsyncStorage,
    keyPrefix:'',
   // stateReconciler: hardSet
}

const persistedReducer = persistReducer(persistConfig,reducer);

export const store = createStore(persistedReducer,applyMiddleware(logger));

export const presistore = persistStore(store);

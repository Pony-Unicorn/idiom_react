import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { userReducer } from './user';

const reducers = {
    user: userReducer
};

const rootReducer = combineReducers(reducers);

export default createStore(rootReducer, applyMiddleware(thunk));

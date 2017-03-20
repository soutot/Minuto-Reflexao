import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import CommonReducer from './CommonReducer';
import MessageReducer from './MessageReducer';

export default combineReducers({
	auth: AuthReducer,
	common: CommonReducer,
	message: MessageReducer
});

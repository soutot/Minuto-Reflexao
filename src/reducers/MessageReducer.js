import {
	MESSAGE_TEXT_CHANGED,
	AUTHOR_CHANGED,
	CATEGORY_CHANGED,
	GET_CATEGORY_SUCCESS,
	GET_MESSAGE_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
	userCategory: '',
	messageText: '',
	likes: '',
	author: '',
	category: '',
	categories: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MESSAGE_TEXT_CHANGED:
			return { ...state, messageText: action.payload };
		case AUTHOR_CHANGED:
			return { ...state, author: action.payload };
		case CATEGORY_CHANGED:
			return { ...state, userCategory: action.payload };
		case GET_CATEGORY_SUCCESS:
			return { ...state, categories: action.payload };
			//return action.payload;
		case GET_MESSAGE_SUCCESS:
			return { ...state, messageText: action.payload.messageText, author: action.payload.author, category: action.payload.category };
		default:
			return state;
	}
};

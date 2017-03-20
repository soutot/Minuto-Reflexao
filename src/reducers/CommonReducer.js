import {
	RESET_STATE,
	DISPLAY_ERROR,
	DISPLAY_LOADING,
	DISPLAY_MODAL,
	DISPLAY_SUCCESS_MESSAGE,
	CLEAR_MESSAGES,
} from '../actions/types';

const INITIAL_STATE = {
	success: '',
	error: '',
	displayModal: false,
	displayLoading: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case DISPLAY_SUCCESS_MESSAGE:
			return { ...state, success: action.payload };
		case DISPLAY_ERROR:
			return { ...state, error: action.payload };
		case DISPLAY_LOADING:
			return { ...state, displayLoading: action.payload };
		case RESET_STATE:
			return { ...state, ...INITIAL_STATE };
		case DISPLAY_MODAL:
			return { ...state, displayModal: action.payload };
		case CLEAR_MESSAGES:
			return { ...state, error: '', success: '' };
		default:
			return state;
	}
};

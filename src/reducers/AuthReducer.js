import {
	RESET_STATE_KEEPING_USER,
	RESET_STATE,
	NAME_CHANGED, 
	EMAIL_CHANGED, 
	PASSWORD_CHANGED,
	CONFIRM_PASSWORD_CHANGED,
	LOGIN_USER_FAIL,
	CHANGE_PASSWORD_CHANGED,
	NEW_PASSWORD_CHANGED,
	NEW_PASSWORD_CONFIRM_CHANGED,
	USER_NOTIFICATION_CHANGED,
	USER_CATEGORIES,
	CHECK_CATEGORY,
	LOAD_USER_PREFERENCES
} from '../actions/types';

const INITIAL_STATE = {
	user: null,
	password: '',
	confirmPassword: '',
	newPassword: '',
	confirmNewPassword: '',
	name: '',
	email: '',
	userTimeNotification: new Date(),
	userCategories: [{}],
	checkCategory: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case RESET_STATE_KEEPING_USER:
			return { ...state, ...INITIAL_STATE, user: action.payload };
		case RESET_STATE:
			return { ...state, ...INITIAL_STATE };
		case LOGIN_USER_FAIL:
			return { ...state, password: '' };
		case NAME_CHANGED:
			return { ...state, name: action.payload };
		case EMAIL_CHANGED:
			return { ...state, email: action.payload };
		case PASSWORD_CHANGED:
			return { ...state, password: action.payload };
		case CONFIRM_PASSWORD_CHANGED:
			return { ...state, confirmPassword: action.payload };
		case CHANGE_PASSWORD_CHANGED:
			return { ...state, password: action.payload };
		case NEW_PASSWORD_CHANGED:
			return { ...state, newPassword: action.payload };
		case NEW_PASSWORD_CONFIRM_CHANGED:
			return { ...state, confirmNewPassword: action.payload };
		case USER_NOTIFICATION_CHANGED:
			return { ...state, userTimeNotification: action.payload };
		case USER_CATEGORIES:
			return { ...state, userCategories: action.payload };
		case CHECK_CATEGORY:
			return { ...state, checkCategory: action.payload };
		case LOAD_USER_PREFERENCES:
			return { ...state, userCategories: action.payload.userCategories, userTimeNotification: action.payload.userTimeNotification, };
		default:
			return state;
	}
};

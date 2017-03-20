import { Actions } from 'react-native-router-flux';
import {
  RESET_STATE,
  DISPLAY_MODAL,
  DISPLAY_LOADING,
  CLEAR_MESSAGES,
} from './types';

const resetState = (dispatch) => {
  dispatch({
    type: RESET_STATE,
  });
};

export const navigateAnonymousUser = (scene) => {
  return (dispatch) => {
    resetState(dispatch);

    switch (scene) {
      case 'login':
        Actions.login();
        break;
      case 'signup':
        Actions.signup();
        break;
      default:
        break;
    }
  };
};

export const toggleModal = (displayModal) => {
  return {
    type: DISPLAY_MODAL,
    payload: displayModal,
  };
};

export const clearMessages = () => {
  return {
    type: CLEAR_MESSAGES,
  };
};

export const toggleLoading = (displayLoading) => {
  return {
    type: DISPLAY_LOADING,
    payload: displayLoading,
  };
};

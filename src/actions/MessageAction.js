import firebase from 'firebase';
import {
  MESSAGE_TEXT_CHANGED,
  AUTHOR_CHANGED,
  CATEGORY_CHANGED,
  DISPLAY_LOADING,
  DISPLAY_SUCCESS_MESSAGE,
  DISPLAY_ERROR,
  GET_CATEGORY_SUCCESS,
  GET_MESSAGE_SUCCESS,
} from './types';

let customErrorMessage;

export const messageTextChanged = (text) => {
  return {
    type: MESSAGE_TEXT_CHANGED,
    payload: text,
  };
};

export const authorChanged = (text) => {
  return {
    type: AUTHOR_CHANGED,
    payload: text,
  };
};

export const categoryValueChanged = (text) => {
  return {
    type: CATEGORY_CHANGED,
    payload: text,
  };
};

const createMessageSuccess = (dispatch) => {
  dispatch({
    type: DISPLAY_LOADING,
    payload: false,
  });

  dispatch({
    type: DISPLAY_SUCCESS_MESSAGE,
    payload: 'Mensagem criada com sucesso.',
  });
};

const createMessageFail = (dispatch, error) => {
  switch (error.code) {
    default:
      console.warn(error.code, ': ', error.message);
      customErrorMessage = 'Ocorreu um erro durante o cadastro.';
  }

  dispatch({
    type: DISPLAY_LOADING,
    payload: false,
  });

  dispatch({
    type: DISPLAY_ERROR,
    payload: customErrorMessage,
  });
};


export const createMessage = ({ category, messageText, author }) => {
  const likes = 0;
  const creatorId = firebase.auth().currentUser.uid;

  return (dispatch) => {
    dispatch({
      type: DISPLAY_LOADING,
      payload: true,
    });

    firebase.database().ref('/messages/')
      .push({ category, messageText, author, likes, creatorId })
      .then(createMessageSuccess(dispatch))
      .catch(error => createMessageFail(dispatch, error));
  };
};

export const getCategory = () => {
  return (dispatch) => {
    firebase.database().ref('/categories')
      .on('value', (snapshot) => {
        dispatch({ type: GET_CATEGORY_SUCCESS, payload: snapshot.val() });
      });
  };
};

const getUserCategories = (callback) => {
  const { uid } = firebase.auth().currentUser;
  let userCategories = [];

  firebase.database().ref(`/userPreferences/${uid}/userCategories/`)
    .once('value', (snapshot) => {
      userCategories = snapshot.val();
      callback(userCategories);
    });
};

export const getMessage = () => {
  return (dispatch) => {
    getUserCategories((userCategories) => {
      if (userCategories && (userCategories.length > 1 || userCategories[0])) {
        let randomCategory = Math.floor(Math.random() * userCategories.length);
        randomCategory = randomCategory > 0 ? randomCategory : 1;

        const randomUserCategory = userCategories[randomCategory].category;

        firebase.database().ref('/messages')
          .once('value', (snapshot) => {
            const messageByCategory = Object.values(snapshot.val())
              .filter((obj) => {
                return obj.category === randomUserCategory;
              });

            const randomMessage = Math.floor(Math.random() * messageByCategory.length);
            const randomUserMessage = messageByCategory[randomMessage];

            if (messageByCategory.length > 0) {
              dispatch({ type: GET_MESSAGE_SUCCESS, payload: randomUserMessage });
            }
            dispatch({
              type: DISPLAY_LOADING,
              payload: false,
            });
          });
      } else {
        dispatch({
          type: DISPLAY_LOADING,
          payload: false,
        });
      }
    });
  };
};

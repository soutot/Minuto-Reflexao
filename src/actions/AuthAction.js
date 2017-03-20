import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
  // AUTH
  NAME_CHANGED,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
  CHANGE_PASSWORD_CHANGED,
  NEW_PASSWORD_CHANGED,
  NEW_PASSWORD_CONFIRM_CHANGED,
  USER_NOTIFICATION_CHANGED,
  USER_CATEGORIES,
  CHECK_CATEGORY,
  LOAD_USER_PREFERENCES,

  // COMMON
  RESET_STATE,
  RESET_STATE_KEEPING_USER,
  DISPLAY_MODAL,
  DISPLAY_LOADING,
  DISPLAY_ERROR,
  DISPLAY_SUCCESS_MESSAGE,
} from './types';

let customErrorMessage;

export const nameChanged = (text) => {
  return {
    type: NAME_CHANGED,
    payload: text,
  };
};

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text,
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text,
  };
};

export const confirmPasswordChanged = (text) => {
  return {
    type: CONFIRM_PASSWORD_CHANGED,
    payload: text,
  };
};


export const resetStateKeepingUser = (user) => {
  return {
    type: RESET_STATE_KEEPING_USER,
    payload: user,
  };
};

export const navigateAuthUser = (scene, user) => {
  return () => {
    resetStateKeepingUser(user);

    switch (scene) {
      case 'auth':
        Actions.auth();
        break;
      case 'login':
        Actions.login();
        break;
      case 'signup':
        Actions.signup();
        break;
      case 'main':
        Actions.main();
        break;
      case 'singleMessage':
        Actions.singleMessage();
        break;
      case 'messageCreate':
        Actions.messageCreate();
        break;
      case 'profile':
        Actions.profile();
        break;
      case 'userProfile':
        Actions.userProfile();
        break;
      case 'changePassword':
        Actions.changePassword();
        break;
      case 'preferences':
        Actions.preferences();
        break;
      case 'userMessages':
        Actions.userMessages();
        break;
      default:
        break;
    }
  };
};

export const loadUserPreferences = (dispatch) => {
  const { uid } = firebase.auth().currentUser;

  firebase.database().ref(`userPreferences/${uid}/`)
    .on('value', (snapshot) => {
      const userHours = snapshot.val().userTimeNotification.split(':')[0];
      const userMinutes = snapshot.val().userTimeNotification.split(':')[1];
      const userTimeNotification = new Date();
      userTimeNotification.setHours(userHours);
      userTimeNotification.setMinutes(userMinutes);

      const userCategories = snapshot.val().userCategories;

      const payload = { userCategories, userTimeNotification };

      dispatch({ type: LOAD_USER_PREFERENCES, payload });
    });
};

export const loginUserSuccess = (dispatch, user) => {
  // resetState(dispatch);
  loadUserPreferences(dispatch);
  dispatch({
    type: RESET_STATE_KEEPING_USER,
    payload: user,
  });
  Actions.main();
};

const loginUserFail = (dispatch, error) => {
  switch (error.code) {
    case 'auth/network-request-failed':
      customErrorMessage = 'Falha na autenticação. Verifique sua conexão e tente novamente.';
      break;
    case 'auth/user-not-found':
      customErrorMessage = 'E-mail e/ou senha inválidos';
      break;
    case 'auth/wrong-password':
      customErrorMessage = 'E-mail e/ou senha inválidos';
      break;
    case 'auth/invalid-email':
      customErrorMessage = 'E-mail inválido';
      break;
    default:
      console.warn(error.code, ': ', error.message);
      customErrorMessage = 'Falha na autenticação.';
  }

  dispatch({
    type: DISPLAY_ERROR,
    payload: customErrorMessage,
  });

  dispatch({
    type: DISPLAY_LOADING,
    payload: false,
  });
};


export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    // resetState(dispatch);
    dispatch({
      type: DISPLAY_LOADING,
      payload: true,
    });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user))
      .catch((error) => {
        loginUserFail(dispatch, error);
      });
  };
};

export const loginCachedUser = (user) => {
  return (dispatch) => {
    loginUserSuccess(dispatch, user);
  };
};

// Temporary workaroud for firebase displayName issue
// https://github.com/firebase/FirebaseUI-Android/issues/409
const relogUser = (user, email, password, dispatch) => {
  dispatch({
    type: RESET_STATE_KEEPING_USER,
    payload: user,
  });
  const credential = firebase.auth.EmailAuthProvider.credential(
    email,
    password,
  );

  // let categories = firebase.database().ref('/categories').on('value', snapshot => {
  // categories = snapshot.val();
  // });
  const categories = [''];
  // const now = new Date();

  firebase.database().ref(`userPreferences/${firebase.auth().currentUser.uid}/`)
    .set({ userCategories: categories, userTimeNotification: '00:00' });

  user.reauthenticate(credential)
    .then(Actions.main());
};

const resetState = (dispatch) => {
  dispatch({
    type: RESET_STATE,
  });
};

const loginCreateFail = (dispatch, error) => {
  switch (error.code) {
    case 'auth/invalid-email':
      customErrorMessage = 'E-mail inválido';
      break;
    case 'auth/email-already-in-use':
      customErrorMessage = 'E-mail já cadastrado';
      break;
    default:
      console.warn(error.code, ': ', error.message);
      customErrorMessage = 'Ocorreu um erro durante o cadastro.';
  }
  dispatch({
    type: DISPLAY_ERROR,
    payload: customErrorMessage,
  });
  dispatch({
    type: DISPLAY_LOADING,
    payload: false,
  });
};

export const createUser = ({ name, email, password, confirmPassword }) => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }

  return (dispatch) => {
    if (password === confirmPassword) {
      resetState(dispatch);

      dispatch({
        type: DISPLAY_LOADING,
        payload: true,
      });

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(resetState(dispatch))
        .catch((error) => {
          loginCreateFail(dispatch, error);
        });

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          user.updateProfile({
            displayName: name,
          })
            .then(relogUser(user, email, password, dispatch));
        }
      });
    } else {
      customErrorMessage = 'As senhas não conferem';
      dispatch({
        type: DISPLAY_ERROR,
        payload: customErrorMessage,
      });
      dispatch({
        type: DISPLAY_LOADING,
        payload: false,
      });
    }
  };
};

const resetPasswordSuccess = (dispatch) => {
  dispatch({
    type: RESET_STATE,
  });

  dispatch({
    type: DISPLAY_MODAL,
    payload: false,
  });

  dispatch({
    type: DISPLAY_SUCCESS_MESSAGE,
    payload: 'Envio efetuado com sucesso. Verifique sua caixa de email.',
  });
};

const resetPasswordFail = (dispatch, error) => {
  switch (error.code) {
    case 'auth/invalid-email':
      customErrorMessage = 'Campo e-mail inválido';
      break;
    case 'auth/user-not-found':
      customErrorMessage = 'E-mail não encontrado';
      break;
    default:
      console.warn(error.code, ': ', error.message);
      customErrorMessage = 'Ocorreu um erro no processo de envio.';
      break;
  }

  dispatch({
    type: RESET_STATE,
  });

  dispatch({
    type: DISPLAY_ERROR,
    payload: customErrorMessage,
  });
};

export const resetPassword = ({ email }) => {
  return ((dispatch) => {
    dispatch({ type: RESET_STATE });

    dispatch({
      type: DISPLAY_LOADING,
      payload: true,
    });

    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        resetPasswordSuccess(dispatch);
      })
      .catch((error) => {
        resetPasswordFail(dispatch, error);
      });
  });
};

const deleteUserSuccess = (dispatch) => {
  dispatch({
    type: RESET_STATE,
  });

  Actions.auth();
};

const deleteUserFail = (dispatch, error) => {
  switch (error.code) {
    case 'auth/wrong-password':
      customErrorMessage = 'Senha inválida';
      break;
    default:
      console.warn(error.code, ': ', error.message);
      customErrorMessage = 'Ocorreu um erro no processo de remoção.';
  }
  dispatch({
    type: DISPLAY_ERROR,
    payload: customErrorMessage,
  });
  dispatch({
    type: DISPLAY_LOADING,
    payload: false,
  });
};

export const deleteUser = ({ email }, password) => {
  return (dispatch) => {
    let user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    dispatch({
      type: DISPLAY_LOADING,
      payload: true,
    });

    // user.reauthenticate(credential)
    // .then((user) => {
    // 	user.delete()
    // 	.then(() => {
    // 		deleteUserSuccess(dispatch
    // 	})
    // })
    // .catch((error) => {
    // 	deleteUserFail(dispatch, error);
    // });

    user.delete();
    // 	.then(deleteUserSuccess(dispatch))
    // 	.catch(error => deleteUserFail(dispatch, error));

    deleteUserSuccess(dispatch);
  };
};

const changePasswordSuccess = (dispatch) => {
  dispatch({
    type: DISPLAY_SUCCESS_MESSAGE,
    payload: 'Senha alterada com sucesso.',
  });

  dispatch({
    type: DISPLAY_LOADING,
    payload: false,
  });
};

const changePasswordFail = (dispatch, error) => {
  switch (error.code) {
    case 'auth/weak-password':
      customErrorMessage = 'A senha deve conter no mínimo 6 caracteres.';
      break;
    case 'auth/wrong-password':
      customErrorMessage = 'Senha atual inválida.';
      break;
    case 'customSamePassword':
      customErrorMessage = 'A nova senha deve ser diferente da senha atual.';
      break;
    case 'customNotMatch':
      customErrorMessage = 'As senhas não conferem.';
      break;
    case 'customInvalidInput':
      customErrorMessage = 'Verifique se os campos foram corretamente preenchidos.';
      break;
    default:
      console.warn(error.code, ': ', error.message);
      customErrorMessage = 'Ocorreu um erro no processo de alteração.';
  }
  dispatch({
    type: DISPLAY_ERROR,
    payload: customErrorMessage,
  });
};


export const changePassword = (password, newPassword, confirmNewPassword) => {
  const user = firebase.auth().currentUser;

  return (dispatch) => {
    if (password !== '' && newPassword !== '' && confirmNewPassword !== '') {
      if (password !== newPassword) {
        if (newPassword === confirmNewPassword) {
          firebase.auth().signInWithEmailAndPassword(user.email, password)
            .then(() => {
              user.updatePassword(newPassword)
                .then(changePasswordSuccess(dispatch))
                .catch((error) => {
                  changePasswordFail(dispatch, error);
                });
            })
            .catch((error) => {
              changePasswordFail(dispatch, error);
            });
        } else {
          changePasswordFail(dispatch, { code: 'customNotMatch' });
        }
      } else {
        changePasswordFail(dispatch, { code: 'customSamePassword' });
      }
    } else {
      changePasswordFail(dispatch, { code: 'customInvalidInput' });
    }
  };
};

export const changePasswordChanged = (text) => {
  return {
    type: CHANGE_PASSWORD_CHANGED,
    payload: text,
  };
};

export const newPasswordChanged = (text) => {
  return {
    type: NEW_PASSWORD_CHANGED,
    payload: text,
  };
};

export const newPasswordConfirmChanged = (text) => {
  return {
    type: NEW_PASSWORD_CONFIRM_CHANGED,
    payload: text,
  };
};

export const signOutCurrentUser = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    if (currentUser) {
      firebase.auth().signOut();

      dispatch({
        type: RESET_STATE,
      });

      Actions.auth();
    }
  };
};

export const notificationChanged = (date) => {
  return {
    type: USER_NOTIFICATION_CHANGED,
    payload: date,
  };
};

export const setUserCategory = (categories, checked) => {
  return (dispatch) => {
    dispatch({
      type: CHECK_CATEGORY,
      payload: checked,
    });
    dispatch({
      type: USER_CATEGORIES,
      payload: categories,
    });
  };
};

const updateUserPreferencesSuccess = (dispatch) => {
  dispatch({
    type: DISPLAY_LOADING,
    payload: false,
  });

  dispatch({
    type: DISPLAY_SUCCESS_MESSAGE,
    payload: 'Preferências atualizadas com sucesso.',
  });
};

const updateUserPreferencesFail = (dispatch, error) => {
  switch (error.code) {
    default:
      console.warn(error.code, ': ', error.message);
      customErrorMessage = 'Ocorreu um erro no processo de remoção.';
  }
  dispatch({
    type: DISPLAY_ERROR,
    payload: customErrorMessage,
  });
};

export const updateUserPreferences = (userTimeNotification, userCategories) => {
  const { uid } = firebase.auth().currentUser;
  return (dispatch) => {
    dispatch({
      type: DISPLAY_LOADING,
      payload: true,
    });
    firebase.database().ref(`userPreferences/${uid}/`)
      .set({ userCategories, userTimeNotification })
      .then(updateUserPreferencesSuccess(dispatch))
      .catch(error => updateUserPreferencesFail(dispatch, error));
  };
};

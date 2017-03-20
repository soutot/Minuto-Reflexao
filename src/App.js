import React, { Component } from 'react';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import reducers from './reducers';
import Router from './Router';
// import { firebaseConfig } from './config';

class App extends Component {

  componentWillMount() {
    const config = {
      apiKey: 'AIzaSyBvu8BXABqgU8zTcnURee0uvFa_FM0smhk',
      authDomain: 'minutoreflexao-4f154.firebaseapp.com',
      databaseURL: 'https://minutoreflexao-4f154.firebaseio.com',
      storageBucket: 'minutoreflexao-4f154.appspot.com',
      messagingSenderId: '232032167249',
    };
    firebase.initializeApp(config);
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;

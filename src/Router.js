import React from 'react';
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import SingleMessage from './components/main/SingleMessage';
import MessageCreateForm from './components/main/MessageCreateForm';
import ChangePasswordForm from './components/main/ChangePasswordForm';
import Preferences from './components/main/Preferences';
import UserMessages from './components/main/UserMessages';
import UserProfile from './components/main/UserProfile';

const mainRightLink = () => { Actions.profile(); };
const mainRightTitle = 'Perfil';

const profileRightLink = () => { Actions.message(); };
const profileRightTitle = 'X';

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 65 }}>
      <Scene key="auth">
        <Scene
          hideNavBar
          key="login"
          component={LoginForm}
          sceneStyle={{ paddingTop: 0 }}
          initial
        />
        <Scene
          hideNavBar={false}
          key="signup"
          component={SignUpForm}
          title=""
        />
      </Scene>

      <Scene key="main" animation="fade" >
        <Scene key="message" type={ActionConst.REPLACE}>
          <Scene
            key="singleMessage"
            component={SingleMessage}
            onRight={mainRightLink}
            rightTitle={mainRightTitle}
            initial
          />
          <Scene
            key="messageCreate"
            component={MessageCreateForm}
            onRight={mainRightLink}
            rightTitle={mainRightTitle}
          />
        </Scene>

        <Scene
          key="profile"
          direction="leftToRight"
        >
          <Scene
            key="userProfile"
            component={UserProfile}
            onRight={profileRightLink}
            rightTitle={profileRightTitle}
          />
          <Scene
            key="changePassword"
            component={ChangePasswordForm}
          />
          <Scene
            key="preferences"
            component={Preferences}
          />
          <Scene
            key="userMessages"
            component={UserMessages}
          />
        </Scene>
      </Scene>
    </Router>
  );
};

export default RouterComponent;

import React, { Component } from 'react';
import { View, Text, ScrollView, Modal, Image, Dimensions, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
  // ***** INPUT ***** 
  //label: [string] label text for the input
  //type: [string] input type
  //placeholder: [string] input placeholder
  //value: [string] input default value
  //secureTextEntry: [bool] mask input text value, used for password. Default: false
  //autoCorret: [bool] enable device auto correct on input text value. Default: true
  //onChangeText: [function] event handler on change text
  //maxlength: [number] sets input max length. Default: 100
  //multilne: [bool] allow multiline input text. Default: false
  Input,

  // ***** CARD *****
  //children: [jsx] anything between <Card></Card> component
  Card,

  // ***** CARDSECTION *****
  //children: [jsx] anything between <CardSection></CardSection> component
  //customStyle: [string] custom style to overwrite default component style
  CardSection,

  // ***** BUTTON ****
  //children: [jsx] anything between <Button></Button> component
  //onPress: [function] on button press event handler
  Button,

  // ***** SPINNER *****
  //size: [string] size which spinner will be rendered. Default: 'large'
  Spinner,

  // ***** TEXTBUTTON *****
  //children: [jsx] anything between <ErrorMessage></ErrorMessage> component
  TextButton
} from '../common';
import {
  emailChanged,
  passwordChanged,
  loginUser,
  navigateAnonymousUser,
  resetStateKeepingUser,
  resetPassword,
  signOutCurrentUser,
  clearMessages,
  navigateAuthUser,
  loginCachedUser
} from '../../actions';

const { width, height } = Dimensions.get('window');

class LoginForm extends Component {
  componentWillMount() {
    //this.props.signOutCurrentUser(this.props.user);

    this.checkLoggedUser();
  }

  componentWillUnmount() {
    this.props.resetStateKeepingUser(this.props.user);
  }

  checkLoggedUser() {
    const context = this;
    firebase.auth().onAuthStateChanged((user) => {
      console.log('user: ', user);
      if (user) {
        context.props.loginCachedUser(user);
        //context.props.navigateAuthUser('main', user);
      }
    });
  }

  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onLoginButtonPress() {
    const { email, password } = this.props;
    this.props.loginUser({ email, password });
  }

  onSignUpButtonPress() {
    this.props.navigateAnonymousUser('signup');
  }

  onConfirmButtonPress() {
    this.props.clearMessages();
  }

  onResetPasswordClick() {
    const { email } = this.props;
    this.props.resetPassword({ email });
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  renderButton() {
    if (this.props.displayLoading) {
      return (
        <CardSection style={{ borderBottomWidth: 0 }}>
          <Spinner size='small' />
        </CardSection>
      );
    }

    return (
      <CardSection style={{ borderBottomWidth: 0 }}>
        <Button onPress={this.onLoginButtonPress.bind(this)}>
          Entrar
				</Button>
        <Button onPress={this.onSignUpButtonPress.bind(this)}>
          Cadastrar
				</Button>
      </CardSection>
    );
  }

  render() {
    this.state = {
      size: { width, height },
    };
    return (
      <ScrollView keyboardDismissMode='none' keyboardShouldPersistTaps='always' onLayout={this._onLayoutDidChange} contentContainerStyle={{ flex: 1 }}>
        <Image style={[this.state.size]} source={require('../../images/woman-walking-sunset-beach.png')}>
          <Card
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderWidth: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              marginTop: 0
            }}
          >
            <CardSection style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image style={{ marginTop: 20 }} source={require('../../images/minuto-reflexao.png')} />
              <Text
                style={{
                  fontSize: 18,
                  color: '#007acc'
                }}
              >
                Minuto de Reflexão
							</Text>
            </CardSection>
            <View>
              <CardSection>
                <Input
                  label="E-mail"
                  placeholder="usuario@email.com"
                  autoCorret={false}
                  value={this.props.email}
                  onChangeText={this.onEmailChange.bind(this)}
                />
              </CardSection>

              <CardSection>
                <Input
                  label="Senha"
                  placeholder="senha"
                  autoCorret={false}
                  secureTextEntry
                  value={this.props.password}
                  onChangeText={this.onPasswordChange.bind(this)}
                />
              </CardSection>

              <CardSection>
                <TextButton
                  onPress={this.onResetPasswordClick.bind(this)}
                  style={{ textAlign: 'right', fontSize: 18 }}
                >
                  Redefinir senha
								</TextButton>
              </CardSection>
            </View>

            <Modal
              visible={this.props.error || this.props.success ? true : false}
              transparent
              animationType="slide"
              onRequestClose={() => { }} //obrigatório para Android
            >
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  position: 'relative',
                  flex: 1,
                  justifyContent: 'center'
                }}
              >
                <CardSection style={{ justifyContent: 'center', backgroundColor: '#FFF' }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 18,
                      textAlign: 'center',
                      lineHeight: 40
                    }}
                  >
                    {this.props.error}
                    {this.props.success}
                  </Text>
                </CardSection>

                <CardSection style={{ backgroundColor: '#FFF' }}>
                  <Button onPress={this.onConfirmButtonPress.bind(this)}>OK</Button>
                </CardSection>
              </View>
            </Modal>

            <View style={{ paddingBottom: 70 }}>
              {this.renderButton()}
            </View>
          </Card>
        </Image>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ auth, common }) => {
  const { email, password } = auth;
  const { error, success, displayLoading } = common;

  return { email, password, error, success, displayLoading };
};

export default connect(mapStateToProps,
  {
    emailChanged,
    passwordChanged,
    loginUser,
    navigateAnonymousUser,
    resetStateKeepingUser,
    resetPassword,
    signOutCurrentUser,
    clearMessages,
    navigateAuthUser,
    loginCachedUser
  }
)(LoginForm);

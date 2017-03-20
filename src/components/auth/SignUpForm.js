import React, { Component } from 'react';
import { View, Text, ScrollView, Modal, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import {
  // ***** INPUT *****
  // label: [string] label text for the input
  // type: [string] input type
  // placeholder: [string] input placeholder
  // value: [string] input default value
  // secureTextEntry: [bool] mask input text value, used for password. Default: false
  // autoCorret: [bool] enable device auto correct on input text value. Default: true
  // onChangeText: [function] event handler on change text
  // maxlength: [number] sets input max length. Default: 100
  // multilne: [bool] allow multiline input text. Default: false
  Input,

  // ***** CARD *****
  // children: [jsx] anything between <Card></Card> component
  Card,

  // ***** CARDSECTION *****
  // children: [jsx] anything between <CardSection></CardSection> component
  // customStyle: [string] custom style to overwrite default component style
  CardSection,

  // ***** BUTTON *****
  // children: [jsx] anything between <Button></Button> component
  // onPress: [function] on button press event handler
  Button,

  // ***** SPINNER *****
  // size: [string] size which spinner will be rendered. Default: 'large'
  Spinner,
} from '../common';

import {
  nameChanged,
  emailChanged,
  passwordChanged,
  confirmPasswordChanged,
  createUser,
  resetStateKeepingUser,
  clearMessages,
} from '../../actions';

const { width, height } = Dimensions.get('window');

class SignUpForm extends Component {

  componentWillUnmount() {
    this.props.resetStateKeepingUser(this.props.user);
  }

  onNameChange(text) {
    this.props.nameChanged(text);
  }

  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onConfirmPasswordChange(text) {
    this.props.confirmPasswordChanged(text);
  }

  onButtonSavePress() {
    const { name, email, password, confirmPassword } = this.props;
    this.props.createUser({ name, email, password, confirmPassword });
  }

  onConfirmButtonPress() {
    this.props.clearMessages();
  }

  _onLayoutDidChange(e) {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  renderButton() {
    if (this.props.displayLoading) {
      return <Spinner size="small" />;
    }

    return (
      <Button onPress={this.onButtonSavePress.bind(this)}>
        Cadastrar
			</Button>
    );
  }

  render() {
    this.state = {
      size: { width, height },
    };
    return (
      <ScrollView keyboardDismissMode='none' keyboardShouldPersistTaps='always' onLayout={this._onLayoutDidChange} contentContainerStyle={{ flex: 1 }}>
        <Image style={[this.state.size]} source={require('../../images/woman-sit-water-body.png')}>
          <Card
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderWidth: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View>
              <CardSection>
                <Input
                  label='Nome'
                  placeholder='Nome'
                  value={this.props.name}
                  onChangeText={this.onNameChange.bind(this)}
                />
              </CardSection>
              <CardSection>
                <Input
                  label='Email'
                  placeholder='usuario@email.com'
                  value={this.props.email}
                  onChangeText={this.onEmailChange.bind(this)}
                />
              </CardSection>
              <CardSection>
                <Input
                  label='Senha'
                  placeholder='Senha'
                  value={this.props.password}
                  onChangeText={this.onPasswordChange.bind(this)}
                  secureTextEntry
                />
              </CardSection>
              <CardSection>
                <Input
                  label='Confirmar Senha'
                  placeholder='Confirmar Senha'
                  value={this.props.confirmPassword}
                  onChangeText={this.onConfirmPasswordChange.bind(this)}
                  secureTextEntry
                />
              </CardSection>
            </View>

            <Modal
              visible={this.props.error ? true : false}
              transparent
              animationType="slide"
              onRequestClose={() => { }} // needed for Android
            >
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  position: 'relative',
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <CardSection style={{ justifyContent: 'center', backgroundColor: '#FFF' }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 18,
                      textAlign: 'center',
                      lineHeight: 40,
                    }}
                  >
                    {this.props.error}
                  </Text>
                </CardSection>

                <CardSection style={{ backgroundColor: '#FFF' }}>
                  <Button onPress={this.onConfirmButtonPress.bind(this)}>OK</Button>
                </CardSection>
              </View>
            </Modal>

            <View style={{ paddingBottom: 135 }}>
              <CardSection style={{ borderBottomWidth: 0 }}>
                {this.renderButton()}
              </CardSection>
            </View>
          </Card>
        </Image>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ auth, common }) => {
  const { name, email, password, confirmPassword } = auth;
  const { error, displayLoading } = common;

  return { name, email, password, confirmPassword, error, displayLoading };
};

export default connect(mapStateToProps,
  {
    nameChanged,
    emailChanged,
    passwordChanged,
    confirmPasswordChanged,
    createUser,
    resetStateKeepingUser,
    clearMessages,
  },
)(SignUpForm);

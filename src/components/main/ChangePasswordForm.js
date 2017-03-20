import React, { Component } from 'react';
import { View, Text, Modal, ScrollView } from 'react-native';
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

  // ***** BUTTON ****
  // children: [jsx] anything between <Button></Button> component
  // onPress: [function] on button press event handler
  Button,

  // ***** SPINNER *****
  // size: [string] size which spinner will be rendered. Default: 'large'
  Spinner,
} from '../common';
import {
  changePassword,
  changePasswordChanged,
  newPasswordChanged,
  newPasswordConfirmChanged,
  toggleModal,
} from '../../actions';

class ChangePasswordForm extends Component {
  onPasswordChange(text) {
    this.props.changePasswordChanged(text);
  }

  onNewPasswordChange(text) {
    this.props.newPasswordChanged(text);
  }

  onNewPasswordConfirmChange(text) {
    this.props.newPasswordConfirmChanged(text);
  }

  onSaveButtonPress() {
    const { password, newPassword, confirmNewPassword } = this.props;
    this.props.changePassword(password, newPassword, confirmNewPassword);
  }

  onConfirmButtonPress() {
    this.props.toggleModal(false);
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
        <Button onPress={this.onSaveButtonPress.bind(this)}>
          Salvar
				</Button>
      </CardSection>
    );
  }

  render() {
    return (
      <ScrollView keyboardDismissMode='none' keyboardShouldPersistTaps='always' contentContainerStyle={{ flex: 1 }}>
        <Card style={{ flex: 1, flexDirection: 'column', backgroundColor: '#FFF', justifyContent: 'space-between', borderWidth: 0 }}>
          <View>
            <CardSection>
              <Input
                label='Senha Antiga'
                placeholder='Senha Antiga'
                secureTextEntry
                value={this.props.password}
                onChangeText={this.onPasswordChange.bind(this)}
              />
            </CardSection>
            <CardSection>
              <Input
                label='Nova Senha'
                placeholder='Nova Senha'
                secureTextEntry
                value={this.props.newPassword}
                onChangeText={this.onNewPasswordChange.bind(this)}
              />
            </CardSection>
            <CardSection>
              <Input
                label='Confirmar Nova Senha'
                placeholder='Confirmar Nova Senha'
                secureTextEntry
                value={this.props.newPasswordConfirm}
                onChangeText={this.onNewPasswordConfirmChange.bind(this)}
              />
            </CardSection>
          </View>

          <Modal
            visible={false}
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
              <CardSection style={{ justifyContent: 'center' }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 18,
                    textAlign: 'center',
                    lineHeight: 40,
                  }}
                >
                  {this.props.success ? this.props.success : this.props.error}
                </Text>
              </CardSection>

              <CardSection>
                <Button onPress={this.onConfirmButtonPress.bind(this)}>OK</Button>
              </CardSection>
            </View>
          </Modal>

          <View style={{ paddingBottom: 70 }}>
            {this.renderButton()}
          </View>
        </Card>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ auth, common }) => {
  const { password, newPassword, confirmNewPassword } = auth;
  const { error, success, displayLoading } = common;

  return { password, newPassword, confirmNewPassword, error, success, displayLoading };
};

export default connect(mapStateToProps,
  {
    changePassword,
    changePasswordChanged,
    newPasswordChanged,
    newPasswordConfirmChanged,
    toggleModal,
  },
)(ChangePasswordForm);

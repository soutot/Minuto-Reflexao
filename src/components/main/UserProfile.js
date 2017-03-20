import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import {
  // ***** CARD *****
  // children: [jsx] anything between <Card></Card> component
  Card,

  // ***** CARDSECTION *****
  // children: [jsx] anything between <CardSection></CardSection> component
  // customStyle: [string] custom style to overwrite default component style
  CardSection,

  // ***** TEXTBUTTON *****
  // children: [jsx] anything between <ErrorMessage></ErrorMessage> component
  // onPress: [function] on button press event handler
  TextButton,

  // ***** BUTTON ****
  // children: [jsx] anything between <Button></Button> component
  // onPress: [function] on button press event handler
  Button,

  // ***** CONFIRM *****
  Confirm,
  Input,
} from '../common';
import { navigateAuthUser, toggleModal, deleteUser, signOutCurrentUser, passwordChanged } from '../../actions';

class UserProfile extends Component {
  onChangePasswordButtonPress() {
    this.props.navigateAuthUser('changePassword', this.props.user);
  }

  onPreferencesButtonPress() {
    this.props.navigateAuthUser('preferences', this.props.user);
  }

  onDeleteAccountButtonPress() {
    this.props.toggleModal(true);
  }

  onDeleteAccept() {
    const email = this.props.user;
    const password = this.props.password;

    this.props.deleteUser(email, password);
  }

  onDeleteDecline() {
    this.props.toggleModal(false);
  }

  onLogOutButtonPress() {
    this.props.signOutCurrentUser();
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  render() {
    return (
      <Card style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        <View>
          <CardSection>
            <TextButton onPress={this.onChangePasswordButtonPress.bind(this)}>
              Alterar Senha
            </TextButton>
          </CardSection>

          <CardSection>
            <TextButton onPress={this.onPreferencesButtonPress.bind(this)}>
              Prefências
            </TextButton>
          </CardSection>

          <CardSection>
            <TextButton style={{ color: 'red' }} onPress={this.onDeleteAccountButtonPress.bind(this)}>
              Excluir conta
            </TextButton>
          </CardSection>

          <Confirm
            visible={this.props.displayModal}
            onAccept={this.onDeleteAccept.bind(this)}
            onDecline={this.onDeleteDecline.bind(this)}
            displayLoading={this.props.displayLoading}
            error={this.props.error}
          >
            <View style={{ flex: 1, width: 340, height: 80 }}>
              <Input
                label="Informe sua Senha"
                placeholder="senha"
                autoCorret={false}
                secureTextEntry
                value={this.props.password}
                onChangeText={this.onPasswordChange.bind(this)}
              />
            </View>
            <View style={{ flex: 1, width: 300, height: 80 }}>
              <Text style={{ fontSize: 18, textAlign: 'center' }}>
                Tem certeza que deseja deletar sua conta?
              </Text>
              <Text style={{ fontSize: 18, textAlign: 'center' }}>
                Esta ação não poderá ser desfeita.
              </Text>
            </View>
          </Confirm>
        </View>

        <View style={{ paddingBottom: 70 }}>
          <CardSection style={{ borderBottomWidth: 0 }}>
            <Button onPress={this.onLogOutButtonPress.bind(this)}>
              Sair
            </Button>
          </CardSection>
        </View>
      </Card>
    );
  }
}

const mapStateToProps = ({ auth, common }) => {
  const { displayModal, error, displayLoading } = common;
  const { user, name, password } = auth;

  return { displayModal, error, displayLoading, user, name, password };
};

export default connect(mapStateToProps,
  {
    navigateAuthUser,
    toggleModal,
    deleteUser,
    signOutCurrentUser,
    passwordChanged,
  },
)(UserProfile);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Picker } from 'react-native';
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

  // ***** BUTTON *****
  //children: [jsx] anything between <Button></Button> component
  //onPress: [function] on button press event handler
  Button,

  // ***** SPINNER *****
  //size: [string] size which spinner will be rendered. Default: 'large'
  Spinner,

  // ***** SUCCESSMESSAGE *****
  //children: [jsx] anything between <SuccessMessage></SuccessMessage> component
  SuccessMessage,

  // ***** ERRORMESSAGE *****
  // children: [jsx] anything between <ErrorMessage></ErrorMessage> component
  ErrorMessage,
} from '../common';
import {
  messageTextChanged,
  authorChanged,
  categoryValueChanged,
  createMessage,
} from '../../actions';

class MessageCreateForm extends Component {
  onCategoryValueChange(value) {
    this.props.categoryValueChanged(value);
  }
  onMessageTextChange(text) {
    this.props.messageTextChanged(text);
  }

  onAuthorChange(text) {
    this.props.authorChanged(text);
  }

  onSaveButtonPress() {
    const { category, messageText, author } = this.props;
    this.props.createMessage({ category: category || 'Filosofia', messageText, author });
  }

  displaySuccess() {
    if (this.props.success) {
      return (
        <SuccessMessage>
          {this.props.success}
        </SuccessMessage>
      );
    }
  }

  displayError() {
    if (this.props.error) {
      return (
        <ErrorMessage>
          {this.props.error}
        </ErrorMessage>
      );
    }
    return;
  }

  renderButton() {
    if (this.props.displayLoading) {
      return (
        <CardSection>
          <Spinner size='small' />
        </CardSection>
      );
    }
    return (
      <CardSection>
        <Button onPress={this.onSaveButtonPress.bind(this)}>
          Salvar
				</Button>
      </CardSection>
    );
  }

  render() {
    return (
      <Card>
        <CardSection style={{ flexDirection: 'column' }}>
          <Text style={styles.pickerTextStyle}>Categoria</Text>
          <Picker
            selectedValue={this.props.category}
            onValueChange={this.onCategoryValueChange.bind(this)}
          >
            <Picker.Item label="Filosofia" value="Filosofia" />
            <Picker.Item label="Budista" value="Budista" />
            <Picker.Item label="Cristã" value="Cristã" />
            <Picker.Item label="Poesia" value="Poesia" />
            <Picker.Item label="Espírita" value="Espírita" />
            <Picker.Item label="Evangélica" value="Evangélica" />
          </Picker>
        </CardSection>
        <CardSection style={{ height: 110 }} >
          <Input
            label='Mensagem'
            placeholder='Mensagem'
            autoCorret
            onChangeText={this.onMessageTextChange.bind(this)}
            value={this.props.messageText}
            multiline
            numberOfLines={10}
            customInputStyle={{ height: 100 }}
          />
        </CardSection>
        <CardSection>
          <Input
            label='Autor'
            placeholder='Autor'
            autoCorret
            onChangeText={this.onAuthorChange.bind(this)}
            value={this.props.author}
          />
        </CardSection>

        {this.displaySuccess()}

        {this.displayError()}

        {this.renderButton()}

      </Card>
    );
  }
}

const styles = {
  pickerTextStyle: {
    fontSize: 18,
    paddingLeft: 20,
  },
};

const mapStateToProps = ({ message, common }) => {
  const { messageText, author, category } = message;
  const { error, success, displayLoading } = common;

  return { messageText, author, category, error, success, displayLoading };
};

export default connect(mapStateToProps,
  {
    messageTextChanged,
    authorChanged,
    categoryValueChanged,
    createMessage,
  },
)(MessageCreateForm);

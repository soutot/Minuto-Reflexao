import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  ListView,
  DatePickerIOS,
  TimePickerAndroid,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  ScrollView
} from 'react-native';
import {
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
} from '../common';
import { getCategory, notificationChanged, updateUserPreferences, toggleModal } from '../../actions';
import ListItem from './ListItem';

class Preferences extends Component {
  componentWillMount() {
    this.props.getCategory();
    this.createDataSource(this.props);
    console.log(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps);
  }

  onDateChange(date) {
    this.props.notificationChanged(date);
  }

  onSaveButtonPress() {
    const { userTimeNotification, userCategories } = this.props;
    const timespan = userTimeNotification.getHours() + ':' + userTimeNotification.getMinutes();

    this.props.updateUserPreferences(timespan, userCategories);
  }

  onConfirmButtonPress() {
    this.props.toggleModal(false);
  }

  createDataSource({ categories }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(categories);
  }

  showAndroidPicker = async (stateKey, options) => {
    const { action, minute, hour } = await TimePickerAndroid.open(options);
    if (action === TimePickerAndroid.timeSetAction) {
      const date = new Date();
      date.setHours(hour);
      date.setMinutes(minute);
      this.onDateChange(date);
    } //else if (action === TimePickerAndroid.dismissedAction) {}
  }

  formatTime(value) {
    return (value < 10 ? '0' + value : value);
  }

  renderDatePicker() {
    if (Platform.OS === 'ios') {
      return (
        <DatePickerIOS
          mode='time'
          minuteInterval={1}
          date={this.props.userTimeNotification}
          onDateChange={this.onDateChange.bind(this)}
        />
      );
    }

    const hour = this.props.userTimeNotification.getHours();
    const minute = this.props.userTimeNotification.getMinutes();
    const time = this.formatTime(hour) + ':' + this.formatTime(minute);

    return (
      <TouchableWithoutFeedback
        onPress={
          this.showAndroidPicker.bind(this, 'preset', { hour, minute }
          )}
      >
        <View>
          <Text style={{ fontSize: 18, color: '#aaa' }}>
            {time}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderRow(category) {
    return <ListItem category={category} />;
  }

  renderList() {
    const styles = {
      listStyle: {
        height: Platform.OS === 'ios' ? 190 : 205
      }
    }
    return (
      <ScrollView style={styles.listStyle}>
        <CardSection>
          <Text style={{ fontSize: 18, color: '#007acc' }}>
            Categorias
					</Text>
          <ListView
            enableEmptySections
            dataSource={this.dataSource}
            renderRow={this.renderRow}
          />
        </CardSection>
      </ScrollView>
    );
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
      <Card
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderWidth: 0
        }}
      >
        <View>
          <CardSection style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 18, color: '#007acc' }}>
              Horário de notificação
						</Text>
            {this.renderDatePicker()}
          </CardSection>

          {this.renderList()}
        </View>

        <Modal
          visible={false}
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
                {this.props.success ? this.props.success : this.props.error}
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
    );
  }
}

const mapStateToProps = ({ auth, message, common }) => {
  const { categories } = message;
  //const  = message;
  const { userTimeNotification, userCategories } = auth;
  const { error, success, displayLoading } = common;

  return {
    categories,
    userTimeNotification,
    userCategories,
    error,
    success,
    displayLoading,
  };
};

export default connect(mapStateToProps,
  {
    getCategory,
    notificationChanged,
    updateUserPreferences,
    toggleModal
  }
)(Preferences);

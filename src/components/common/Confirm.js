import React from 'react';
import { Text, View, Modal } from 'react-native';
import { CardSection } from './CardSection';
import { Button } from './Button';
import { Spinner } from './Spinner';

const Confirm = ({ children, visible, onAccept, onDecline, displayLoading, error }) => {
  const { cardSectionStyle, textStyle, containerStyle, errorStyle } = styles;
  const renderButton = () => {
    if (displayLoading) {
      return (
        <CardSection>
          <Spinner size='small' />
        </CardSection>
      );
    }
    return (
      <CardSection style={cardSectionStyle}>
        <Button onPress={onAccept}>Sim</Button>
        <Button onPress={onDecline}>Não</Button>
      </CardSection>
    );
  };

  const displayError = () => {
    if (error) {
      return (
        <CardSection style={cardSectionStyle}>
          <Text style={errorStyle}>{error}</Text>
        </CardSection>
      );
    }
    return;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => { }} // needed for Android
    >
      <View style={containerStyle}>
        <CardSection style={cardSectionStyle}>
          <Text style={textStyle}>
            {children}
          </Text>
        </CardSection>
        {displayError()}
        {renderButton()}
      </View>
    </Modal>
  );
};

const styles = {
  cardSectionStyle: {
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40,
  },
  errorStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40,
    color: 'red',
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    //backgroundColor: '#FFF',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },

};

export { Confirm };

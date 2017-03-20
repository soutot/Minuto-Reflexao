import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Input = ({
	label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCorrect,
  multiline,
  numberOfLines,
  customContainerStyle,
  customInputStyle,
}) => {
  const { labelStyle, inputStyle, containerStyle } = styles;

  return (
    <View style={[containerStyle, customContainerStyle]}>
      <Text style={labelStyle}>
        {label}
      </Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor='#aaa'
        autoCorrect={autoCorrect}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[inputStyle, customInputStyle]}
        underlineColorAndroid='transparent'
      />
    </View>
  );
};

const styles = {
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1,
    color: '#007acc',
  },
  inputStyle: {
    color: '#aaa',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2,
  },
  containerStyle: {
    // height: 400,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export { Input };

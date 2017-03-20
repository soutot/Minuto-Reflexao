import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const TextButton = ({ onPress, children, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <Text style={[styles.textStyles, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyles: {
    // justifyContent: 'center',
    fontSize: 18,
    // paddingBottom: 10,
    color: '#007aff',
  },
};

export { TextButton };

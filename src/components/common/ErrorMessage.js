import React from 'react';
import { View, Text } from 'react-native';

const ErrorMessage = ({ children }) => {
  return (
    <View>
      <Text style={styles.errorTextStyle}>
        {children}
      </Text>
    </View>
  );
};

const styles = {
  errorTextStyle: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
};

export { ErrorMessage };

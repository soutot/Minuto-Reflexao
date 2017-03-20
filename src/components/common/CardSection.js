import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  return (
    <View style={[style.containerStyle, props.style]}>
      {props.children}
    </View>
  );
};

const style = {
  containerStyle: {
    borderBottomWidth: 1,
    padding: 10,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
};

export { CardSection };

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

let Buffer = [];

const MainFunctionButtons = (props) => {
  const handleCommandHeadline = (value) => {
    if (value !== Buffer[0]) {
      Buffer.unshift(value);
    }
    return Buffer.map((line) => `\n${line}`);
  };
  return (
    <View style={styles.main}>
      <Text style={styles.text}>{handleCommandHeadline(props.command)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: -99,
  },
  text: {
    letterSpacing: 16,
    lineHeight: 20,
    color: 'darkgrey',
  },
});

export default MainFunctionButtons;

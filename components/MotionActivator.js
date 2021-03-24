import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import SmartButton from './subcomponents/SmartButton';

const MotionActivator = (props) => {
  const handlePressed = (value) => {
    props.isActive(value);
  };
  return (
    <View style={styles.main}>
      <SmartButton name="gyro" pressed={(v) => handlePressed(v)} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
});

export default MotionActivator;

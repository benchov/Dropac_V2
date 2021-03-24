import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import SmartButton from './subcomponents/SmartButton';

const AltitudeSelector = (props) => {
  const handlePressAltitude = (value, direction) => {
    if (!value) {
      props.pressedAltitude(0);
    } else {
      if (direction === 'up') {
        props.pressedAltitude(50);
      }
      if (direction === 'down') {
        props.pressedAltitude(-50);
      }
    }
  };
  return (
    <View style={styles.main}>
      <SmartButton name="up" pressed={(v, d) => handlePressAltitude(v, d)} />
      <SmartButton name="down" pressed={(v, d) => handlePressAltitude(v, d)} />
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

export default AltitudeSelector;

import React from 'react';
import {StyleSheet, View, Button} from 'react-native';

const MainFunctionButtons = (props) => {
  const handlePress = (value) => {
    props.pressedCommand(value);
  };
  return (
    <View style={styles.main}>
      <Button title="takeoff" onPress={() => handlePress('takeoff')} />
      <Button title="land" onPress={() => handlePress('land')} />
      <Button title="stop" onPress={() => handlePress('rc 0 0 0 0')} />
      <Button title="connect" onPress={() => handlePress('connect')} />
      <Button
        title="emergency"
        color="#DD1C1A"
        onPress={() => handlePress('emergency')}
      />
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

export default MainFunctionButtons;

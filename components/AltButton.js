import * as React from 'react';
import {StyleSheet, View, Pressable, Text} from 'react-native';

const AltButton = (props) => {
  return (
    <View>
      <Pressable onPressIn={() => props.pressed(props.name)} onPressOut={() => props.pressed(false)}>
          <View style={{backgroundColor: 'blue', padding: 40}}><Text>{props.name}</Text></View>
      </Pressable>
    </View>
  );
};

export default AltButton;

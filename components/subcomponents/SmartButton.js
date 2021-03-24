import * as React from 'react';
import {View, Pressable, Text} from 'react-native';

const SmartButton = (props) => {
  return (
    <View>
      <Pressable onPressIn={() => props.pressed(true, props.name)} onPressOut={() => props.pressed(false)}>
          <View style={{backgroundColor: 'blue', padding: 40}}><Text>{props.name}</Text></View>
      </Pressable>
    </View>
  );
};

export default SmartButton;

import * as React from 'react';
import {StyleSheet, View, Pressable, Text} from 'react-native';

const AltButton = (props) => {
  return (
    <View>
      <Pressable onPressIn={() => console.log('hit in')} onPressOut={() => console.log('hit out')}>
          <View style={{backgroundColor: 'blue', padding: 40}}><Text>{props.name}</Text></View>
      </Pressable>
    </View>
  );
};

export default AltButton;

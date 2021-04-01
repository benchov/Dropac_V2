import * as React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';

const DButton= (props) => {
    const handlePress = (status)  => {
        if (status === 'in') {
            props.pressed(true)
        }
        if (status === 'out') {
            props.pressed(false)
        }
    }

    return (
        <View style={styles.container}> 
            <TouchableWithoutFeedback onPressIn={() => handlePress('in')} onPressOut={() => handlePress('out')}>
                <View style={styles.button}>
                    <Text>GYRO</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default DButton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10
      },
      button: {
        alignItems: "center",
        backgroundColor: "#B33F62",
        padding: 100,
        borderRadius: 80,
      },
})
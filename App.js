import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import dgram from 'react-native-udp';
import _ from 'lodash';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import { stateParser, filterAndRound } from './util';

const App = () => {
  const [command, setCommand] = React.useState('command');
  const [stateStream, handleStateStream] = useState(false);
  const [droneState, setDroneState] = useState('');
  const [sensorState, setSensorState] = useState({x: 0, y:0,z:0 });

  const STATE_PORT = 8890;
  const DRONE_PORT = 8889;
  const HOST = '192.168.10.1';

  // GET DRONE STATE
  useEffect(() => {
    const state = dgram.createSocket('udp4');

    state.bind(STATE_PORT, '0.0.0.0');

    state.on(
      'message',
      _.throttle((message) => {
        console.log(`🚁  ${message}`);
        setDroneState(stateParser(message));
      }, 15000),
    );
  }, []);

  // SEND COMMAND
  useEffect(() => {
    const socket = dgram.createSocket('udp4');

    socket.bind(DRONE_PORT);
    socket.once('listening', function () {
      socket.send(
        command,
        undefined,
        undefined,
        DRONE_PORT,
        HOST,
        function (err) {
          if (err) {
            throw err;
          }
          console.log('Message sent!', command);
        },
      );
    });
  }, [command]);

  useEffect(() => {
    setCommand(`rc 
        ${filterAndRound(-sensorState.x)} 
        ${filterAndRound(sensorState.y)}   
        ${0} 
        ${0}
    `);
    // console.log('command in app: ', command)
}, [sensorState])

  // HANDLE SENSOR DATA
  setUpdateIntervalForType(SensorTypes.accelerometer, 1600);
  const subscription = accelerometer.subscribe((data) =>{
    setSensorState(data);
  }
  );

  return (
    <>
      <StatusBar barStyle="dark-content" hidden={true} />
      <View style={styles.main}>
        {/* <Text>{droneState}</Text> */}
        <Button title="takeoff" onPress={() => setCommand('takeoff')} />
        <Button title="land" onPress={() => setCommand('land')} />
        <Button title="state" onPress={() => handleStateStream(!stateStream)} />
        <Button title="sensor off" onPress={()=> subscription.unsubscribe()} />
        <Button title="connect" onPress={() => setCommand('connect')} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 150,
    marginBottom: 150,
  },
});

export default App;

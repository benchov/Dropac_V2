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
import DButton from './components/DButton'

const STATE_PORT = 8890;
const DRONE_PORT = 8889;
const HOST = '192.168.10.1';



const App = () => {
  const [command, setCommand] = React.useState('command');
  const [stateStream, handleStateStream] = useState(false);
  const [droneState, setDroneState] = useState('');
  const [sensorState, setSensorState] = useState({ x: 0, y: 0, z: 0 });
  const [gyroIsActive, setGyroActive] = useState(false);



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
    const socketForCommand = dgram.createSocket('udp4');
    socketForCommand.bind(DRONE_PORT);
    socketForCommand.once('listening', function () {
      socketForCommand.send(
        command,
        undefined,
        undefined,
        DRONE_PORT,
        HOST,
        function (err) {
          if (err) {
            throw err;
          }
          console.log('CMD >>', command);
        },
      );
    });
  }, [command]);

  useEffect(() => {
    if (gyroIsActive) {
      setCommand(`rc ${filterAndRound(sensorState.x) * -1} ${filterAndRound(sensorState.y * -1)} ${0} ${0}`);
    }
  }, [sensorState])

  // HANDLE SENSOR DATA
  setUpdateIntervalForType(SensorTypes.accelerometer, 400);
  const subscription = accelerometer.subscribe((data) => {
    setSensorState(data);
  }
  );

  const handleGyroActive = (value) => {
    setGyroActive(value)
    if (!value) {
      setCommand('rc 0 0 0 0');
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" hidden={true} />
      <View style={styles.container}>
        {/* <Text>{droneState}</Text> */}
        <View style={styles.main}>
          <Button title="takeoff" onPress={() => setCommand('takeoff')} />
          <Button title="land" onPress={() => setCommand('land')} />
          <Button title="stop" onPress={() => setCommand('rc 0 0 0 0')} />
          <Button title="connect" onPress={() => setCommand('connect')} />
          <Button title="emergency" color='#DD1C1A' onPress={() => setCommand('emergency')} />
        </View>
        <DButton pressed={(v) => handleGyroActive(v)} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  main: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
});

export default App;

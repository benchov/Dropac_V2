import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
} from 'react-native';
import dgram from 'react-native-udp';
import _, { set } from 'lodash';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {map, filter} from 'rxjs/operators';
import {stateParser, filterAndRound} from './util';
import DButton from './components/DButton';
import AltButton from './components/AltButton';

const STATE_PORT = 8890;
const DRONE_PORT = 8889;
const HOST = '192.168.10.1';
let Buffer = [];
const App = () => {
  const [command, setCommand] = React.useState('command');
  const [stateStream, handleStateStream] = useState(false);
  const [droneState, setDroneState] = useState('');
  const [sensorState, setSensorState] = useState({x: 0, y: 0, z: 0});
  const [gyroState, setGyroState] = useState({x: 0, y: 0, z: 0});
  const [gyroIsActive, setGyroActive] = useState(false);
  const [text, setText] = React.useState(['Useless Multiline Placeholder']);

  // GET DRONE STATE
  useEffect(() => {
    const state = dgram.createSocket('udp4');
    state.bind(STATE_PORT, '0.0.0.0');
    state.on(
      'message',
      _.throttle((message) => {
        console.log(`🚁  :: ${message}`);
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
          console.log('CMD ::', command);
        },
      );
    });
  }, [command]);

  useEffect(() => {
    if (gyroIsActive) {
      setCommand(
        `rc ${filterAndRound(sensorState.y )} ${
          filterAndRound(sensorState.x) * -1
        } ${0} ${filterAndRound(gyroState.z, 'gyro') * -1}`,
      );
    }
  }, [sensorState]);

  // HANDLE SENSOR DATA
  setUpdateIntervalForType(SensorTypes.accelerometer, 400);
  const subscriptionAccelometer = accelerometer.subscribe((data) => {
    setSensorState(data);
  });
  setUpdateIntervalForType(SensorTypes.gyroscope, 400);
  const subscriptionGyroscope = gyroscope.subscribe((data) => {
    setGyroState(data);
  });

  const handleGyroActive = (value) => {
    setGyroActive(value);
    if (!value) {
      setCommand('rc 0 0 0 0');
    }
  };

  const handlePressAltitude = (value) => {
    if (!value) {
      setCommand('rc 0 0 0 0');
    } else {
      setCommand(value);
    }
  }

  const handleCommandHeadline = (value) => {
    if (value !== Buffer[0]) {
      Buffer.unshift(value);
    }
    return Buffer.map((line) => `\n${line}`);
    //  console.log(Buffer);
  };
  return (
    <>
      <StatusBar barStyle="dark-content" hidden={true} />
      <View
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          zIndex: -99,
          // backgroundColor: 'white',
          // borderBottomColor: '#000000',
          // borderBottomWidth: 1,
        }}>
        <Text style={{letterSpacing: 16, lineHeight: 20, color: 'darkgrey'}}>
          {handleCommandHeadline(command)}
        </Text>
      </View>
      <View style={styles.container}>
        <DButton pressed={(v) => handleGyroActive(v)} />
        <View style={styles.main}>
          {/* <Text>{filterAndRound(gyroState.z, 'gyro')}</Text> */}
          <Button title="takeoff" onPress={() => setCommand('takeoff')} />
          <Button title="land" onPress={() => setCommand('land')} />
          <Button title="stop" onPress={() => setCommand('rc 0 0 0 0')} />
          <Button title="connect" onPress={() => setCommand('connect')} />
          <Button
            title="emergency"
            color="#DD1C1A"
            onPress={() => setCommand('emergency')}
          />
        </View>
        <View style={styles.main}>
          <AltButton name='up' pressed={(v) => handlePressAltitude(v)}/>
          <AltButton name='down' pressed={(v) => handlePressAltitude(v)}/>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
    opacity: 0.7,
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

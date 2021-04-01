import React, {useState, useEffect} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import dgram from 'react-native-udp';
import _ from 'lodash';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {stateParser, filterAndRound} from './util';
import AltitudeSelector from './components/AltitudeSelector';
import MotionActivator from './components/MotionActivator';
import MainFunctionButtons from './components/MainFunctionButtons';
import CommandStream from './components/CommandStream';

const STATE_PORT = 8890;
const DRONE_PORT = 8889;
const HOST = '192.168.10.1';

const App = () => {
  const [command, setCommand] = React.useState('command');
  const [stateStream, handleStateStream] = useState(false);
  const [droneState, setDroneState] = useState('');
  const [sensorState, setSensorState] = useState({x: 0, y: 0, z: 0});
  const [gyroState, setGyroState] = useState({x: 0, y: 0, z: 0});
  const [gyroIsActive, setGyroActive] = useState(false);
  const [altitude, setAltitude] = useState(0);

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
          // console.log('CMD ::', command);
        },
      );
    });
  }, [command]);

  useEffect(() => {
    if (gyroIsActive) {
      setCommand(
        `rc ${filterAndRound(sensorState.y, 'accelerometer')} ${
          filterAndRound(sensorState.x, 'accelerometer') * -1
        } ${altitude} ${
          filterAndRound(gyroState.z, 'gyroscope') * -1
        }`,
      );
    } else {
      setCommand(`rc ${0} ${0} ${altitude} ${0}`);
    }
  }, [gyroIsActive && sensorState, altitude]);

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

  return (
    <>
      <StatusBar barStyle="dark-content" hidden={true} />
      <CommandStream command={command} />
      <View style={styles.container}>
        <MotionActivator isActive={(v) => handleGyroActive(v)} />
        <MainFunctionButtons
          pressedCommand={(command) => setCommand(command)}
        />
        <AltitudeSelector
          pressedAltitude={(altValue) => setAltitude(altValue)}
        />
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
});

export default App;

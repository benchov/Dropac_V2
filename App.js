import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import dgram from 'react-native-udp';

const App = () => {
  const [command, setCommand] = React.useState('command');
  const [connetcted, setConnetcted] = useState(false);

  useEffect(() => {
    const socket = dgram.createSocket('udp4');
    const remotePort = 8889;
    const remoteHost = '192.168.10.1';
    socket.bind(remotePort);
    socket.once('listening', function () {
      socket.send(
        command,
        undefined,
        undefined,
        remotePort,
        remoteHost,
        function (err) {
          if (err) {
            throw err;
          }

          console.log('Message sent!', command);
        },
      );
    });
  },[command]);

  return (
    <>
      <StatusBar barStyle="dark-content" hidden={true} />
      <View style={styles.main}>
        <Text>{connetcted ? 'Connected' : 'Not Connected'}</Text>
        <Button title="takeoff" onPress={() => setCommand('takeoff')} />
        <Button title="land" onPress={() => setCommand('land')} />
        <Button title="connect" onPress={() => setCommand('connect')} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

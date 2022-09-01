/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import storage from './utils/storage';

import BeaconReport from 'beacon-react-native';

const Separator = () => {
  return <View style={styles.separator} />;
};
function HomeScreen() {
  const [eventCode, onChangeEventCode] = useState('');
  const [eventParams, onChangeEventParams] = useState('{"key1":"kkkkkk"}');

  const [realTimeEventReportNumber, onChangeRealTimeEventReportNumber] =
    useState(0);
  const [normalEventReportNumber, onChangeNormalEventReportNumber] =
    useState(0);

  useEffect(() => {
    initSDK();
  }, []);

  function initSDK() {
    const reportCongig = {
      uploadURL: '',
      logLevel: 5,
    };
    BeaconReport.startWithAppkey('L6ESJB0W45FW66V8', reportCongig);
  }
  /**
   *
   * @param type 1:实时；2:普通
   */
  function handleReport(type) {
    console.log('eventCode', eventCode);
    console.log('eventParams', eventParams);
    let eventParamsObj = {};
    if (typeof eventParams === 'string' && eventParams.length) {
      eventParamsObj = JSON.parse(eventParams);
    }

    if (type === 1) {
      BeaconReport.realTimeEventWithCode(eventCode, eventParamsObj);
      console.log('执行实时上报');
      onChangeRealTimeEventReportNumber(realTimeEventReportNumber + 1);
    } else {
      BeaconReport.normalEventWithCode(eventCode, eventParamsObj);
      console.log('执行普通上报');
      onChangeNormalEventReportNumber(normalEventReportNumber + 1);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ height: 160, width: '100%' }}>
        <ScrollView
          style={{
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
          <View style={{ width: '100%', padding: 20 }}>
            <Text style={{ textAlign: 'left' }}>
              实时上报次数：{realTimeEventReportNumber}
            </Text>
            <Text>普通上报次数：{normalEventReportNumber}</Text>
            <Text>自定义上报参数：{eventParams}</Text>
          </View>
        </ScrollView>
      </View>
      <ScrollView
        style={{
          width: '100%',
        }}>
        <Separator />
        <View>
          <Text style={styles.des}>事件上报</Text>
        </View>
        <Separator />
        <View style={styles.content}>
          {/* <Text style={styles.label}>
          appkey：
        </Text> */}
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeEventCode(text)}
            value={eventCode}
            placeholder="事件名 （foo-ios-app-event）"
          />
        </View>
        <Separator />
        <View style={styles.content}>
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeEventParams(text)}
            value={eventParams}
            placeholder="参数 （JSON 文本）"
          />
        </View>
        <Separator />
        <View style={styles.content}>
          <Button title="实时上报" onPress={() => handleReport(1)} />
          <View style={{ width: 20 }} />
          <Button title="普通上报" onPress={() => handleReport(2)} />
        </View>
        <Separator />
      </ScrollView>

      <Separator />
      <Separator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  label: {
    width: 100,
  },
  des: {
    fontSize: 16,
    marginLeft: 20,
    fontWeight: '600',
  },
  inputArea: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    paddingStart: 10,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
  },
});
export default function App() {
  return <HomeScreen />;
}

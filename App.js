/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import storage from './utils/storage';
import CustomWebview from './components/CustomWebview';
// RNExitApp 暂且不好使
// import RNExitApp from 'react-native-exit-app';
import BeaconReport from 'beacon-react-native';
function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
      {/* <Button
        title="Go to inner Details"
        onPress={() => navigation.navigate('InnerDetail')}
      /> */}
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          })
        }
      />
    </View>
  );
}
function DetailsScreen2(navigation) {
  console.log('DetailsScreen2', navigation.route.params);
  const params = navigation.route.params;
  const { url } = params;
  return <CustomWebview url={url} />;
}
const Separator = () => {
  return <View style={styles.separator} />;
};
function HomeScreen({ navigation }) {
  const [appkeyVal, onChangeAppkey] = useState('L6ESJB0W45FW66V8');
  const [uploadUrlVal, onChangeUploadUrl] = useState('');
  const [maxCountVal, onChangeMaxCountVal] = useState('');
  const [realTimeEventPollingInterval, onChangeRealTimeEventPollingInterval] =
    useState('');
  const [normalEventPollingInterval, onChangeNormalEventPollingInterval] =
    useState('');

  const [eventCode, onChangeEventCode] = useState('');
  const [eventParams, onChangeEventParams] = useState('{"key1":"kkkkkk"}');
  const [eventUserId, onChangeUserId] = useState('');
  const [eventOmgId, onChangeOmgId] = useState('');
  const [eventModel, onChangeModel] = useState('');

  const [eventAdditionalParams, onChangeAdditionalParams] =
    useState('{"c1":"ccccc"}');
  const [eventAppVersion, onChangeAppVersion] = useState('');
  const [eventChannelId, onChangeChannelId] = useState('');

  const [realTimeEventReportNumber, onChangeRealTimeEventReportNumber] =
    useState(0);
  const [normalEventReportNumber, onChangeNormalEventReportNumber] =
    useState(0);

  const [webviewUrl, onChangeWebviewUrl] = useState(
    'https://tencent-growth-platform-1251316161.cos.ap-beijing.myqcloud.com/sdk/web-sdk-demo/dist/index.html#/',
  );
  useEffect(() => {
    storage
      .load({
        key: 'sdkInitData',
      })
      .then(ret => {
        // 如果找到数据，则在then方法中返回
        console.log('sdkInitData initParams');
        initParams(ret);
      })
      .catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        console.warn('sdkInitData', err.message);
        switch (err.name) {
          case 'NotFoundError':
            // TODO;
            break;
          case 'ExpiredError':
            // TODO
            break;
        }
      });
  }, []);

  function initParams(data) {
    const {
      appkeyVal = '',
      uploadUrlVal = '',
      maxCountVal = '10000',
      realTimeEventPollingInterval = '2',
      normalEventPollingInterval = '5',
    } = data;
    onChangeAppkey(appkeyVal);
    onChangeUploadUrl(uploadUrlVal);
    onChangeMaxCountVal(maxCountVal);
    onChangeRealTimeEventPollingInterval(realTimeEventPollingInterval);
    onChangeNormalEventPollingInterval(normalEventPollingInterval);
    initSDK(
      appkeyVal,
      uploadUrlVal,
      maxCountVal,
      realTimeEventPollingInterval,
      normalEventPollingInterval,
    );
  }
  function initSDK(
    appkeyVal,
    uploadUrlVal,
    maxCountVal,
    realTimeEventPollingInterval,
    normalEventPollingInterval,
  ) {
    const reportCongig = {
      uploadURL: uploadUrlVal, // 'http://49.233.247.198:31000/logserver/analytics/v2_upload', // 'https://tde.xiaowei.cloud.tencent.com/report?_tde_id=13386',
      logLevel: 5,
      appVersion: 'V1.0.0',
      maxDBCount: parseInt(maxCountVal) || 10000,
      realTimeEventPollingInterval: parseInt(realTimeEventPollingInterval) || 2,
      normalEventPollingInterval: parseInt(normalEventPollingInterval) || 5,
    };
    BeaconReport.startWithAppkey(appkeyVal, reportCongig);
    // BeaconReport.startWithAppkey('L7HIYHOO2QTV55F5', {
    //   uploadURL: 'http://49.233.247.198:31000/logserver/analytics/v2_upload',
    // });
  }
  function handleSave() {
    console.log('appkeyVal', appkeyVal);
    console.log(
      'uploadUrlVal',
      uploadUrlVal,
      maxCountVal,
      realTimeEventPollingInterval,
      normalEventPollingInterval,
    );
    //
    initSDK(
      appkeyVal,
      uploadUrlVal,
      maxCountVal,
      realTimeEventPollingInterval,
      normalEventPollingInterval,
    );
    const sdkInitData = {
      appkeyVal,
      uploadUrlVal,
      maxCountVal,
      realTimeEventPollingInterval,
      normalEventPollingInterval,
    };
    storage.save({
      key: 'sdkInitData', // 注意:请不要在key中使用_下划线符号!
      data: sdkInitData,
      // 如果不指定过期时间，则会使用defaultExpires参数
      // 如果设为null，则永不过期
      expires: null,
    });

    // Alert.alert(
    //   '确定填写完整并退出？',
    //   '',
    //   [
    //     {
    //       text: '取消',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     // BackHandler.exitApp() 只有安卓可用
    //     { text: '确定', onPress: () => RNExitApp.exitApp() },
    //   ],
    //   { cancelable: false },
    // );
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
  function handleMaxReport(type, number) {
    console.log('eventCode', eventCode);
    console.log('eventParams', eventParams);
    let eventParamsObj = {};
    if (typeof eventParams === 'string' && eventParams.length) {
      eventParamsObj = JSON.parse(eventParams);
    }

    if (type === 1) {
      for (var i = 0; i < number; i++) {
        BeaconReport.realTimeEventWithCode(eventCode, eventParamsObj);
      }

      console.log('执行实时上报');
      onChangeRealTimeEventReportNumber(realTimeEventReportNumber + number);
    } else {
      for (var i = 0; i < number; i++) {
        BeaconReport.normalEventWithCode(eventCode, eventParamsObj);
      }
      console.log('执行普通上报');
      onChangeNormalEventReportNumber(normalEventReportNumber + number);
    }
  }
  function handleStopReport() {
    BeaconReport.stopReport(true);
  }
  function handleResumeReport() {
    BeaconReport.resumeReport();
  }
  function setUserId() {
    BeaconReport.setUserId(eventUserId, appkeyVal);
  }
  function setChannelId() {
    BeaconReport.setChannelId(eventChannelId);
  }
  function setOmgId() {
    console.log('eventOmgId', eventOmgId);
    BeaconReport.setOmgId(eventOmgId);
  }
  function setModel() {
    BeaconReport.setModel(eventModel);
  }
  function setAppVersion() {
    BeaconReport.setAppVersion(eventAppVersion);
  }
  function setAdditionalParams() {
    console.log('eventAdditionalParams', eventAdditionalParams);
    let eventParamsObj = {};
    if (
      typeof eventAdditionalParams === 'string' &&
      eventAdditionalParams.length
    ) {
      eventParamsObj = JSON.parse(eventAdditionalParams);
    }
    BeaconReport.setAdditionalParams(eventParamsObj, appkeyVal);
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
        <View style={styles.content}>
          {/* <Text style={styles.label}>
          appkey：
        </Text> */}
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeAppkey(text)}
            value={appkeyVal}
            placeholder="appkey （KSHIO4M63I9Z54NX）"
          />
        </View>
        <Separator />
        <View style={styles.content}>
          {/* <Text style={styles.label}>
          上报地址：
        </Text> */}
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeUploadUrl(text)}
            value={uploadUrlVal}
            placeholder="上报地址，默认走saas上报地址"
          />
        </View>
        <Separator />
        <View style={styles.content}>
          {/* <Text style={styles.label}>
          最大存储条数：
        </Text> */}
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeMaxCountVal(text)}
            value={maxCountVal}
            placeholder="最大存储条数，默认10000"
          />
        </View>
        <Separator />
        <View style={styles.content}>
          {/* <Text style={styles.label}>
          实时上报间隔：
        </Text> */}
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeRealTimeEventPollingInterval(text)}
            value={realTimeEventPollingInterval}
            placeholder="实时上报间隔，单位秒"
          />
        </View>
        <Separator />
        <View style={styles.content}>
          {/* <Text style={styles.label}>
          普通上报间隔：
        </Text> */}
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeNormalEventPollingInterval(text)}
            value={normalEventPollingInterval}
            placeholder="普通上报间隔，单位秒"
          />
        </View>
        <Separator />
        <View style={styles.content}>
          <Button title="保存后，请重启" onPress={handleSave} />
        </View>
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
        <View style={styles.content}>
          <Button
            title="实时上报1000次,耗时1分钟"
            onPress={() => handleMaxReport(1, 1000)}
          />
        </View>
        <Separator />
        <View style={styles.content}>
          <Button
            title="普通上报1000次,耗时1分钟"
            onPress={() => handleMaxReport(2, 1000)}
          />
        </View>
        <Separator />
        <View>
          <Text style={styles.des}>设置</Text>
        </View>
        <Separator />
        <Separator />
        <View style={styles.content}>
          <Button title="暂停上报" onPress={() => handleStopReport()} />
          <Separator />
          <Button title="恢复上报" onPress={() => handleResumeReport()} />
        </View>

        <Separator />
        <View style={styles.content}>
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeUserId(text)}
            value={eventUserId}
            placeholder="参数 （字符串）"
          />
          <Button title="设置userid" onPress={() => setUserId()} />
        </View>

        {/* <Separator />
        <View style={styles.content}>
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeOmgId(text)}
            value={eventOmgId}
            placeholder="参数 （字符串）"
          />
          <Button title="设置设备标识符" onPress={() => setOmgId()} />
        </View> */}

        <Separator />
        <View style={styles.content}>
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeModel(text)}
            value={eventModel}
            placeholder="参数 （字符串）"
          />
          <Button title="手机型号,仅安卓" onPress={() => setModel()} />
        </View>

        <Separator />
        <View style={styles.content}>
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeChannelId(text)}
            value={eventChannelId}
            placeholder="参数 （字符串）"
          />
          <Button title="渠道号" onPress={() => setChannelId()} />
        </View>

        <Separator />
        <View style={styles.content}>
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeAppVersion(text)}
            value={eventAppVersion}
            placeholder="参数 （字符串）"
          />
          <Button title="设置版本号" onPress={() => setAppVersion()} />
        </View>

        <Separator />
        <View style={styles.content}>
          <TextInput
            style={styles.inputArea}
            autoCapitalize="none"
            onChangeText={text => onChangeAdditionalParams(text)}
            value={eventAdditionalParams}
            placeholder="参数 （JSON 文本）"
          />
          <Button title="设置公共参数" onPress={() => setAdditionalParams()} />
        </View>

        <Separator />

        {/* <View style={styles.content}>
        <TextInput
          style={styles.inputArea}
          autoCapitalize="none"
          onChangeText={text => onChangeWebviewUrl(text)}
          value={webviewUrl}
          placeholder="输入h5地址"
        />
          <Button
            title="访问"
            onPress={() => navigation.navigate('webview', { url: webviewUrl })}
          />
      </View> */}
      </ScrollView>

      {/* <Separator />
          <Button title="设置设备标识符" onPress={() => setOmgId()} />
          <Separator />
          <Button title="设置渠道id" onPress={() => setChannelId()} />
          <Separator />
          <Button title="设置appversion" onPress={() => setAppVersion()} />
          <Separator />
          <Button title="设置型号" onPress={() => setModel()} /> */}

      <Separator />
      <Separator />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="InnerHome" component={HomeScreen} />
      <HomeStack.Screen name="InnerDetails" component={DetailsScreen} />
      <HomeStack.Screen name="webview" component={DetailsScreen2} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="InnerSettings" component={SettingsScreen} />
      <SettingsStack.Screen name="Details" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
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
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

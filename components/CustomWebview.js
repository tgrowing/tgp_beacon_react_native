/*
 * @Descripttion: 
 * @Author: sherrysong
 * @Date: 2022-07-11 21:21:27
 * @LastEditors: sherrysong
 * @LastEditTime: 2022-07-14 21:07:06
 */
import React, { Component } from 'react';
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
// ...
export default class CustomWebview extends Component {

  constructor(props){
    super(props)
    this.webView = React.createRef();
    this.state = {
      url: ''
    };
}
  componentDidMount() {
    this.setState({ url: this.props.url });
    console.log("webView2222",this.webView);
  }
  render() {
    return <View />
  }
}
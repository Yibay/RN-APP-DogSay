/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppRegistry, StyleSheet, TabBarIOS, Text, View, Navigator } from 'react-native';

import List from './app/creation/index';
import Edit from './app/edit/index';
import Account from './app/account/index';

class imoocApp extends Component {
  // 初始化模拟数据
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 'blueTab',
      notifCount: 0,
      presses: 0,
    };
  }

  render() {

    return (
      <TabBarIOS tintColor="#ee735c" >
        <Icon.TabBarItemIOS
          iconName='ios-videocam-outline'
          selectedIconName='ios-videocam'
          selected={this.state.selectedTab === 'blueTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'blueTab'
            });
          }}>
          <Navigator
            initialRoute={{
              name: 'list',
              component: List,
              params: {}
            }}
            configureScene={(route) => { 
              return Navigator.SceneConfigs.FloatFromRight; 
            }}
            renderScene={(route, navigator) => {
              let Component = route.component;
              // 此处为 ...操作符, 分拆对象
              // ...route.params获取到 route.params 的全部属性
              // 然后与navigator 一同作为props传入 <Component/>
              return (<Component {...route.params} navigator={navigator} />);
            }} />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          selected={this.state.selectedTab === 'redTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'redTab'
            });
          }}>
          <Edit />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          iconName='ios-more-outline'
          selectedIconName='ios-more'
          renderAsOriginal
          selected={this.state.selectedTab === 'greenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'greenTab'
            });
          }}>
          <Account />
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff'
  }
});



// 注册应用(registerComponent)后才能正确渲染
// 注意：只把应用作为一个整体注册一次，而不是每个组件/模块都注册
AppRegistry.registerComponent('imoocApp', () => imoocApp);
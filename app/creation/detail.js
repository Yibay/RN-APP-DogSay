/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';

var Video = require('react-native-video').default;


var width = Dimensions.get('window').width;

class Detail extends Component {
  constructor(props){
    super(props);
    this.state = {
      // 固定不变的
      rate: 1,
      muted: true,
      resizeMode: 'contain',
      repeat: false,
      // 动态修改的
      videoLoaded: false,
      videoProgress: 0.01,
      videoTotal: 0,
      currentTime: 0,
      paused: false
    }
  }

  render() {
    var data = this.props.data;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} onPress={this._backToList.bind(this)}>详情页{data._id}</Text>
        </View>
        <TouchableWithoutFeedback onPress={this._pauseCtrl.bind(this)}>
          <View style={styles.videoBox}>
            <Video
              ref='videoPlayer'
              style={styles.video}
              source={{uri: data.video}}
              volumn={5}
              paused={this.state.paused}
              rate={this.state.rate}
              muted={this.state.muted}
              resizeMode={this.state.resizeMode}
              repeat={this.state.repeat}

              onLoadStart={this._onLoadStart.bind(this)}
              onLoad={this._onLoad.bind(this)}
              onProgress={this._onProgress.bind(this)}
              onEnd={this._onEnd.bind(this)}
              onError={this._onError.bind(this)} />
            {
              !this.state.videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading} />
            }
            {
              this.state.videoLoaded && this.state.paused && <Icon name='ios-play' style={styles.playIcon} />
            }
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.progressBox}>
          <View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
        </View>
      </View>
    );
  }
  // 导航组件 返回上层
  _backToList() {
    this.props.navigator.pop();
  }
  // 视频组件 生命周期
  _onLoadStart() {
    console.log('load start');
  }
  _onLoad() {
    console.log('loads');
  }
  _onProgress(data) {
    var duration = data.playableDuration;
    var currentTime = data.currentTime;
    var percent = Number((currentTime / duration).toFixed(2));
    var newState = {
      videoTotal: duration,
      currentTime: currentTime,
      videoProgress: percent
    };

    if(!this.state.videoLoaded){
      newState.videoLoaded = true;
    }

    this.setState(newState);
  }
  _onEnd() {
    this.setState({
      videoProgress: 1,
      paused: true
    });
  }
  _onError(e) {
    console.log('error');
    console.log(e);
  }
  // 播放控制
  _rePlay() {
    this.refs.videoPlayer.seek(0);
    this.setState({
      paused: false
    });
  }
  _pause() {
    var paused = !this.state.paused;
    this.setState({
      paused: paused
    });
  }
  _pauseCtrl() {
    if(this.state.videoProgress < 1){
      this._pause();
    }
    else{
      this._rePlay();
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff'
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  videoBox: {
    position: 'relative',
    width: width,
    height: 220,
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: 220,
    backgroundColor: '#000',
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 100,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  progressBox: {
    height: 4,
    backgroundColor: '#ccc'
  },
  progressBar: {
    width: 1,
    height: 4,
    backgroundColor: '#ff6600'
  },
  playIcon: {
    position: 'absolute',
    top: 80,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingLeft: 5,
    fontSize: 40,
    lineHeight: 60,
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderColor: '#ed7b66',
    borderWidth: 1,
    textAlign: 'center',
    color: '#ed7b66'
  }
});


module.exports = Detail;
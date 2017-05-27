/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

class Detail extends Component {
  render() {
    console.log(this.props);
    var row = this.props.row;
    return (
      <View style={styles.container}>
        <Text onPress={this._backToList.bind(this)}>详情页{row._id}</Text>
      </View>
    );
  }

  _backToList() {
    this.props.navigator.pop();
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


module.exports = Detail;
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View, Image, ListView, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl, AlertIOS } from 'react-native';
import Mock from 'mockjs';

var config = require('../common/config');
var request = require('../common/request');
var Detail = require('./detail');


var width = Dimensions.get('window').width;

var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
};


// 视频列表单元组件
class Item extends Component {

  constructor(props){
    super(props);
    this.state = {
      up: this.props.row.voted
    };
  }

  render() {
    var row = this.props.row;
    return (
      <TouchableOpacity onPress={() => {this.props.onSelect(row)}}>
        <View style={styles.item}>
          <Text style={styles.title}>{row.title}</Text>
          <Image 
            source={{uri: row.thumb}} 
            style={styles.thumb}>
            <Icon 
              name='ios-play'
              size={28}
              style={styles.play} />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon 
                name={this.state.up ? 'ios-heart' :'ios-heart-outline'}
                size={28}
                style={[styles.up, this.state.up ? null : styles.down]}
                onPress={this._up.bind(this)} />
              <Text style={styles.handleText} onPress={this._up.bind(this)} >喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon 
                name='ios-chatboxes-outline'
                size={28}
                style={styles.commentIcon}/>
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _up() {
    var that = this;
    var up = !this.state.up;
    var url = config.api.base + config.api.up;
    var body = {
      id: this.props._id,
      up: up ? 'yes' : 'no',
      accessToken: 'abcee'
    };

    request.post(url, body)
      .then(function(data){
        if(data && data.success){
          that.setState({
            up: up
          });
        }
        else{
          AlertIOS.alert('点赞失败，稍后重试');
        }
      })
      .catch(function(e){
        console.log(e);
        AlertIOS.alert('点赞失败，稍后重试');
      })
  }
}

// 视频列表组件
class List extends Component {

	constructor(props) {
		super(props);

		var ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		})

		this.state = {
      isLoadingTail: false,
      isRefreshing: false,
			dataSource: ds.cloneWithRows([])
		}
	}

	_renderRow(row) {
		return (
			<Item key2={row._id} row={row} onSelect={this._loadPage.bind(this)} />
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>列表页面</Text>
				</View>
				{/* ListView 
				  * dataSource 存入包装过的数组 
				  * renderRow 函数,return jsx 组件
				*/}
				<ListView 
					dataSource={this.state.dataSource} 
					renderRow={this._renderRow.bind(this)} 
          onEndReached={
            /* 到列表底后，触发事件 */
            this._fetchMoreData.bind(this)
          }
          onEndReachedThreshold={20}
          renderFooter={
            /* 渲染页脚 
            * 通过函数中的判断，当数据未全部载入时，设置页脚为 <ActivityIndicator />组件：小菊花
            * 数据全部载入后，设置页脚变为 字样："没有更多了"
            */
            this._renderFooter.bind(this)
          } 
          refreshControl={
            /* 添加 下拉刷新组件
            * 当refreshing属性为true时，title和加载小菊花 一直存在，直到refresh变成false 才缩小消失
            * onRefresh为 下拉小菊花 满一圈时，触发事件
            */
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#ff6600"
              title="拼命加载中..." />
          }
					enableEmptySections={true} 
					automaticallyAdjustContentInsets = {false} 
					showsVerticalScrollIndicator={false} />
			</View>
		);
	}

	componentDidMount() {
		this._fetchData(1);
	}

	_fetchData(page) {
    var that = this;

    if(page === 0){
      this.setState({
        isRefreshing: true
      });
    }
    else{
      this.setState({
        isLoadingTail: true
      });
    }

		request.get(config.api.base + config.api.creations,{
      accessToken:'asd',
      page: page
    })
			.then((data) => {
        if(data.success){
          var items = cachedResults.items.slice();

          if(page === 0){
            items = data.data.concat(items);
          }
          else{
            items = items.concat(data.data);
            cachedResults.nextPage += 1;
          }

          cachedResults.items = items;
          cachedResults.total = data.total;

          if(page === 0){
            that.setState({
              isRefreshing: false,
              dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
            });
          }
          else{
            that.setState({
              isLoadingTail: false,
              dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
            });
          }
        }
			})
			.catch((error) => {
        if(page === 0){
          this.setState({
            isRefreshing: false
          })
        }
        else{
          this.setState({
            isLoadingTail: false
          })
        }
        console.warn(error)
      })
	}

  _hasMore() {
    return (cachedResults.total !== cachedResults.items.length);
  }

  _fetchMoreData() {
    if(!this._hasMore() || this.state.isLoadingTail){
      return;
    }
    this._fetchData(cachedResults.nextPage);
  }

  _renderFooter() {
    if(!this._hasMore() && cachedResults.total !== 0){
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      );
    }
    // 显示loading 菊花图

    return (<ActivityIndicator style={styles.loadingMore} />);
  }

  _onRefresh() {
    if(!this._hasMore() || this.state.isRefreshing){
      return;
    }
    this._fetchData(0);
  }

  // 进入详情页
  _loadPage(row) {
    // 向navigator中 push route
    this.props.navigator.push({
      name: 'detail',
      component: Detail,
      params: {
        data: row
      }
    });
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

  item: {
  	width: width,
  	marginBottom: 10,
  	backgroundColor: '#fff'
  },
  title: {
  	padding: 10,
  	fontSize: 18,
  	color: '#333'
  },
  thumb: {
  	position: 'relative',
  	width: width,
  	height: width / 1280 * 720,
  	resizeMode: 'cover'
  },
  play: {
  	position: 'absolute',
  	bottom: 14,
  	right: 14,
  	width: 46,
  	height: 46,
  	paddingLeft: 4,
  	borderColor: '#fff',
  	borderWidth: 1,
  	borderRadius: 23,
  	backgroundColor: 'transparent',
  	textAlign: 'center',
  	lineHeight: 46,
  	color: '#ed7b66'
  },
  itemFooter: {
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  	backgroundColor: '#eee'
  },
  handleBox: {
  	width: width / 2 - 0.5,
  	padding: 10,
  	flexDirection: 'row',
  	justifyContent: 'center',
  	alignItems: 'center',
  	backgroundColor: '#fff'
  },
  handleText: {
  	paddingLeft: 12,
  	fontSize: 18,
  	color: '#333'
  },
  up: {
  	fontSize: 22,
  	color: '#ed7b66'
  },
  down: {
    color: '#333'
  },
  commentIcon: {
  	fontSize: 22,
  	color: '#333'
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
});


module.exports = List;

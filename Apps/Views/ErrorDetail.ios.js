'use strict';

var React = require('react-native');
var base64 = require('base-64');
var EventDetail = require('./EventDetail.ios')
var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');

var {
    StyleSheet,
    ListView,
    TouchableHighlight,
    View,
    Text,
    ActivityIndicatorIOS,
    AlertIOS,
    Component
} = React;

var styles = StyleSheet.create({
    container: {
        margin: 5,
        marginTop: 64,
        marginBottom: 40,
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
  description: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000000'
  },
    title:{
        fontSize: 16,
        fontWeight: '500'
    },
    subtitle:{
        fontSize: 12,

    },
    EventRow: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        //backgroundColor: '#F5FCFF',
        //borderWidth: 0.5,
        borderBottomWidth: 1,
        borderBottomColor: '#d6d7da',
        padding: 10,
    },
    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

var ErrorDetail = React.createClass ({
    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this._data = []
        return {
            errorEvents: ds.cloneWithRows(this._data),
            isLoading: false,
            nextUrl: ''
        };
    },
    componentDidMount: function() {
        this.setState({isLoading: true});
        this.loadErrorDetail();
    },
    render() {
        if (this.state.isLoading){
            return (
                <ActivityIndicatorIOS
                    style={[styles.centering, {height: 80}]}
                    size="large"
                />
            );
        }
        else {
            return (
                <View style={styles.container}>
                <RefreshInfiniteListView
                    ref = {(list) => {this.list= list}}
                    dataSource={this.state.errorEvents}
                    renderRow={this.renderEvent}
                    renderSeparator={this.renderSeparator}
                    renderEmptyRow={this.renderEmptyRow}
                    initialListSize={30}
                    scrollEventThrottle={10}
                    style={{backgroundColor:'transparent'/*,top:100, left:10, width:200, height:300, position:'absolute'*/}}
                    onRefresh = {this.reloadErrorEvents}
                    onInfinite = {this.onInfinite}
                    >
                </RefreshInfiniteListView>
                </View>
            );
        }
    },
    renderEmptyRow: function(){
        return (
                        <Text >
                        </Text>
                )
    },
    onInfinite: function() {
        this.setState({ isLoading: true, });
        fetch(this.state.nextUrl, {
            headers:{
                'Authorization': "Basic "+ base64.encode(this.props.api_key + ":")
            }
        })
        .then((response) => {
            this.setState({
                nextUrl: response.headers.get('link').split('>; rel="next";')[0].split('<')[2]
            })
            console.log(this.state.nextUrl)
            return response
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            this._data = this._data.concat(responseJson)
            this.setState({
                errorEvents: this.state.errorEvents.cloneWithRows(this._data)
            });
            //this.setState({ projects: this.state.projects.concat(responseJson)})
            console.log(this.state.errorEvents)
            this.setState({isLoading: false})
            })
        .catch((error) => {
            this.setState({isLoading: false})
            console.log(error)
            AlertIOS.alert(
                'Some error occurred',
                'Please review your sentry host and api settings'
            );
        });
    },
    reloadErrorEvents: function(){
        this.loadErrorDetail()
    },
    renderEvent: function(event){
        var tag_values = []
        for(let tag of event.tags){
            tag_values.push(tag.key +': ' +tag.value)
        }
        tag_values = tag_values.join(', ')
        return (
            <TouchableHighlight
                onPress={()=>this.onEventTouch(event)}
                  underlayColor={'grey'}
                  style={styles.EventRow}
               >
                <View>
                    <Text style={styles.title}>{event.message}</Text>
                    <Text style={styles.subtitle}>{tag_values}</Text>
                    <Text style={styles.subtitle}>{event.dateCreated}</Text>
                </View>
          </TouchableHighlight>
        );
    },
    onEventTouch: function(event){
        this.props.navigator.push({
            title: event.message,
            component: EventDetail,
            passProps: {
                event: event,
            },
        });
    },
    loadErrorDetail: function() {
        this.setState({ isLoading: true, });
        var url_error_events = this.props.host + "/api/0/issues/" +
                                    this.props.error.id + "/events/";
        console.log(url_error_events )
        this.setState({
            nextUrl: ''
        })
        fetch(url_error_events, {
            headers:{
                'Authorization': "Basic "+ base64.encode(this.props.api_key + ":")
            }
        })
        .then((response) => {
            this.setState({
                nextUrl: response.headers.get('link').split('>; rel="next";')[0].split('<')[2]
            })
            return response
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this._data = []
            this._data = this._data.concat(responseJson)
            this.setState({
                errorEvents: this.state.errorEvents.cloneWithRows(this._data)
            });
            //this.setState({ projects: this.state.projects.concat(responseJson)})
            this.setState({isLoading: false})
            })
        .catch((error) => {
            this.setState({isLoading: false})
            console.log(error)
            AlertIOS.alert(
                'Some error occurred',
                'Please review your sentry host and api settings'
            );
        });
    }
})

module.exports = ErrorDetail;

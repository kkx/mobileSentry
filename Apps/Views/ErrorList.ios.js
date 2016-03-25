'use strict';

var React = require('react-native');
var base64 = require('base-64');
var {
    StyleSheet,
    ListView,
    View,
    Text,
    TouchableHighlight,
    ActivityIndicatorIOS,
    AlertIOS,
    Component
    } = React;


var ErrorDetail = require('./ErrorDetail.ios')
var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var Icon = require('react-native-vector-icons/FontAwesome');
var ErrorChart = require('./ErrorChart')

var styles = StyleSheet.create({
    container: {
        margin: 5,
        marginTop: 64,
        marginBottom: 40,
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500'
    },
    subtitle: {
        fontSize: 12,

    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#d6d7da',
        padding: 10,
    },
    errorRowLeft: {
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        //backgroundColor: '#F5FCFF',
        //borderWidth: 0.5,

    },
    errorRowRight: {
        flex: 1
    },
    icon: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    centering: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

var Welcome = React.createClass ({
    getInitialState: function () {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this._data = []
        return {
            projectErrors: ds.cloneWithRows(this._data),
            nextUrl: '',
            isLoading: false
        };
    },
    componentDidMount: function () {
        this.setState({isLoading: true});
        this.loadProjectErrors();
    },
    render() {
        if (this.state.isLoading) {
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
                        ref={(list) => {this.list= list}}
                        dataSource={this.state.projectErrors}
                        renderRow={this.renderError}
                        renderSeparator={this.renderSeparator}
                        renderEmptyRow={this.renderEmptyRow}
                        initialListSize={30}
                        scrollEventThrottle={10}
                        style={{backgroundColor:'transparent'/*,top:100, left:10, width:200, height:300, position:'absolute'*/}}
                        onRefresh={this.reloadProjectErrors}
                        onInfinite={this.onInfinite}
                    >
                    </RefreshInfiniteListView>

                </View>
            );
        }
    },
    renderEmptyRow: function () {
        return (
            <Text >
            </Text>
        )
    },

    onInfinite: function () {
        this.setState({isLoading: true,});
        fetch(this.state.nextUrl, {
            headers: {
                'Authorization': "Basic " + base64.encode(this.props.api_key + ":")
            }
        })
            .then((response) => {
                console.log(response)
                this.setState({
                    nextUrl: response.headers.get('link').split('>; rel="next";')[0].split('<')[2]
                })
                return response
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this._data = this._data.concat(responseJson)
                this.setState({
                    projectErrors: this.state.projectErrors.cloneWithRows(this._data)
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

    },
    reloadProjectErrors: function () {
        this.loadProjectErrors()
    },
    renderError: function (error) {
        return (
            <View style={styles.row}>
                <TouchableHighlight
                    onPress={()=>this.onErrorTouch(error)}
                    underlayColor={'#E6E6E6'}
                    style={styles.errorRowLeft}
                >
                    <View>
                        <Text style={styles.title}>{error.title}</Text>
                        <Text style={styles.subtitle}>Status:{error.status}, count: {error.count} </Text>
                        <Text style={styles.subtitle}>Last seen: {error.lastSeen}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={()=>this.onErrorChartTouch(error)}
                    underlayColor={'#E6E6E6'}
                    style={styles.errorRowRight}
                >
                    <Icon name="line-chart" size={30} color="blue" style={styles.icon}/>
                </TouchableHighlight>
            </View>
        );
    },

    onErrorTouch: function (error) {
        this.props.navigator.push({
            title: '[events]' + error.title,
            component: ErrorDetail,
            passProps: {
                error: error,
                host: this.props.host,
                api_key: this.props.api_key,
            },
        });
    },
    onErrorChartTouch: function (error) {
        this.props.navigator.push({
            title: '[Events]' + error.title,
            component: ErrorChart,
            passProps: {
                error: error,
                host: this.props.host,
                api_key: this.props.api_key,
            },
        });
    },
    loadProjectErrors: function () {
        this.setState({isLoading: true,});
        this.setState({
            nextUrl: ''
        })
        var url_projects_errors = this.props.host + "/api/0/projects/" +
            this.props.project.organization_slug + "/" + this.props.project.slug + "/issues/";
        console.log(url_projects_errors)
        fetch(url_projects_errors, {
            headers: {
                'Authorization': "Basic " + base64.encode(this.props.api_key + ":")
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
                this._data = []
                this._data = this._data.concat(responseJson)
                this.setState({
                    projectErrors: this.state.projectErrors.cloneWithRows(this._data)
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

module.exports = Welcome;

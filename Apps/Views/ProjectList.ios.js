'use strict';

var React = require('react-native');
var base64 = require('base-64');
var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var ErrorList = require('./ErrorList.ios')
var ProjectChart = require('./ProjectChart')
var Icon = require('react-native-vector-icons/FontAwesome');



var {
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
    ListView,
    ActivityIndicatorIOS,
    AlertIOS,
    } = React;

var styles = StyleSheet.create({
    container: {
        margin: 5,
        marginTop: 64,
        marginBottom: 40,
        flex: 1,
        alignItems: 'stretch',
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#d6d7da',
        padding: 10,
    },
    description: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000000'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 16,

    },
    projectRowLeft: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        //backgroundColor: '#F5FCFF',
        //borderWidth: 0.5,

    },
    projectRowRight: {
        flex:1
    },
    icon: {
        marginLeft: 10,
        padding:10,
        flex:1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    centering: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

var api_key = '5d2e4607ce0149f5b95ba5f0ce5f11ef'
var host = 'https://app.getsentry.com'

var Info = React.createClass({
    getInitialState: function () {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this._data = []
        return {
            host: host,
            api_key: api_key,
            verified: '',
            projects: ds.cloneWithRows(this._data),
            nextUrl: '',
            isLoading: false
        };
    },
    componentDidMount: function () {
        //AsyncStorage.getItem("host").then((value) => {this.setState({host: value})}).done()
        //AsyncStorage.getItem("api_key").then((value) => {this.setState({api_key: value})}).done()
        //AsyncStorage.getItem("verified").then((value) => {this.setState({verified: value})}).done()
        this.setState({isLoading: true});
        this.loadProjectList();
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
                        dataSource={this.state.projects}
                        renderRow={this.renderProject}
                        renderSeparator={this.renderSeparator}
                        renderEmptyRow={this.renderEmptyRow}
                        loadedAllData={this.reloadProjects}
                        initialListSize={30}
                        scrollEventThrottle={10}
                        style={{backgroundColor:'transparent'/*,top:100, left:10, width:200, height:300, position:'absolute'*/}}
                        onRefresh={this.loadProjectList}
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
                'Authorization': "Basic " + base64.encode(this.state.api_key + ":")
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
                for (let ele of responseJson) {
                    this.setState({isLoading: true,});
                    var url_projects = this.state.host + "/api/0/organizations/" + ele.slug + "/projects/";
                    console.log(url_projects)
                    fetch(url_projects, {
                        headers: {
                            'Authorization': "Basic " + base64.encode(this.state.api_key + ":")
                        }
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson)
                            for (let proj of responseJson) {
                                proj.organization_slug = ele.slug;
                            }
                            this._data = this._data.concat(responseJson)
                            this.setState({
                                projects: this.state.projects.cloneWithRows(this._data)
                            });
                            //this.setState({ projects: this.state.projects.concat(responseJson)})
                            console.log(this.state.projects)

                        }).done(this.setState({isLoading: false}))
                }
            })
            .catch((error) => {
                this.setState({isLoading: false})
                this.setState({"verified": 'no'});
                AlertIOS.alert(
                    'Some error occurred',
                    'Please review your sentry host and api settings'
                );
            });

    },
    reloadProjects: function () {
        this.loadProjectList()
    },

    renderProject: function (project) {
        return (
            <View style={styles.row}>
                <TouchableHighlight
                    onPress={()=>this.onProjectTouch(project)}
                    underlayColor={'#E6E6E6'}
                    style={styles.projectRowLeft}
                >
                    <View >
                        <Text style={styles.title}>{project.name}</Text>
                        <Text style={styles.subtitle}>Organization: {project.organization_slug}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={()=>this.onProjectChartTouch(project)}
                    underlayColor={'#E6E6E6'}
                    style={styles.projectRowRight}
                >
                        <Icon name="line-chart" size={30} color="blue" style={styles.icon}/>
                </TouchableHighlight>
            </View>
        );
    },

    onProjectTouch: function (project) {
        this.props.navigator.push({
            title: '[errors]' + project.name,
            component: ErrorList,
            passProps: {
                project: project,
                host: this.state.host,
                api_key: this.state.api_key,
            },
        });
    },

    onProjectChartTouch: function (project) {
        this.props.navigator.push({
            title: '[stats]' + project.name,
            component: ProjectChart,
            passProps: {
                project: project,
                host: this.state.host,
                api_key: this.state.api_key,
            },
        });
    },
    loadProjectList: function () {
        this.setState({isLoading: true,});
        var url = this.state.host + "/api/0/organizations/";
        this.setState({
            nextUrl: ''
        })
        fetch(url, {
            headers: {
                'Authorization': "Basic " + base64.encode(this.state.api_key + ":")
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
                for (let ele of responseJson) {
                    this.setState({isLoading: true,});
                    var url_projects = this.state.host + "/api/0/organizations/" + ele.slug + "/projects/";
                    console.log(url_projects)
                    fetch(url_projects, {
                        headers: {
                            'Authorization': "Basic " + base64.encode(this.state.api_key + ":")
                        }
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            for (let proj of responseJson) {
                                proj.organization_slug = ele.slug;
                            }
                            this._data = this._data.concat(responseJson)
                            this.setState({
                                projects: this.state.projects.cloneWithRows(this._data)
                            });
                            //this.setState({ projects: this.state.projects.concat(responseJson)})
                            console.log(this.state.projects)

                        }).done(this.setState({isLoading: false}))
                }
            })

            .catch((error) => {
                this.setState({isLoading: false})
                this.setState({"verified": 'no'});
                AlertIOS.alert(
                    'Some error occurred',
                    'Please review your sentry host and api settings'
                );
            });
    }
})

module.exports = Info;

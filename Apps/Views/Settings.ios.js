'use strict';

var React = require('react-native');
var base64 = require('base-64');
var {
    StyleSheet,
    View,
    Text,
    TextInput,
    AlertIOS,
    ActivityIndicatorIOS,
    TouchableHighlight,
    Component,
    AsyncStorage,
    } = React;

let VERIFY_URL = '/api/0/';

var styles = StyleSheet.create({
    description: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000000',
        marginTop: 20,
        marginBottom: 20,
    },
    container: {
        margin: 5,
        marginTop: 20,
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
    },
    wrap: {
        flex: 1,

    },
    inputView: {
        flexDirection: 'row',
        margin: 10,
        height: 60,
        //alignItems: 'center',
    },
    labelText: {
        fontSize: 16,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
    },
    input: {
        padding: 5,
        flex: 4,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 20,
    },
    inputError: {
        borderColor: 'red',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        position: 'absolute',
        left: 100,
        right: 100,
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        //color: '#ffffff',
        //marginBottom: 7,
        //border: 1px solid blue',
        //borderRadius: 2,
    },
    buttonText: {
        color: 'blue'
    },
    containerPreference: {
        margin: 5,
        marginTop: 20,
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
    },
    centering: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

var Settings = React.createClass({

    getInitialState: function () {
        return {
            host: '',
            api_key: '',
            verified: '',
            isLoading: false
        };
    },
    componentDidMount: function () {
        AsyncStorage.getItem("host").then((value) => {
            this.setState({host: value})
        }).done()
        AsyncStorage.getItem("api_key").then((value) => {
            this.setState({api_key: value})
        }).done()
        AsyncStorage.getItem("verified").then((value) => {
            this.setState({verified: value})
        }).done()
    },

    renderLoadingView: function () {
        return (
            <View style={styles.outSideContainer}>
                <View style={styles.container}>
                    <ProgressBar styleAttr="Large"/>
                    <Text style={styles.loadingText}>Loading</Text>
                </View>
            </View>
        );
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
        return (
            <View style={styles.container}>
                <View style={styles.wrap}>
                    <Text style={styles.description}>
                        Sentry
                    </Text>
                    <View style={styles.inputView}>
                        <Text style={styles.labelText}>
                            Host
                        </Text>
                        <TextInput
                            style={[styles.input, this.state.verified=='no' && styles.inputError]}
                            onChangeText={(host) => this.setState({host})}
                            value={this.state.host}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.labelText}>
                            Api Key
                        </Text>
                        <TextInput
                            style={[styles.input, this.state.verified=='no' && styles.inputError]}
                            onChangeText={(api_key) => this.setState({api_key})}
                            value={this.state.api_key}
                        />
                    </View>
                    <TouchableHighlight
                        underlayColor={'grey'}
                        style={styles.button}
                        onPress={this.verifyButtonClicked}>
                        <Text style={styles.buttonText}>Check and save</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.wrap}>
                </View>
            </View>
        );
    },
    verifyButtonClicked: function () {
        this.setState({isLoading: true})
        var url = this.state.host + "/api/0/organizations/";
        fetch(url, {
            headers: {
                'Authorization': "Basic " + base64.encode(this.state.api_key + ":"),
            }
        })
            .then((response) => response.json())
            .then((responseText) => {
                this.setState({isLoading: false})
                AsyncStorage.setItem('host', this.state.host)
                AsyncStorage.setItem('api_key', this.state.api_key)
                if (responseText.hasOwnProperty('detail')) {
                    AlertIOS.alert(
                        'Account not verified',
                        'Please review your sentry host and api settings'
                    );
                    this.setState({"verified": 'no'});
                    AsyncStorage.setItem('verified', 'no')
                } else {
                    AlertIOS.alert(
                        'Account verified!'
                    );
                    this.setState({"verified": 'yes'});
                    AsyncStorage.setItem('verified', 'yes')
                }
            })
            .catch((error) => {
                this.setState({isLoading: false})
                this.setState({"verified": 'no'});
                AlertIOS.alert(
                    'Account not verified',
                    'Please review your sentry host and api settings'
                );
            });
    }
})

module.exports = Settings;

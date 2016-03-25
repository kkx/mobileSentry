/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var TabBarView = require('./Apps/Views/TabBar.ios');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} = React;

var ReactNativeNews = React.createClass({
    
    render : function() {
        return (
            <TabBarView style={styles.container} />
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});

AppRegistry.registerComponent('Sentry', () => ReactNativeNews);


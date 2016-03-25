var React = require('react-native');

var {
    StyleSheet,
    ListView,
    ScrollView,
    View,
    Text,
    ActivityIndicatorIOS,
    AlertIOS,
    } = React;
import rawStacktraceContent from './rawStacktraceContent';

var StacktraceInterface = React.createClass({
    render() {
        var trace = rawStacktraceContent(this.props.data, this.props.event.platform)
        return (
                <Text>{trace}</Text>
        )
    }
})

module.exports = StacktraceInterface;

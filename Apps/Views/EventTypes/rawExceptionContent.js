var React = require('react-native');
import rawStacktraceContent from './rawStacktraceContent';

var {
    Text,
    View,
    } = React;

const RawExceptionContent = React.createClass({

    render() {
        let children = this.props.values.map((exc, excIdx) => {
            return (
                <Text key={excIdx}>
                    {exc.stacktrace && rawStacktraceContent(exc.stacktrace, this.props.platform, exc)}
                </Text>
            );
        });

        return (
            <View>{children}</View>
        );
    }
});

export default RawExceptionContent;
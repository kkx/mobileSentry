var React = require('react-native');

var {
    Text,
    } = React;
import RawExceptionContent from './rawExceptionContent';

var StacktraceInterface = React.createClass({
    render() {
        return (
            <RawExceptionContent
                values={this.props.data.values}
                platform={this.props.event.platform}/>
        )
    }
})

module.exports = StacktraceInterface;
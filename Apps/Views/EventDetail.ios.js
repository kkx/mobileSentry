'use strict';

var React = require('react-native');

var {
    StyleSheet,
    ScrollView,
    View,
    Text,
    } = React;

var styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        flex: 1,
        //alignItems: 'center',
        padding: 3,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowRadius: 2,
        shadowOpacity: 0.8,
        shadowOffset: {
            height: 1,
            width: 0
        },
        borderRadius: 2,
        borderWidth: 1,
    },
    title: {
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    container: {
        margin: 5,
        marginTop: 10,
        marginBottom: 20,
        flex: 1,
        //backgroundColor:'#E5E4E2',
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    description: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000000'
    },
    rowData: {
        flexDirection: 'row'
    },
    leftColumn: {
        flex: 0.3,
        color: "#4271ae",
    },
    rightColumn: {
        flex: 0.7
    },
    projectRow: {
        height: 40,

    },
    centering: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});


var stacktraceInterface = require('./EventTypes/stacktrace')
var exceptionInterface = require('./EventTypes/exception')

var EventDetail = React.createClass ({
    interfaces: {
        exception: exceptionInterface,
        stacktrace: stacktraceInterface,
        //request: require('./interfaces/request'),
        //template: require('./interfaces/template'),
        //csp: require('./interfaces/csp'),
    },


    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>
                        Event {this.props.event.eventID}
                    </Text>
                    <Text style={styles.desc}>
                        created {this.props.event.dateCreated}
                    </Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.title}>
                        Tags
                    </Text>
                    <View style={styles.desc}>
                        {this.renderTags()}
                    </View>
                </View>
                {this.renderAdditionalData('User', this.props.event.user)}
                <View style={styles.card}>
                    <Text style={styles.title}>
                        Errors
                    </Text>
                    <View style={styles.desc}>
                        {this.renderEntries()}
                    </View>
                </View>
                {this.renderAdditionalData('Additional Data', this.props.event.context)}
                {this.renderAdditionalData('Packages', this.props.event.packages)}
            </ScrollView>
        );
    },
    renderEntries: function () {
        let entries = this.props.event.entries.map((entry, entryIdx) => {
            try {
                let Component = this.interfaces[entry.type];
                if (!Component) {
                    console && console.error && console.log('Unregistered interface: ' + entry.type);
                    return null;
                }
                return (
                    <Component
                        key={'entry-' + entryIdx}
                        event={this.props.event}
                        type={entry.type}
                        data={entry.data}
                    />
                );
            } catch (ex) {
                console.log(ex);
            }
        });
        return (
            <View>
                {entries}
            </View>
        )

    },
    renderTags: function () {
        return (
            <View>
                {this.props.event.tags.map(function (tag) {
                    return (
                        <View key={tag.key} style={styles.rowData}>
                            <Text style={styles.leftColumn}>{tag.key}</Text>
                            <Text style={styles.rightColumn}>{JSON.stringify(tag.value)}</Text>
                        </View>
                    )
                })
                }
            </View>
        )
    },
    renderAdditionalData: function (title, data_to_render) {
        try {
            var ks = Object.keys(data_to_render);
        }
        catch (err) {
            console.log(err)
            return
        }
        var data = []
        for (let key of ks) {
            data.push({key: key, value: data_to_render[key]})
        }
        return (
            <View style={styles.card}>
                <View>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    <View style={styles.desc}>
                        {
                            data.map(function (d) {
                                return <View key={d.key} style={styles.rowData}>
                                    <Text style={styles.leftColumn}>{d.key}</Text>
                                    <Text style={styles.rightColumn}>{JSON.stringify(d.value)}</Text>
                                </View>
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }
})

module.exports = EventDetail;

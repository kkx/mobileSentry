var React = require('react-native');
import RNChart from 'react-native-chart';

var base64 = require('base-64');
var {
    StyleSheet,
    View,
    ActivityIndicatorIOS,
    AlertIOS,
    } = React;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 64,
        marginBottom: 50,
    },
    chart: {
        position: 'absolute',
        top: 16,
        left: 4,
        bottom: 4,
        right: 16,
    }
});


var Chart = React.createClass ({
    getInitialState: function () {
        return {
            stats: [],
            isLoading: false,
            xLabels: [],
            chartData: [],
        };
    },
    componentDidMount: function () {
        this.setState({isLoading: true});
        this.loadErrorStats();
    },
    render() {
        var xLabels = this.state.xLabels
        if (this.state.isLoading) {
            return (
                <ActivityIndicatorIOS
                    style={[styles.centering, {height: 80}]}
                    size="large"
                />
            );
        }
        else {
            var chartData =  [{
                        name: 'BarChart',
                        color: 'gray',
                        lineWidth: 2,
                        showDataPoint: true,
                        data: this.state.data,
                        }]

            return (
                <View style={styles.container}>
                    <RNChart style={styles.chart}
                             chartData={chartData}
                             verticalGridStep={5}
                             xLabels={xLabels}
                             yAxisTitle="Errors"
                             xAxisTitle="Last 24 Hours"
                             chartTitle={this.props.error.title}
                    />
                </View>
            );
        }
    },
    loadErrorStats: function () {
        this.setState({isLoading: true,});
        //from 24h ago
        var until = Math.round(new Date().getTime() / 1000);
        var since = until - (24 * 3600);
        var url_projects_errors = this.props.host + "/api/0/issues/" + this.props.error.id + '/'
        console.log(url_projects_errors)
        fetch(url_projects_errors, {
            headers: {
                'Authorization': "Basic " + base64.encode(this.props.api_key + ":")
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                var xLabels = []
                var data = []
                var count = 24
                for (let i of responseJson.stats['24h']) {
                    var [x, y] = i
                    var d = new Date(x*1000)
                    xLabels.push('-' + count)
                    //fix for lib bug https://github.com/tomauty/react-native-chart/issues/61
                    if (i[1] == 0){
                        data.push(i[1]+0.01)
                    }else{
                        data.push(i[1])
                    }
                    count = count - 1;
                }
                this.setState({
                    xLabels: xLabels,
                    data: data,
                    isLoading: false
                });
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

module.exports = Chart;
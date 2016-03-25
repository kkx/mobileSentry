/**
 *  * React Native News App
 *   * https://github.com/tabalt/ReactNativeNews
 *    */
'use strict';

var ProjectList = require('./ProjectList.ios');
var Settings = require('./Settings.ios')

var React = require('react-native');
var {
    StyleSheet,
    TabBarIOS,
    NavigatorIOS,
    Text,
    View,
    AsyncStorage,
    AlertIOS,
    } = React;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
    },
})

var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';

var TabBar = React.createClass({
    statics: {
        title: '<TabBarIOS>',
        description: 'Tab-based navigation.',
    },

    getInitialState: function () {
        return {
            selectedTab: 'ProjectList',
            verified: ''
        };
    },

    componentDidMount: function () {
        AsyncStorage.getItem("verified").then((value) => {
            this.setState({verified: value})
        }).done()
    },

    displayName: 'TabBar',


    render: function () {
        return (
            <TabBarIOS selectedTab={this.state.selectedTab}>
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'ProjectList'}
                    systemIcon="recents"
                    onPress={() => {
                          if (this.state.verified == "yes"){
                           this.setState({
                                selectedTab: 'ProjectList',
                            });
                          }else{
                            AlertIOS.alert(
                             'Account not verified',
                             'Please verify your accout first'
                            );
                            this.setState({
                                selectedTab: 'settings',
                            });
                          }
                      }}>
                    <View style={styles.container}>
                        <NavigatorIOS
                          initialRoute={{
                            component: ProjectList,
                            title: 'Projects',
                            passProps: {},
                          }}
                          style={{
                                flex:1,
                            }}
                        />

                        </View>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'settings'}
                    systemIcon="more"
                    onPress={() => {
                this.setState({
                    selectedTab: 'settings',
                });
          }}>
                    <Settings/>
                </TabBarIOS.Item>

            </TabBarIOS>
        );
    }
});


module.exports = TabBar;

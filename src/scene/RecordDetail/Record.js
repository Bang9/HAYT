import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';

class Record extends Component{
    render(){
        return(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:30}}>
                RECORD PAGE
            </Text>
        </View>
        )
    }
}

export default Record
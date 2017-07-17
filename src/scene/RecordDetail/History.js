import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';

class History extends Component{
    render(){
        return(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:30}}>
                HISTORY PAGE
            </Text>
        </View>
        )
    }
}

export default History
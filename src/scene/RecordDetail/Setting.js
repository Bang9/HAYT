import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';

import Button from '../../components/Button'
import API from '../../services/API'
import {Actions} from 'react-native-router-flux'
class Setting extends Component{
    render(){
        return(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:30}}>
                SETTING PAGE
            </Text>
            <Button title="로그아웃" onClick={()=>{API.logout('facebook',()=>{Actions.login()})}}/>
        </View>
        )
    }
}

export default Setting
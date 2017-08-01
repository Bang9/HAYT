import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions,
    AsyncStorage,
    Image
} from 'react-native';

import Button from '../../components/Button'
import API from '../../services/API'
import {Actions} from 'react-native-router-flux'
class Setting extends Component{
    constructor(){
        super()
        this.state={
            userConfig: {
                name: null,
                email: null,
                photoURL: null,
                uid: null,
            },
            authType:null,
        }
    }
    componentWillMount(){
        AsyncStorage.getItem('userConfig')
            .then( (data)=>this.setState({userConfig:JSON.parse(data)}) )
        AsyncStorage.getItem('authType')
            .then( (data)=>this.setState({authType:data}) )
    }
    render(){
        return(
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:30}}>
                    SETTING PAGE
                </Text>

                <View style={{margin:20}}>
                    <Text>{"Login with "+this.state.authType}</Text>
                    <Text>{this.state.userConfig.name}</Text>
                    <Text>{this.state.userConfig.email}</Text>
                    <Text>{this.state.userConfig.uid}</Text>
                    <Image
                        style={{width:100,height:100}}
                        source={{uri:this.state.userConfig.photoURL}}
                    />
                </View>
                <Button title="로그아웃" onClick={()=>{API.logout('facebook',()=>{Actions.login()})}}/>
            </View>
        )
    }
}

export default Setting
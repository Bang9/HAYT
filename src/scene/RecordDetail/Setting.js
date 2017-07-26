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
                gender: null,
                birthday: null,
                email: null,
                pic: {
                    height: null,
                    width: null,
                    url: null
                }
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
                    <Text>{this.state.userConfig.gender}</Text>
                    <Text>{this.state.userConfig.birthday}</Text>
                    <Text>{this.state.userConfig.email}</Text>
                    <Image
                        style={{width:this.state.userConfig.pic.width,height:this.state.userConfig.pic.height}}
                        source={{uri:this.state.userConfig.pic.url}}
                    />
                </View>
                <Button title="로그아웃" onClick={()=>{API.logout('facebook',()=>{Actions.login()})}}/>
            </View>
        )
    }
}

export default Setting
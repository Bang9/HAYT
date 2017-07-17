/*

import React, {Component} from "react";
import {Dimensions, Image, StyleSheet, TextInput, View} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

import Button from "../../components/Button";
import LoginService from "../../services/LoginService";
const {width,height} = Dimensions.get('window');
const loginService = new LoginService();

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            userPwd: null,
            showSpinner:false,
        }
    }

    componentWillMount() {
    }

    render() {
        const iconID = require('../../img/inputEmail.png');
        const iconPWD = require('../../img/inputPwd.png');
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={styles.loginContainer}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={iconID}
                               resizeMode={Image.resizeMode.contain}
                               style={styles.iconStyle}/>
                        <TextInput placeholder="아이디" style={styles.inputContainer}
                                   onChangeText={(val) => this.setState({userId: val})}
                                   value={this.state.userId}/>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={iconPWD}
                               resizeMode={Image.resizeMode.contain}
                               style={styles.iconStyle}/>
                        <TextInput secureTextEntry={true} placeholder="패스워드"
                                   style={styles.inputContainer} onChangeText={(val) => this.setState({userPwd: val})}
                                   value={this.state.userPwd}/>
                    </View>
                </View>
                <Button title="로그인" color={global.mainColor} btnStyle={{width: width * .8}} onClick={() =>{}}/>
                <Spinner visible={this.state.showSpinner}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loginContainer : {
        paddingTop : 30,
        paddingBottom : 70,
    },
    inputContainer : {
        paddingLeft:35,
        width:width*.8,
        right:10,
    },
    iconStyle : {
        width: 20,
        height: 20,
        alignSelf: 'center',
        left: 20
    }

})

export default Login;
*/
import React, {Component} from "react";
import {Dimensions, Image, StyleSheet, TextInput, View, Text} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {Actions} from 'react-native-router-flux'

import Button from "../../components/Button";
const {width,height} = Dimensions.get('window');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            method: 'none',
            userId: null,
            userPwd: null,
            showSpinner: false,
        }
    }

    render() {
        const iconID = require('../../img/inputEmail.png');
        const iconPWD = require('../../img/inputPwd.png');

        const mainView = (
            <View style={styles.loginContainer}>
                <Button title="이메일로 로그인" color={'#ff8888'}
                        buttonStyle={{margin:10,width: width * .8}} onClick={() =>{this.setState({method:'email'})}}/>
                <Button title="페이스북" color={'#6d84b4'}
                        buttonStyle={{margin:10,width: width * .8}} onClick={() =>{this.login_social('facebook')}}/>
                <Button title="카카오톡" color={'#fcd411'}
                        buttonStyle={{margin:10,width: width * .8}} onClick={() =>{this.login_social('kakao')}}/>
            </View>
        )

        const emailView = (
            <View style={styles.loginContainer}>
                <View style={styles.inputBox}>
                    <Image
                        source={iconID}
                        resizeMode={Image.resizeMode.contain}
                        style={styles.iconStyle}/>
                    <TextInput
                        underlineColorAndroid={"#ffffffff"}
                        placeholder="Email"
                        style={styles.inputContainer}
                        onChangeText={(val) => this.setState({userId: val})}
                        value={this.state.userId}/>
                </View>

                <View style={styles.inputBox}>
                    <Image
                        source={iconPWD}
                        resizeMode={Image.resizeMode.contain}
                        style={styles.iconStyle}/>
                    <TextInput
                        underlineColorAndroid={"#ffffffff"}
                        secureTextEntry={true}
                        placeholder="Password"
                        style={styles.inputContainer}
                        onChangeText={(val) => this.setState({userPwd: val})}
                        value={this.state.userPwd}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',marginBottom:10}}>
                    <View style={{flex:1,alignItems:'flex-start',marginLeft:40}}>
                    <Text>회원가입</Text>
                    </View>
                    <View style={{flex:1,alignItems:'flex-end',marginRight:40}}>
                    <Text>ID/PW찾기</Text>
                    </View>
                </View>
                <Button title="로그인" color={'#ff8888'}
                        buttonStyle={{margin:10,width: width * .8}}
                        onClick={() =>this.login_email()}/>
                <Button title="뒤로가기" color={'#fff'} titleStyle={{color:'#ff8888'}}
                        buttonStyle={{borderColor:'#ff8888',borderWidth:1,margin:10,width: width * .8}}
                        onClick={() =>{this.setState({method:'none'})}}/>
            </View>
        )
        const renderView = this.state.method=='email' ? emailView : mainView

        return (
            <View style={{flex:1,alignItems: 'center'}}>
                <View style={styles.logoContainer}>
                    <Text style={{fontSize:80,textAlign:'center',width:200,height:100,}}>
                        HAYT
                    </Text>
                </View>
                    {renderView}
                <Spinner visible={this.state.showSpinner}/>
            </View>
        )
    }

    login_social(type){
        this.setState({method:type});
        Actions.main();
    }
    login_email(){
        Actions.main();
    }
}

const styles = StyleSheet.create({
    logoContainer : {
        flex:0.3,
        alignItems:'center',
        justifyContent:'flex-end',
    },
    loginContainer : {
        flex:0.7,
        justifyContent:'center',
        alignItems:'center'
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
        left: 15
    },
    inputBox:{
        flexDirection: 'row',
        borderWidth:1,
        borderColor:'#bfbfbf',
        borderRadius:30,
        margin:5
    }

})

export default Login;

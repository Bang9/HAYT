import React, {Component} from "react";
import {Dimensions, Image, StyleSheet, TextInput, View, Text, Alert, ScrollView} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {Actions} from 'react-native-router-flux'
import API from '../../services/API'
import Button from "../../components/Button";
const {width,height} = Dimensions.get('window');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginType: 'none',
            email: null,
            password: null,
            showSpinner: false,
        }
    }

    onSubmitEmail() {
        this.password.focus();
    }
    onSubmitPassword() {
        this.password.blur();
    }

    render() {
        const iconID = require('../../img/inputEmail.png');
        const iconPWD = require('../../img/inputPwd.png');

        const mainView = (
            <View style={[styles.loginContainer,{marginTop:80}]}>
                <Button title="이메일로 로그인" color={'#ff8888'}
                        buttonStyle={{margin:10,width: width * .8}} onClick={() =>{this.setState({loginType:'email'})}}/>
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
                        ref={(ref)=>this.email = ref}
                        placeholder="Email"
                        underlineColorAndroid={"#ffffffff"}
                        style={styles.inputContainer}
                        keyboardType='email-address'
                        returnKeyType='next'
                        onChangeText={(val) => this.setState({email: val})}
                        onSubmitEditing={()=>this.onSubmitEmail()}
                        value={this.state.email}/>
                </View>

                <View style={styles.inputBox}>
                    <Image
                        source={iconPWD}
                        resizeMode={Image.resizeMode.contain}
                        style={styles.iconStyle}/>
                    <TextInput
                        ref={(ref)=>this.password = ref}
                        placeholder="Password"
                        underlineColorAndroid={"#ffffffff"}
                        style={styles.inputContainer}
                        secureTextEntry={true}
                        returnKeyType='done'
                        onChangeText={(val) => this.setState({password: val})}
                        onSubmitEditing={()=>this.onSubmitPassword()}
                        value={this.state.password}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',marginBottom:10}}>
                    <View style={{flex:1,alignItems:'flex-start',marginLeft:40}}>
                        <Text>ID/PW찾기</Text>
                    </View>
                    <View style={{flex:1,alignItems:'flex-end',marginRight:40}}>
                        <Text onPress={()=>Actions.signup()}>회원가입</Text>
                    </View>
                </View>
                <Button title="로그인" color={'#ff8888'}
                        buttonStyle={{margin:10,width: width * .8}}
                        onClick={() =>this.login_email()}/>
                <Button title="뒤로가기" color={'#fff'} titleStyle={{color:'#ff8888'}}
                        buttonStyle={{borderColor:'#ff8888',borderWidth:1,margin:10,width: width * .8}}
                        onClick={() =>{this.setState({loginType:'none'})}}/>
            </View>
        )
        const renderView = this.state.loginType=='email' ? emailView : mainView

        return (
            <ScrollView>
                <View style={styles.logoContainer}>
                    <Image
                        style={{height:170,width:340}}
                        resizeMode={Image.resizeMode.contain}
                        source={require('../../img/logo.png')}
                    />
                </View>
                {renderView}
                <Spinner visible={this.state.showSpinner}/>
            </ScrollView>
        )
    }

    login_callback(isCancel){
        if(isCancel)
            return this.setState({showSpinner:false})
        else
            return this.setState({showSpinner:false},Actions.main())
    }

    login_social(type){
        this.setState({loginType:type,showSpinner:true});
        API.login(type, (isCancel)=>this.login_callback(isCancel))
    }

    login_email(){
        let email = this.state.email
        let password = this.state.password
        if(email==null||password==null) return Alert.alert('알림','로그인 정보를 입력해주세요')
        this.setState({showSpinner:true});
        return API.login('email', (isCancel)=>this.login_callback(isCancel), {email,password})
    }
}

const styles = StyleSheet.create({
    logoContainer : {
        marginTop:80,
        alignItems:'center',
        justifyContent:'center',
    },
    loginContainer : {
        paddingVertical:40,
        justifyContent:'center',
        alignItems:'center',
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

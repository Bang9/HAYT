import React, {Component} from "react";
import {Dimensions, Image, StyleSheet, TextInput, View, Text, ScrollView, Alert, ToastAndroid} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {Actions} from 'react-native-router-flux'
import API from '../../services/API'
import Button from "../../components/Button";
const {width,height} = Dimensions.get('window');
import firebase from '../../commons/Firebase'
import { TextField } from 'react-native-material-textfield';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.onFocus = this.onFocus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitName = this.onSubmitName.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
        this.onAccessoryPress = this.onAccessoryPress.bind(this);

        this.nameRef = this.updateRef.bind(this, 'name');
        this.emailRef = this.updateRef.bind(this, 'email');
        this.passwordRef = this.updateRef.bind(this, 'password');
        this.recheckRef = this.updateRef.bind(this, 'recheck');

        this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

        this.state = {
            name: '',
            email:'',
            password:'',
            recheck:'',
            secureTextEntry: true,
            showSpinner:false,
        };
    }

    onFocus() {
        let { errors = {} } = this.state;

        for (let name in errors) {
            let ref = this[name];

            if (ref && ref.isFocused()) {
                delete errors[name];
            }
        }

        this.setState({ errors });
    }

    onChangeText(text) {
        ['name', 'email', 'password', 'recheck']
            .map((name) => ({ name, ref: this[name] }))
            .forEach(({ name, ref }) => {
                if (ref.isFocused()) {
                    this.setState({ [name]: text });
                }
            });
    }

    onAccessoryPress() {
        this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
    }
    onSubmitName() {
        this.email.focus();
    }
    onSubmitEmail() {
        this.password.focus();
    }
    onSubmitPassword() {
        this.recheck.focus();
    }
    onSubmitRecheck() {
        this.recheck.blur();
    }

    isEmpty(obj) {
        for(var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    }

    onSubmit() {
        let errors = {};

        ['name', 'email', 'password', 'recheck']
            .forEach((name) => {
                let value = this[name].value();

                if (!value) {
                    errors[name] = '빈칸을 채워주세요';
                } else {
                    if ('email' === name){
                        //let regex = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/
                        let regex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/
                        if(!regex.test(this.state.email))
                            errors[name] = '이메일이 올바르지 않습니다'
                    }
                    else if ('password' === name && value.length < 6) {
                        errors[name] = '비밀번호가 너무 짧습니다';
                    }
                    else if ('recheck' === name ){
                        if( value != this['password'].value() )
                            errors[name] = '비밀번호가 맞지 않습니다'
                    }

                }
            });

        this.setState({ errors });

        if(this.isEmpty(errors)) {
            this.signUpWithEmail()
        }
        else
            console.log('Error:',JSON.stringify(errors))
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    renderPasswordAccessory() {
        let { secureTextEntry } = this.state;

        let name = secureTextEntry?
            'visibility':
            'visibility-off';

        return (
            <MaterialIcon
                size={24}
                name={name}
                color={TextField.defaultProps.baseColor}
                onPress={this.onAccessoryPress}
                suppressHighlighting
            />
        );
    }

    render() {
        let { errors = {}, secureTextEntry, ...data } = this.state;

        return (
            <ScrollView style={styles.scroll}>
                <View style={styles.input}>
                    <TextField
                        ref={this.nameRef}
                        value={data.name}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        onFocus={this.onFocus}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.onSubmitName}
                        returnKeyType='next'
                        label='이름'
                        error={errors.name}
                    />

                    <TextField
                        ref={this.emailRef}
                        value={data.email}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        onFocus={this.onFocus}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.onSubmitEmail}
                        returnKeyType='next'
                        label='이메일'
                        error={errors.email}
                    />

                    <TextField
                        ref={this.passwordRef}
                        value={data.password}
                        secureTextEntry={secureTextEntry}
                        autoCapitalize='none'
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        onFocus={this.onFocus}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.onSubmitPassword}
                        returnKeyType='next'
                        label='비밀번호'
                        error={errors.password}
                        title='6자 이상'
                        maxLength={30}
                        characterRestriction={20}
                        renderAccessory={this.renderPasswordAccessory}
                    />

                    <TextField
                        ref={this.recheckRef}
                        value={data.recheck}
                        secureTextEntry={secureTextEntry}
                        autoCapitalize='none'
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        onFocus={this.onFocus}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.onSubmitPassword}
                        returnKeyType='done'
                        label='재확인'
                        error={errors.recheck}
                        maxLength={30}
                        characterRestriction={20}
                    />
                </View>

                <View style={styles.container}>
                    <Button
                        title='확인' onClick={()=>this.onSubmit()}
                        color={TextField.defaultProps.tintColor}
                        buttonStyle={{margin:10,width: width * .8}}/>
                </View>
                <Spinner visible={this.state.showSpinner}/>
            </ScrollView>
        );
    }

    signUpWithEmail(){
        this.setState({showSpinner:true})
        const email = this.state.email
        const password = this.state.password
        const name = this.state.name
        firebase.auth().createUserWithEmailAndPassword(email,password)
            .then( (res)=>{
                return firebase.auth().currentUser.updateProfile(
                    {
                        displayName: name
                    })
            })
            .then( ()=>{
                this.setState({showSpinner:false},
                    ()=>{
                        Actions.pop();
                        ToastAndroid.show('회원가입 성공!',ToastAndroid.SHORT);
                    })
            })
            .catch( (err)=>{
                this.setState({showSpinner:false})
                if(err.code === 'auth/email-already-in-use')
                    return Alert.alert('알림','이미 사용중인 이메일입니다.')
                if(err.code === 'auth/invalid-email')
                    return Alert.alert('알림','유효하지 않은 이메일 형식입니다.')
                if(err.code === 'auth/weak-password')
                    return Alert.alert('알림','보안을 위해 6자 이상 비밀번호를 설정해주세요')

                return Alert.alert('에러','관리자에게 문의해주세요.\n'+JSON.stringify(err))
            })
    }
}

const styles = StyleSheet.create({
    scroll: {
        flex:1,
        paddingHorizontal: 15,
        paddingVertical: 50,
        marginHorizontal: 4,
        marginVertical: 8,
    },
    input:{
        justifyContent:'center',
    },
    container: {
        alignItems:'center',
        paddingVertical: 70,
        justifyContent:'center',
    },

})

export default SignUp;

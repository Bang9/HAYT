
/*
import {
    AsyncStorage,
    Alert,
} from 'react-native';
import {Actions} from'react-native-router-flux'
import firebase from '../common/Firebase'
const database = firebase.database();
const auth = firebase.auth();

export default class Session {

    async updateSession(data) {
        try {
            await AsyncStorage.setItem("@App:session", JSON.stringify(data));
        } catch (err) {
            console.log("saving session failed.", err);
        }
    };

    async removeSession() {
        try {
            await AsyncStorage.removeItem("@App:session");
        } catch (err) {
            console.log("removing session failed.", err);
        }
    }

    async getSession() {
        try {
            return await AsyncStorage.getItem("@App:session").then(function (session) {
                return JSON.parse(session);
            });
        } catch (err) {
            console.log("getting session failed.", err);
        }
    }

    //async storage
    async setItem(key,value){
        try {
            await AsyncStorage.setItem(key,value)
        }
        catch(err) {
            console.log("set error",err)
        }
    }
    async getItem(key){
        try {
            return await AsyncStorage.getItem(key).then(
                (result) => {return JSON.parse(result)}
            );
        } catch(err){
            console.log("get failed",err)
        }
    }
    //end async storage

    //login async
    async saveAutoLoginInfo(data) {
        try {
            await AsyncStorage.setItem("@App:userData", JSON.stringify(data));
        } catch (err) {
            console.log("ASYNC::AUTO LOGIN SAVING FAILED");
        }
    }

    async loadAutoLoginInfo() {
        try {
            return await AsyncStorage.getItem("@App:userData").then(
                function (loginInfo) {
                    return JSON.parse(loginInfo);
                });
        } catch (err) {
            console.log("ASYNC::AUTO LOGIN INFO GETTING FAILED");
        }
    }

    async checkOutAutoLogin(){
        try{
            await AsyncStorage.setItem("@App:autoLogin",JSON.stringify(false))
        }
        catch(err){
            console.log("ASYNC::AUTO LOGIN CHECKOUT FAILED")
        }
    }
    //end login async

    //firebase Auth
    async signIn(email,password) {
        let user = await auth.signInWithEmailAndPassword(email, password)
        if (user) {
            console.log("FIREBASE::SIGN IN SUCCESS::",user.uid)
            return {
                result: true,
                uid:user.uid,
                data:{}
            }
        } else {
            console.log("FIREBASE::SIGN IN FAILED")
            return {
                result: false,
                data:{}
            }
        }
    }

    async login(param) {
        console.log("FIREBASE::LOGIN START",param.state.email,param.state.password)
        let data = {id:param.state.email, pwd:param.state.password}

        if(data.id==null) Alert.alert("알림","아이디를 입력하세요")
        else if(data.pwd==null) Alert.alert("알림","비밀번호를 입력하세요")
        else {
            param.setState({showSpinner:true})
            this.signIn(data.id, data.pwd)
                .then((res) => {
                    if (res.result) {
                        this.setItem("@App:autoLogin", JSON.stringify(true))
                        this.saveAutoLoginInfo(data)
                        global.userConfig.uid = res.uid
                        Actions.main()
                    } else {
                        Alert.alert("알림", "아이디나 비밀번호를 확인하세요")
                    }
                    param.setState({showSpinner:false})
                })
                .catch((err) => {
                    if(err.code == 'auth/invalid-email')
                        err.message = '이메일 형식이 맞지 않습니다.'
                    else if(err.code == 'auth/wrong-password')
                        err.message = '비밀번호가 맞지 않습니다.'
                    else if(err.code == 'auth/user-not-found')
                        err.message = '존재하지 않는 사용자입니다.'
                    param.setState({showSpinner:false})
                    Alert.alert("알림", err.message)
                })
        }
    }
    async logout(){
        auth.signOut()
            .then( ()=>{
                    console.log("FIREBASE::SIGN OUT"),
                        this.checkOutAutoLogin()
                            .then(()=>{console.log("ASYNC::AUTO LOGIN CHECKOUT"), Actions.popTo('root')})
                }
            )
    }

    async checkAutoLogin(param){
        let isAuto = await this.getItem("@App:autoLogin")
        console.log("ASYNC::AUTO LOGIN STATUS:",isAuto)
        if(isAuto){
            console.log("ASYNC::GET USER DATA",JSON.stringify(userData))

            let userData = await this.loadAutoLoginInfo()
            param.setState({
                email : userData.id,
                password : userData.pwd,
                autoLogin : true
            })
            await this.login(param)
        }
    }

    //end firebase auth

};
    */
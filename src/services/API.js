import { AsyncStorage ,Alert,ToastAndroid } from 'react-native'
import firebase from '../commons/Firebase'
import FBSDK from 'react-native-fbsdk';
const {
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager,
} = FBSDK;

class API {
    //************ Auth API
    async getAuth(){
        // authState string - facebook/kakao/email/null
        // return obj - {result,authType}
        try {
            return await AsyncStorage.getItem('@Session:authType')
                .then((authState)=>{
                    if (authState != null)
                        return {
                            result: true,
                            authType: authState
                        }
                    else
                        return {
                            result: false,
                            authType: null,
                        }
                })
        }
        catch(err){
            console.log("Get auth failed:",err)
        }
    }

    login(type,callback,data){
        switch(type){
            case'facebook' :
                return this._fbAuth_Login(callback);

            case'kakao' :
                callback(true);
                break;

            case'email' :
                return this._email_Login(data.email,data.password,callback);

            default :
                break;
        }
    }

    logout(type,callback){
        switch(type){
            case'facebook' :
                this._fbAuth_Logout();
                break;

            case'kakao' :
                break;

            case'email' :
                this._email_Logout();
                break;

            default :
                break;
        }
        callback();
    }

    setUserData(currentUser,authType){
        result = currentUser.providerData[0]
        let userConfig = {
            name : result.displayName || 'none',
            email : result.email || 'none',
            photoURL : result.photoURL || 'none',
            uid : result.uid
        }
        AsyncStorage.setItem('@Session:authType',authType)
        AsyncStorage.setItem('@Session:userConfig',JSON.stringify(userConfig))
        console.log("SET USER CONFIG")
        return firebase.database().ref(`users/${result.uid}`).update({
            authType:authType,
            userConfig:userConfig
        })
    }

    _email_Login(email,password,callback){ // @callback param : isCancel(boolean)
        firebase.auth().signInWithEmailAndPassword(email,password)
            .then( (currentUser)=>{
                if(currentUser === 'cancelled'){
                    console.log('Login cancelled');
                    callback(true)
                }
                else {
                    //now signed in
                    callback(false)
                    return this.setUserData(currentUser,'email')
                }
            })
            .catch( (err)=>{
                callback(true)
                if(err.code == 'auth/wrong-password')
                    return Alert.alert('알림','비밀번호가 틀렸습니다.')
                if(err.code == 'auth/user-not-found')
                    return Alert.alert('알림','등록되지 않은 이메일입니다.')
                if(err.code == 'auth/invalid-email')
                    return Alert.alert('알림',"유효 않은 이메일입니다.");
                if (e.code == 'auth/network-request-failed')
                    return Alert.alert('알림',"네트워크 에러가 발생했습니다.");

                return Alert.alert('에러','관리자에게 문의해주세요\n'+JSON.stringify(err))
            })
    }

    _email_Logout(){
        firebase.auth().signOut();
        AsyncStorage.removeItem('@Session:authType')
        AsyncStorage.removeItem('@Session:userConfig')
    }

    _fbAuth_Login(callback){ // @callback param : isCancel(boolean)
        LoginManager
            .logInWithReadPermissions(['public_profile', 'email'])
            .then((result) => {
                if (result.isCancelled) {
                    callback(result.isCancelled)
                    //return Promise.resolve('cancelled');
                }
                console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
                // get the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                // create a new firebase credential with the token
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                // login with credential
                return firebase.auth().signInWithCredential(credential);
            })
            .then((currentUser) => {
                if (currentUser === 'cancelled') {
                    console.log('Login cancelled');
                } else {
                    // now signed in
                    callback(false);
                    return this.setUserData(currentUser,'facebook')
                    //console.warn(JSON.stringify(currentUser.toJSON()));
                }
            })
            .catch((error) => {
                callback(true)
                console.log(`Login fail with error: ${error}`);
                if(error.code=='auth/user-disabled') return ToastAndroid.show('사용 불가능한 계정입니다', ToastAndroid.SHORT)
                return Alert.alert('에러','관리자에게 문의하세요\n에러코드 : '+error.code+'\n'+error.message)
            });

    }

    _fbAuth_Logout(){
        LoginManager.logOut();
        firebase.auth().signOut();
        AsyncStorage.removeItem('@Session:authType')
        AsyncStorage.removeItem('@Session:userConfig')
    }
    get_uid(){
        return firebase.auth().currentUser.uid
    }

    //************ Database API
    async getDataOnce(ref){
        return await firebase.database().ref(ref).orderByKey().once('value', (snapshot)=>{
            return snapshot
        })
    }

    async getDataOn(ref,callback){
        return await firebase.database().ref(ref).on('value', (snapshot)=>callback(snapshot))
    }

    getDataOff(ref,callback){
        return firebase.database().ref(ref).off('value',(snapshot)=>callback(snapshot));
    }

    getPushKey(child){
        return firebase.database().ref(child).push().key
    }

    writeData(ref,data){
        return firebase.database().ref(ref).set(data)
    }

    updateData(data){
        return firebase.database().ref().update(data)
    }

    removeData(ref,data){
        firebase.database().ref(ref+'/'+data).remove()
    }
}

export default new API();
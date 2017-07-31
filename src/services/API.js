import { AsyncStorage } from 'react-native'
import firebase from '../commons/Firebase'
import FBSDK from 'react-native-fbsdk';
import SplashScreen from 'react-native-splash-screen'
const {
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager,
} = FBSDK;

const database = firebase.database();
const firebaseAuth = firebase.auth();

class API {
    //************ Auth API
    async getAuth(){
        // authState string - facebook/kakao/email/null
        // return obj - {result,authType}
        try {
            return await AsyncStorage.getItem('authType')
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

    login(type,callback){
        switch(type){
            case'facebook' :
                return this._fbAuth_Login(callback);

            case'kakao' :
                callback(true);
                break;

            case'email' :
                break;

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
                break;

            default :
                break;
        }
        callback();
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
                let accessToken = data.accessToken
                const responseInfoCallback = (error, result) => {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log(result)
                        let userConfig = {
                            name : result.name,
                            email : result.email,
                            birthday : result.birthday,
                            gender : result.gender,
                            pic : result.picture_small.data
                        }
                        AsyncStorage.setItem('authType','facebook')
                        AsyncStorage.setItem('uid',firebaseAuth.currentUser.uid)
                        AsyncStorage.setItem('userConfig',JSON.stringify(userConfig))
                        console.log("SET USER CONFIG")
                    }
                }
                const infoRequest = new GraphRequest(
                    '/me',
                    {
                        accessToken: accessToken,
                        parameters: {
                            fields: {
                                string: 'name,birthday,gender,email,picture.width(100).height(100).as(picture_small),picture.width(720).height(720).as(picture_large)'
                            }
                        }
                    },
                    responseInfoCallback
                );
                // Start the graph request.
                new GraphRequestManager()
                    .addRequest(infoRequest)
                    .start()

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
                    this.registUser('facebook');
                    callback(false);
                    console.log(JSON.stringify(currentUser.toJSON()));
                }
            })
            .catch((error) => {
                callback(true)
                console.log(`Login fail with error: ${error}`);
            });

    }
    // _fbAuth_Login(callback){
    //     LoginManager.logInWithReadPermissions(['public_profile'])
    //         .then( (res) => {
    //                 SplashScreen.hide()
    //                 if(res.isCancelled){
    //                     console.log("cancelled")
    //
    //                 } else {
    //                     AccessToken.getCurrentAccessToken().then(
    //                         (data) => {
    //                             /*
    //                             function isUserEqual(facebookAuthResponse, firebaseUser) {
    //                                 if (firebaseUser) {
    //                                     var providerData = firebaseUser.providerData;
    //                                     for (var i = 0; i < providerData.length; i++) {
    //                                         if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
    //                                             providerData[i].uid === facebookAuthResponse.userID) {
    //                                             // We don't need to re-auth the Firebase connection.
    //                                             return true;
    //                                         }
    //                                     }
    //                                 }
    //                                 return false;
    //                             }
    //
    //                             var unsubscribe = firebaseAuth.onAuthStateChanged(function(firebaseUser) {
    //                                 unsubscribe();
    //                                 // Check if we are already signed-in Firebase with the correct user.
    //                                 if (!isUserEqual(data, firebaseUser)) {
    //                                     // Build Firebase credential with the Facebook auth token.
    //                                     var credential = firebase.auth.FacebookAuthProvider.credential(
    //                                         data.accessToken);
    //                                     // Sign in with the credential from the Facebook user.
    //                                     firebase.auth().signInWithCredential(credential)
    //                                         .catch(function(error) {
    //                                                 // Handle Errors here.
    //                                                 var errorCode = error.code;
    //                                                 var errorMessage = error.message;
    //                                                 // The email of the user's account used.
    //                                                 var email = error.email;
    //                                                 // The firebase.auth.AuthCredential type that was used.
    //                                                 var credential = error.credential;
    //                                                 console.log("Singin with FB credential ERR:",error)
    //                                             }
    //                                         );
    //                                 }
    //                             });
    //                             */
    //                             let credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
    //                             firebase.auth().signInWithCredential(credential)
    //                                 .then(
    //                                     () => this.registUser('facebook')
    //                                 )
    //                                 .catch( (err)=>{
    //                                     var errorCode = error.code;
    //                                     var errorMessage = error.message;
    //                                     var email = error.email;
    //                                     var credential = error.credential;
    //                                     console.log("Singin with FB credential ERR:",error)
    //                                 })
    //
    //                             let accessToken = data.accessToken
    //                             const responseInfoCallback = (error, result) => {
    //                                 if (error) {
    //                                     console.log(error)
    //                                 } else {
    //                                     console.log(result)
    //                                     let userConfig = {
    //                                         name : result.name,
    //                                         email : result.email,
    //                                         birthday : result.birthday,
    //                                         gender : result.gender,
    //                                         pic : result.picture_small.data
    //                                     }
    //                                     AsyncStorage.setItem('authType','facebook')
    //                                     AsyncStorage.setItem('uid',firebaseAuth.currentUser.uid)
    //                                     AsyncStorage.setItem('userConfig',JSON.stringify(userConfig))
    //                                     console.log("SET USER CONFIG")
    //                                 }
    //                             }
    //
    //                             const infoRequest = new GraphRequest(
    //                                 '/me',
    //                                 {
    //                                     accessToken: accessToken,
    //                                     parameters: {
    //                                         fields: {
    //                                             string: 'name,birthday,gender,email,picture.width(100).height(100).as(picture_small),picture.width(720).height(720).as(picture_large)'
    //                                         }
    //                                     }
    //                                 },
    //                                 responseInfoCallback
    //                             );
    //                             // Start the graph request.
    //                             new GraphRequestManager()
    //                                 .addRequest(infoRequest)
    //                                 .start()
    //                         }
    //                     )
    //                 }
    //                 callback(res.isCancelled)
    //             }
    //         )
    //         .catch( (err) => {
    //             console.log("Facebook Login error",err)
    //         })
    //
    // }

    _fbAuth_Logout(){
        LoginManager.logOut()
        AsyncStorage.removeItem('authType')
        AsyncStorage.removeItem('uid')
        AsyncStorage.removeItem('userConfig')
    }
    get_uid(){
        return firebaseAuth.currentUser.uid
    }

    //************ Database API
    async getData(ref){
        return await database.ref(ref).once('value', (snapshot)=>{
            return snapshot
        })
    }

    writeData(ref,data){
        return database.ref(ref).set(data)
    }

    removeData(ref,data){
        database.ref(ref+'/'+data).remove()
    }

    registUser(authType){
        let uid = firebaseAuth.currentUser.uid
        if(uid){
            database.ref('users/'+uid).update({
                authType:authType
            })
        }
    }

}

export default new API();
import { AsyncStorage } from 'react-native'
import firebase from '../commons/Firebase'
import FBSDK from 'react-native-fbsdk';
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

    _fbAuth_Login(callback){
        LoginManager.logInWithReadPermissions(['public_profile'])
            .then( (res) => {
                if(res.isCancelled){
                    console.log("cancelled")
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
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
                        }
                    )
                    callback();
                }}
            )
            .catch( (err) => {
                console.log("error ocurred")
            })
    }

    _fbAuth_Logout(){
        LoginManager.logOut()
        AsyncStorage.removeItem('authType')
        AsyncStorage.removeItem('userConfig')
    }

    //************ Database API
    async getData(ref){
        return await database.ref(ref).once('value', (snapshot)=>{
                return snapshot
            }
        )}

    writeData(ref,data){
        return database.ref(ref).set(data)
    }

    removeData(ref,data){
        database.ref(ref+'/'+data).remove()
    }

}

export default new API();
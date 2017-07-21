import firebase from '../commons/Firebase'

const database = firebase.database();
const auth = firebase.auth();

class API {
    login(){

    }

    getUser(){

    }

    async getData(ref){
        return await database.ref(ref).once('value', (snapshot)=>{
            return snapshot.val();
        }
    )}

    writeData(ref,data){
        return database.ref(ref).set(data)
    }

}

export default new API();
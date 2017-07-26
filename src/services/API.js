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
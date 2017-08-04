const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.historyWatcher = functions.database.ref('/users/{uid}/history').onWrite(
    (event)=>{
        let snapshot = event.data; //history ref snapshot
        if(snapshot) return setCurrentHistory(snapshot);
        else return;
    }
)
/**
 Obj structure
 currentHistory : [ {emotion:'감정',value:'0-5'}x3 ]
 */

function setCurrentHistory(snapshot){
    var uid = snapshot.ref.parent.key;
    var historyList = snapshot.val()
    var writeRef = admin.database().ref(`users/${uid}/currentHistory`)

    var updateItem = []
    if(historyList) {
        const keys = Object.keys(historyList).sort().reverse()
        for(var i = 0, item; item = historyList[keys[i]]; i++){
            updateItem.push(item)
        }
        updateItem = updateItem.splice(0,3);
    }
    var currentHistory = rankHistory(updateItem)
    return writeRef.set(currentHistory)
}

function rankHistory(item){ // most of 3
    // 0 - current
    // 1 - next current
    // 2 - next next current
    // item[index:0~3].emotions[index:0~3]
    var wholeEmotion = [] // all of the emotions will be pushed here
    var emotionRef = []
    for(var i=0; i<item.length; i++){
        for(var j=0; j<item[i].emotions.length; j++){
            if(i==0){ // x1.2
                insertEmotion(wholeEmotion,emotionRef,item[i].emotions[j],1.2)
            }else if(i==1){ // x1.0
                insertEmotion(wholeEmotion,emotionRef,item[i].emotions[j],1.0)
            }else { // x0.8
                insertEmotion(wholeEmotion,emotionRef,item[i].emotions[j],0.8)
            }
        }
    }
    return wholeEmotion.sort((a,b)=>{return b.value-a.value}).splice(0,3)
}

function insertEmotion(arr,ref,item,mul){
    arr.push();
    /*
     * arr = [ item, item, item, ...]
     * item = { emotion : - , value : - }
     * ref = ['emotion','emotion', ...]
     */
    var emotion = item.emotion
    var value = item.value*mul

    if(ref.includes(emotion)){
        for(var i=0; i<arr.length; i++){
            if(arr[i].emotion == emotion){
                arr[i].value += value;
                break;
            }
        }
    } else {
        ref.push(emotion);
        arr.push({emotion:emotion,value:value})
    }
}
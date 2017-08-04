/**
 * Created by bang9 on 2017-08-03.
 */
import React, {Component} from "react";
import firebase from'../commons/Firebase';
const fcm = firebase.messaging();

class PushAPI {
//     send(senderId: string, payload: RemoteMessage): any
//     NOTIFICATION_TYPE: Object
//     REMOTE_NOTIFICATION_RESULT: Object
//     WILL_PRESENT_RESULT: Object
//     EVENT_TYPE: Object
// }
//
// interface RemoteMessage {
//     id: string,
//     type: string,
//     ttl?: number,
//     sender: string,
//     collapseKey?: string,
//     data: Object,
// }

    async getInitialNotification(){
        try{
            return await fcm.getInitialNotification()
                .then( notification => {return notification} )
        } catch(err){
            console.log("get token err",err)
        }
    }

    async getToken(){
        try{
            return await fcm.getToken()
                .then( token => {return token} )
        } catch(err){
            console.log("get token err",err)
        }
    }

    onRefreshTokenListener(){
        fcm.onTokenRefresh((token) => {
            console.log('Refreshed FCM token: ', token);
        });
    }

    onNotification(){
        return fcm.onMessage(
            (msg) => {
                if(!msg.local_notification){ // when app is fore ground remote->local
                    return firebase.messaging().createLocalNotification({
                        title:msg.fcm.title,
                        body:msg.fcm.body,
                        large_icon: "ic_launcher",   // Android only
                        icon: "ic_launcher",          // as FCM payload, you can relace this with custom icon you put in mipmap
                        vibrate: 300,
                        show_in_foreground:true,
                        priority: "high",
                    })
                }
                if(msg.fire_date!=null) { // this is schedule notification
                    return firebase.messaging().createLocalNotification({
                        title:'HAYTO',
                        body:msg.body,
                        large_icon: "ic_launcher",   // Android only
                        icon: "ic_launcher",          // as FCM payload, you can relace this with custom icon you put in mipmap
                        vibrate: 300,
                        show_in_foreground:true,
                        priority: "high",
                    })
                }
            }
        )
    }

    localNotification(noti){
        fcm.createLocalNotification(noti)
    }

    setScheduleNotification(noti){
        /**
         * @prototype noti
         {
             fire_date: new Date().getTime(),      //RN's converter is used, accept epoch time and whatever that converter supports
             id: "UNIQ_ID_STRING",    //REQUIRED! this is what you use to lookup and delete notification. In android notification with same ID will override each other
             body: "from future past",
             repeat_interval: "week" //day, hour
         }
         */
        fcm.scheduleLocalNotification(noti)
    }

    getScheduleNotification(){
        fcm.getScheduledLocalNotifications()
            .then((notifications) => {
                alert(JSON.stringify(notifications))
                console.log('Current scheduled notifications: ', notifications);
            });
    }

    removeScheduleNotification(id){
        if(id==null) return fcm.cancelLocalNotification('*')
        else return fcm.cancelLocalNotification(id)
    }
}

export default new PushAPI();
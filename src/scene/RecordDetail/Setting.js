import React, {Component} from "react";
import {
    Alert,
    AsyncStorage,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TimePickerAndroid,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import API from "../../services/API";
import PushAPI from "../../services/PushAPI";
import {Actions} from "react-native-router-flux";
const {width,height} = Dimensions.get('window');

class Setting extends Component{
    constructor(){
        super()
        this.state={
            authType:null,
            userConfig: {
                name: null,
                email: null,
                photoURL: null,
                uid: null,
            },
            alarm:{
                hour:0,
                minute:0,
                isSet:false
            }
        }
    }
    componentWillMount(){
        AsyncStorage.getItem('@Session:userConfig')
            .then( (data)=>this.setState({userConfig:JSON.parse(data)}) )
        AsyncStorage.getItem('@Session:authType')
            .then( (data)=>this.setState({authType:data}) )
        AsyncStorage.getItem('@Setting:alarm')
            .then( (data)=>{if(data) this.setState({alarm:JSON.parse(data)})} )
    }

    handleAlarm(){
        // Is set alarm?
        if(this.state.alarm.isSet){ //yes
            PushAPI.removeScheduleNotification('alarm_notification')
            AsyncStorage.removeItem('@Setting:alarm')
            this.setState({alarm:{...this.state.alarm,isSet:false}})
            ToastAndroid.show(`알람이 해제되었습니다`, ToastAndroid.SHORT);
        }else { //no
            this.renderTimePicker(
                () => {
                    let {hour, minute} = this.state.alarm
                    PushAPI.setScheduleNotification({
                        fire_date: this.getAlarmTime(hour, minute), //RN's converter is used, accept epoch time and whatever that converter supports
                        id: "alarm_notification", //REQUIRED! this is what you use to lookup and delete notification. In android notification with same ID will override each other
                        body: "오늘 하루 어떠셨나요?",
                        icon: "ic_launcher",
                        large_icon: "ic_launcher",
                        repeat_interval: "day" // minute,hour,day,week
                    })
                    AsyncStorage.setItem("@Setting:alarm", JSON.stringify({hour: hour, minute: minute, isSet: true}))
                    ToastAndroid.show(`알람이 설정되었습니다`, ToastAndroid.SHORT);
                }
            )
        }
    }

    async renderTimePicker(callback){
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: this.state.alarm.hour,
                minute: this.state.alarm.minute,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                this.setState({alarm:{hour:hour,minute:minute,isSet:true}},callback)
            }
        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
    }

    getAlarmTime(hour,min){ //예약시간
        let now = new Date();
        let alarmStamp;
        // AM - 오전12시~ 오전 11시59분까지 (00:00~11:59)
        // PM - 오후12시~ 오후 11시59분까지 (12:00~23:59)
        if(now.getHours()<hour) { //예약시간이 현재시간 이후이면 오늘부터 알람
            let alarmHour = hour - now.getHours();
            let alarmMin = min - now.getMinutes();
            alarmStamp = now.getTime() + (alarmHour + alarmMin/60)*60*60*1000 - (now.getSeconds()*1000+now.getMilliseconds())
        }
        else if(now.getHours()>hour) { //예약시간이 현재시간 이전이면 내일부터 알람
            let nextDayStamp = now.getTime() + (24-now.getHours())*60*60*1000 - now.getMinutes()*60*1000 - (now.getSeconds()*1000+now.getMilliseconds())//내일 00:00시
            alarmStamp = nextDayStamp + (hour + min/60)*60*60*1000
        }
        else{
            if(now.getMinutes()<min){ //예약시간이 현재시간 이후이면 오늘부터 알람
                let alarmHour = hour - now.getHours();
                let alarmMin = min - now.getMinutes();
                alarmStamp = now.getTime() + (alarmHour + alarmMin/60)*60*60*1000 - (now.getSeconds()*1000+now.getMilliseconds())
            }
            else if(now.getMinutes()>=min){ //예약시간이 현재시간과 같으면 내일부터 알람
                let nextDayStamp = now.getTime() + (24-now.getHours())*60*60*1000 - now.getMinutes()*60*1000 - (now.getSeconds()*1000+now.getMilliseconds())//내일 00:00시
                alarmStamp = nextDayStamp + (hour + min/60)*60*60*1000
            }
        }
        return alarmStamp
    }

    render(){
        let {hour,minute} = this.state.alarm
        let meridiem = hour<12 ? 'AM' : 'PM'
        hour==0 ? hour=12 : hour<10 ? hour='0'+hour : hour>13 ? hour-=12 : hour
        minute<10 ? minute='0'+minute : minute

        const setView = (
            <View style={styles.settingButton}>
                <Text style={{alignSelf:'center'}}>{`${meridiem} ${hour}:${minute}`}</Text>
                <Text style={{position:'absolute',right:20,alignSelf:'center'}}>알람 해제</Text>
            </View>
        )
        const unsetView = (
            <View style={styles.settingButton}>
                <Text style={{alignSelf:'center'}}>알람 설정</Text>
            </View>
        )
        const alarmView = this.state.alarm.isSet ? setView : unsetView
        const profile_photo = this.state.userConfig.photoURL=='none' ? require('../../img/default_profile.png') : {uri:this.state.userConfig.photoURL}
        return(
            <ScrollView style={{backgroundColor:'#fff'}}>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingTitle}>프로필</Text>

                    <View style={styles.profileContainer}>
                        <Image
                            style={styles.profilePhoto}
                            source={profile_photo}
                        />
                        <View style={styles.profileUserConfig}>
                            <Text style={{fontSize:10}}>{"Login with "+this.state.authType}</Text>
                            <Text style={{fontSize:15,color:'#555'}}>{this.state.userConfig.name}</Text>
                        </View>
                        <TouchableOpacity style={{position:'absolute',right:0,alignSelf:'center'}}>
                            <View style={styles.profileButtonWrapper}>
                                <Image
                                    style={styles.profileButton}
                                    source={require('../../img/goButton.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.settingContainer}>
                    <Text style={styles.settingTitle}>알람</Text>
                    <TouchableOpacity
                        onPress={()=>this.handleAlarm()}>
                        {alarmView}
                    </TouchableOpacity>
                </View>

                <View style={styles.settingContainer}>
                    <Text style={styles.settingTitle}>계정</Text>
                    <TouchableOpacity
                        onPress={()=>{API.logout(this.state.authType,()=>Actions.login())}}>
                        <View style={styles.settingButton}>
                            <Text style={{alignSelf:'center'}}>로그아웃</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    __DEV__ &&
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingTitle}>개발자 설정</Text>
                        <TouchableOpacity
                            onPress={() => Actions.storage()}>
                            <View style={styles.settingButton}>
                                <Text style={{alignSelf: 'center'}}>Storage Control</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
                <Spliter/>
            </ScrollView>
        )
    }
}

class Spliter extends Component{
    render(){
        return(
            <View style={{height:1,backgroundColor:'#efefef',}}></View>
        )
    }
}

export default Setting;

const styles = StyleSheet.create({
    settingContainer:{
        justifyContent:'center',
        width:width
    },
    settingTitle:{
        fontSize:12,
        paddingHorizontal:15,
        paddingVertical: 10,
        backgroundColor:'#f5f5f5',
    },
    settingButton:{
        flexDirection:'row',
        paddingHorizontal:20,
        height:50,
        //backgroundColor:'#f9f9f9'
    },
    profileContainer:{
        flexDirection:'row',
        paddingHorizontal:20,
        height:70,
        //backgroundColor:'#f9f9f9'
    },
    profilePhoto:{
        width:50,
        height:50,
        borderRadius:50,
        alignSelf:'center',
        borderWidth:0.5,
        borderColor:'#ccc'
    },
    profileUserConfig:{
        paddingHorizontal:20,
        alignSelf:'center'
    },
    profileButtonWrapper:{
        justifyContent:'center',
        alignItems:'center',
        height:80,
        width:60
    },
    profileButton:{
        width:25,
        height:25,
        tintColor:'#bbb',
    }

})

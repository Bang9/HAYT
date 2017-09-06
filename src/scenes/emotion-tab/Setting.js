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
    View,
    Platform,
    PermissionsAndroid
} from "react-native";
import API from "../../services/API";
import PushAPI from "../../services/PushAPI";
import {Actions} from "react-native-router-flux";
import Contacts from 'react-native-contacts';
import Spinner from "react-native-loading-spinner-overlay";
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
            },
            syncedContact:{
                contacts:[],
                isSet:false
            },
            showSpinner: true,
            dev:0,
        }
    }
    componentWillMount(){
        this.getInitData();
    }

    getInitData(){
        this.setState({showSpinner:true})
        Promise.all([
            AsyncStorage.getItem('@Session:userConfig'),
            AsyncStorage.getItem('@Session:authType'),
            AsyncStorage.getItem('@Setting:alarm'),
            AsyncStorage.getItem('@Setting:contacts')
        ]).then( (data)=>{ // @data = [@Session:userConfig,@Session:authType,@Setting:alarm]
            if(data[2]) this.setState({alarm:JSON.parse(data[2])})
            if(data[3]) this.setState({syncedContact:JSON.parse(data[3])})
                this.setState({userConfig : JSON.parse(data[0]), authType:data[1], showSpinner:false})
            }
        )
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
                        push_type:'alarm',
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

    setPriority(obj){
        var char_ASCII = obj.name.charCodeAt(0);

        //공백
        if (char_ASCII == 32)
            return 0
        //특수기호
        else if ((char_ASCII>=33 && char_ASCII<=47)
            || (char_ASCII>=58 && char_ASCII<=64)
            || (char_ASCII>=91 && char_ASCII<=96)
            || (char_ASCII>=123 && char_ASCII<=126))
            return 1;
        //숫자
        else if (char_ASCII >= 48 && char_ASCII <= 57 )
            return 2;
        //영어(대문자)
        else if (char_ASCII>=65 && char_ASCII<=90)
            return 3;
        //영어(소문자)
        else if (char_ASCII>=97 && char_ASCII<=122)
            return 4;
        //한글
        else if ((char_ASCII >= 12592) || (char_ASCII <= 12687))
            return 5;
        else
            return -1;
    }

    removeContact(){
        Alert.alert(
            '알림',
            '연락처 연동을 해제하시겠어요?', [
                {
                    text: '네',
                    onPress: () => {
                        AsyncStorage.removeItem('@Setting:contacts')
                        this.setState({syncedContact:{contacts:[],isSet:false}}, ()=>{
                            ToastAndroid.show('연동이 해제되었습니다.', ToastAndroid.SHORT)
                        })
                    }
                },
                {
                    text: '아니요'
                }
            ])
    }

    setContact(){
        Alert.alert(
            '알림',
            '연락처를 연동하시겠어요?', [
                {
                    text: '네',
                    onPress: () => {
                        this.setState({showSpinner:true});
                        this.checkContactPermission(
                            (ret, e)=>{
                                if(ret){
                                    Contacts.getAll((err, contacts) => {
                                        console.log("Contact.getAll");
                                        let simpleContacts = [] // arr = [ {name:xxx, phone:xx}... ]

                                        contacts.some((obj,index) => {
                                            if(obj.phoneNumbers[0]!=null) {
                                                let name = '';
                                                if(obj.familyName) name += obj.familyName;
                                                if(obj.givenName) name += obj.givenName;
                                                let phone = obj.phoneNumbers[0].number.replace(/-/gi,''); //remove slash
                                                simpleContacts.push({
                                                    name : name,
                                                    phone : phone
                                                })
                                            }
                                        });

                                        const userPhone = simpleContacts[0];
                                        simpleContacts.splice(0,1)
                                        simpleContacts.sort( (a,b)=>{
                                            if( this.setPriority(a) > this.setPriority(b) ) return -1;
                                            if( this.setPriority(a) < this.setPriority(b) ) return 1;
                                            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                                        })

                                        let uid = API.getUid();
                                        let phoneRef = `users/${uid}/userConfig/phone`;
                                        let usersRef = `userLookUpByPhone/${userPhone.phone}`

                                        API.writeData(phoneRef, userPhone.phone);
                                        API.writeData(usersRef, uid);
                                        this.setFriendsByPhone(simpleContacts);
                                        let contactSetting = {contacts:simpleContacts, isSet:true}
                                        AsyncStorage.setItem('@Setting:contacts',JSON.stringify(contactSetting))

                                        this.setState({syncedContact:contactSetting,showSpinner:false},()=>
                                            ToastAndroid.show('연락처가 연동되었습니다.', ToastAndroid.SHORT)
                                        )
                                        console.log('success get contacts',userPhone)
                                    })
                                }
                                else{
                                    alert('권한이 설정되지 않아 주소록을 불러 올 수 없습니다:');
                                }
                            }
                        )
                    }
                },
                {
                    text: '아니요'
                }
            ]
        );
    }

    async setFriendsByPhone(contacts){
        let uid = API.getUid();
        const snapshot = await API.getDataOnce('userLookUpByPhone');
        const friendsRef = `users/${uid}/friends`;
        if(snapshot){
            const users = snapshot.val();
            let friends = []
            contacts.some((contact,index) => {
                if(users[contact.phone]){
                    contact.uid = users[contact.phone]
                    friends.push(contact)
                }
            });
            API.writeData(friendsRef,friends)
        }
    }

    //android platform
    checkContactPermission(cb) {
        console.log('checking permission')
        if(Platform.OS !== 'ios') {
            this.requestPermission(PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                () => {
                    cb(true)
                },
                (e) => cb(false, e),
                (e) => cb(false, e),
            );
        } else {
            cb(true);
        }
    }

    async requestPermission(permission, onSuccess, onDeny, onError) {
        try {
            console.log('chekcing',await PermissionsAndroid.check(permission))
            const granted = await PermissionsAndroid.request(
                permission
                // {
                //     'title': 'Cool Photo App Camera Permission',
                //     'message': 'Cool Photo App needs access to your camera ' +
                //     'so you can take awesome pictures.'
                // }
            )
            console.log(granted)
            if (granted) {
                console.log("You can use the camera");
                onSuccess();
            } else {
                console.log("Camera permission denied");
                onDeny();
            }
        }
        catch (err) {
            console.warn(err);
            onError();
        }
    }

    render(){
        let {hour,minute} = this.state.alarm
        let meridiem = hour<12 ? 'AM' : 'PM'
        hour==0 ? hour=12 : hour<10 ? hour='0'+hour : hour>13 ? hour-=12 : hour
        minute<10 ? minute='0'+minute : minute


        const alarm_setView = (
            <View style={styles.settingButton}>
                <Text style={{alignSelf:'center'}}>{`${meridiem} ${hour}:${minute}`}</Text>
                <Text style={{position:'absolute',right:20,alignSelf:'center'}}>알람 해제</Text>
            </View>
        )
        const alarm_unsetView = (
            <View style={styles.settingButton}>
                <Text style={{alignSelf:'center'}}>알람 설정</Text>
            </View>
        )

        const alarmView = this.state.alarm.isSet ? alarm_setView : alarm_unsetView;

        const profile_photo = this.state.userConfig.photoURL=='none' ? require('../../img/default_profile.png') : {uri:this.state.userConfig.photoURL}

        return(
            <ScrollView style={{backgroundColor:'#fff'}}>
                <TouchableOpacity style={{height:550}} activeOpacity={1} onPress={()=>this.setState({dev:this.state.dev+1})}>

                    {/* Profile Menu */}
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

                    {/* Notification Menu */}
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingTitle}>알림</Text>
                        <TouchableOpacity
                            onPress={()=>this.handleAlarm()}>
                            {alarmView}
                        </TouchableOpacity>
                    </View>

                    {/* Account Menu */}
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingTitle}>계정</Text>
                        <TouchableOpacity
                            onPress={
                                ()=> {
                                    if(!this.state.syncedContact.isSet)
                                        this.setContact();
                                    else
                                        this.removeContact();
                                }
                            }
                        >
                            <View style={styles.settingButton}>
                                {
                                    !this.state.syncedContact.isSet ?
                                        <Text style={{alignSelf:'center'}}>연락처 연동</Text>
                                        :
                                        <Text style={{alignSelf:'center'}}>연락처 연동해제</Text>
                                }
                            </View>
                        </TouchableOpacity>
                        <Spliter/>
                        <TouchableOpacity
                            onPress={()=>{API.logout(this.state.authType,()=>Actions.login())}}>
                            <View style={styles.settingButton}>
                                <Text style={{alignSelf:'center'}}>로그아웃</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Developer Menu */}
                    {
                        (__DEV__ || this.state.dev>=30) &&
                        <View style={styles.settingContainer}>
                            <Text style={styles.settingTitle}>개발자 설정</Text>
                            <TouchableOpacity
                                onPress={() => Actions.storage()}>
                                <View style={styles.settingButton}>
                                    <Text style={{alignSelf: 'center'}}>Storage Control</Text>
                                </View>
                            </TouchableOpacity>
                            <Spliter/>
                            <TouchableOpacity
                                onPress={() => PushAPI.localNotification({
                                    title:'타이틀',body:'바디',
                                    vibrate: 300,
                                    show_in_foreground:true,
                                    large_icon:'ic_launcher', //large icon null => none  this wiil be app icon
                                    icon:'ic_launcher', //icon null=>ic_launcher inthe mipmap  this will be white small icon
                                    priority: "high", // as FCM payload, you can relace this with custom icon you put in mipmap
                                })}>
                                <View style={styles.settingButton}>
                                    <Text style={{alignSelf: 'center'}}>Local Notification</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                    <Spliter/>
                </TouchableOpacity>
                <Spinner visible={this.state.showSpinner}/>
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
        paddingVertical: 8,
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

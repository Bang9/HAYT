import React, {Component} from "react";
import {RefreshControl, ScrollView, Text, TouchableOpacity, View,StyleSheet,Dimensions,Image, ActivityIndicator,TextInput,TouchableNativeFeedback, ToastAndroid,Alert, AsyncStorage} from "react-native";

import {Actions} from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import API from '../../services/API'
import firebase from'../../commons/Firebase'
const {width,height} = Dimensions.get('window');

class MainTab extends Component{
    constructor(props){
        super(props);
        this.state={
            newMessage:null,
            currentHistory:'loading',
            modalVisible:false,
            comment : "",
            avatar:"default",
            avatarEmotion:'보통',
        }
        this.uid = firebase.auth().currentUser.uid //API.getUid;
        this.avatarList = {
            //this will be list of character x emotion (5*15 = 75)
            'default_행복' : require('../../img/example.gif'),
            'default_설렘' : require('../../img/example.gif'),
            'default_즐거움' : require('../../img/example.gif'),
            'default_소소' : require('../../img/example.gif'),
            'default_평온' : require('../../img/example.gif'),
            'default_만족' : require('../../img/example.gif'),
            'default_지루함' : require('../../img/example.gif'),
            'default_무기력' : require('../../img/example.gif'),
            'default_허탈' : require('../../img/example.gif'),
            'default_걱정' : require('../../img/example.gif'),
            'default_걱정' : require('../../img/example.gif'),
            'default_우울' : require('../../img/example.gif'),
            'default_후회' : require('../../img/example.gif'),
            'default_화남' : require('../../img/example.gif'),
            'default_불쾌' : require('../../img/example.gif'),
            'default_짜증' : require('../../img/example.gif'),
            'monkey' : 'url',
        }
        this.historyRef = `users/${this.uid}/currentHistory`;
        this.avatarRef = `users/${this.uid}/avatar`;
    }
    componentWillMount(){
        API.getDataOn(this.historyRef, (snapshot)=>{
            if(snapshot.val())
                return this.setState({currentHistory:snapshot.val(), avatarEmotion:snapshot.val()[0].emotion})
            return this.setState({currentHistory:null})
        });
        API.getDataOn(this.avatarRef, (snapshot)=>this.setState({avatar:snapshot.val()}));
    }

    componentDidMount(){
    }

    componentWillUnmount(){
        //FIXME :: ref.remove() occur an error when exit
        //API.removeDataOn(this.historyRef)
    }

    render(){
        let selectedAvatar = `${this.state.avatar}_${this.state.avatarEmotion}`;

        //const AVATAR = require(`../../img/${this.state.avatar}_${this.state.avatarEmotion}.gif`)
        return(
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                {/* Background
                 <Image source={require('../../img/background.jpg')} style={styles.backgroundImage} /> */}

                {/* Avatar */}
                <View style={{justifyContent:'center'}}>
                    <Image
                        style={{width:150,height:150, borderRadius : 100}}
                        source={this.avatarList[selectedAvatar]}/>
                </View>

                {/* Current emotion history */}
                <View style={{alignSelf:'center',flexDirection:'row',justifyContent:'flex-start'}}>
                    {
                        /* DONE :: currentHistory structure updated
                         * currentHistory = [ {comment, emotions, stamp},{comment,emotions,stamp}, ... ]
                         * changed next
                         * => currentHistory : [ {emotion:'감정',value:'0-5'}, ...]
                         * => this.state.currentHistory.map( (emotions,i) => {...} ) // emotions = {emotion:'감정',value:'0-5'}
                         */
                        // FIXME :: Render using flatlist more suitable
                        this.state.currentHistory===null ?
                            <Text>입력된 감정이 아직 없어요!</Text>
                            :
                            this.state.currentHistory==='loading' ?
                                <ActivityIndicator size="small" color="#ff8888" />
                                :
                                this.state.currentHistory.map( (emotions,i) => {
                                    return(
                                        <View key={emotions.emotion} style={{height:30,width:60,borderRadius:30, backgroundColor:'#ff8888', alignItems:'center', justifyContent:'center', margin:10}}>
                                            <Text style={{color:'white'}}>{emotions.emotion}</Text>
                                        </View>
                                    )
                                })
                    }
                </View>

                {/* Modal */}
                <CommentModal
                    modalVisible = {this.state.modalVisible}
                    closeModal = {()=>this.close_modal()}
                    onClick = {(diary)=>{this.send_data(diary)}}
                />

                {/* RightButton */}
                <TouchableOpacity
                    style={{position:'absolute', right:0,width: 25, height: 25,}}
                    onPress={()=>this.props.parent.goToPage(1) }>
                    <Image
                        style={{width:25,height:25,position:'absolute',right:10,tintColor:'#ff8888' }}
                        source={require('../../img/goButton.png')}/>
                    <Image
                        style={{width:25,height:25,position:'absolute',right:5 ,tintColor:'#ff8888'}}
                        source={require('../../img/goButton.png')}/>
                </TouchableOpacity>

                {/*  icon reference - http://ionicframework.com/docs/ionicons  */}
                <ActionButton buttonColor="#FF8A8A" verticalOrientation="down" position="right" autoInactive={false}>
                    <ActionButton.Item  buttonColor='#CC92FF' title="쪽지" onPress={()=>this.show_modal()}>
                        <Image
                            style={styles.actionButtonIcon}
                            source={require('../../img/fab_message.png')}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#93CEF9' title="캐릭터" onPress={() => console.log("notes tapped!")}>
                        <Image
                            style={styles.actionButtonIcon}
                            source={require('../../img/fab_avatar.png')}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3ED6AE' title="방문" onPress={() => this.checkContactSync()}>
                        <Image
                            style={styles.actionButtonIcon}
                            source={require('../../img/fab_visit.png')}/>
                    </ActionButton.Item>
                </ActionButton>
            </View>
        )
    }

    async checkContactSync(){
        const contactSetting = await AsyncStorage.getItem('@Setting:contacts')
        if(contactSetting){
            Actions.friends()
        }
        else{
            Alert.alert('알림','설정에서 연락처를 동기화 해주세요')
        }
    }
    changeAvatar(){

    }
    show_modal(){
        this.setState({modalVisible:true})
    }
    close_modal(){
        this.setState({modalVisible:false})
    }
    resetState(){
        this.setState({modalVisible:false},()=>ToastAndroid.show('기록되었습니다.',ToastAndroid.SHORT))
    }
    send_data(letter){
        let data = {
            timeStamp : Date.now(),
            comment : letter,
            visible : true,
        };
        let newPostKey = API.getPushKey('diarys');
        let updates={};
        updates['/diarys/'+newPostKey] = data;
        updates[`/users/${this.uid}/diary/${newPostKey}`] = data;

        return API.updateData(updates)
            .then( ()=>this.resetState() )
            .catch( (err) => Alert.alert("에러발생",JSON.stringify(err)))
    }
}

export default MainTab;

const styles = StyleSheet.create({
    actionButtonIcon:{
        tintColor:'white',
        width:30,
        height:30
    },
    backgroundImage: {
        flex:1,
        width:width,
        height:height,
        position:'absolute'
    },
});


class CommentModal extends Component{
    constructor(props){
        super(props)
        this.state={
            comment:'',
        }
    }
    handlePress(){
        this.props.onClick(this.state.comment);
        this.setState({comment:''});
        this.props.closeModal()
    }
    render(){
        return(
            <Modal
                isVisible={this.props.modalVisible}
                hideOnBack={true}
                onBackButtonPress={this.props.closeModal}>

                <View style ={{justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                    <Text style={{marginTop:20}}>Diary</Text>
                    <TextInput
                        autoFocus={true}
                        style ={{width:270,height:300,margin:20,}}
                        multiline = {true}
                        underlineColorAndroid='#fff'
                        textAlignVertical='top'
                        onChangeText={(text)=>{if(text.length<=120)this.setState({comment:text})}}/>

                    <TouchableNativeFeedback
                        onPress={()=>this.handlePress()}
                        delayPressIn={0}
                        background={TouchableNativeFeedback.SelectableBackground()}>
                        <View style={{backgroundColor:'#1add9d',height:50,width:500,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:16,color:'#fff'}} >확 인</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Modal>
        )
    }
}



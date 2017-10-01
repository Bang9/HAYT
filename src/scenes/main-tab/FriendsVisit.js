import React, {Component} from "react";
import {RefreshControl, ScrollView, Text, TouchableOpacity, View,
    StyleSheet,Dimensions,Image, ActivityIndicator,TextInput,TouchableNativeFeedback, ToastAndroid,Alert} from "react-native";
import {Actions} from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import API from '../../services/API'
import firebase from'../../commons/Firebase'
import Modal from 'react-native-modal'
const {width,height} = Dimensions.get('window');

class FriendsVisit extends Component{
    constructor(props){
        super(props);
        this.state={
            currentHistory:'loading',
            modalVisible:false,
            avatar:'default',
            avatarEmotion:'보통',
            name:''
        }
        this.uid = this.props.friendsUid;
        this.avatarList = {
            //this will be list of character x emotion (5*15 = 75)
            'default_행복' : require('../../img/rabbit_good.gif'),
            'default_설렘' : require('../../img/rabbit_good.gif'),
            'default_즐거움' : require('../../img/rabbit_good.gif'),
            'default_만족' : require('../../img/rabbit_good.gif'),
            'default_소소' : require('../../img/rabbit_soso.gif'),
            'default_평온' : require('../../img/rabbit_soso.gif'),
            'default_지루함' : require('../../img/rabbit_bad.gif'),
            'default_무기력' : require('../../img/rabbit_bad.gif'),
            'default_허탈' : require('../../img/rabbit_bad.gif'),
            'default_걱정' : require('../../img/rabbit_bad.gif'),
            'default_우울' : require('../../img/rabbit_sad.gif'),
            'default_후회' : require('../../img/rabbit_sad.gif'),
            'default_화남' : require('../../img/rabbit_angry.gif'),
            'default_불쾌' : require('../../img/rabbit_angry.gif'),
            'default_짜증' : require('../../img/rabbit_angry.gif'),
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
        API.getDataOn(this.avatarRef, (snapshot)=>{
            if(snapshot.val())
                return this.setState({avatar:snapshot.val()})
        });
    }

    componentDidMount(){
    }

    componentWillUnmount(){
        API.getDataOff()
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

            </View>
        )
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

export default FriendsVisit;

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
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



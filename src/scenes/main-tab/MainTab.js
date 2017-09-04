import React, {Component} from "react";
import {RefreshControl, ScrollView, Text, TouchableOpacity, View,
    StyleSheet,Dimensions,Image, ActivityIndicator,TextInput,TouchableNativeFeedback, ToastAndroid,Alert} from "react-native";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import API from '../../services/API'
import firebase from'../../commons/Firebase'
import Modal from 'react-native-modal'
const {width,height} = Dimensions.get('window');

class MainTab extends Component{
    constructor(props){
        super(props);
        this.state={
            newMessage:null,
            currentHistory:null,
            modalVisible:false,
            comment : "",
            avatar:"default",
        }
        this.uid = firebase.auth().currentUser.uid //API.get_uid;
        this.ref = `users/${this.uid}/currentHistory`;
        this.avatarList = {
            'default' : require('../../img/example.gif'),
            'monkey' : 'url',
        }
    }
    componentWillMount(){
        API.getDataOn(this.ref, (snapshot)=>this.setState({currentHistory:snapshot.val()}));
    }

    componentDidMount(){
    }

    componentWillUnmount(){
        //FIXME :: ref.remove() occur an error when exit
        //API.removeDataOn(this.ref)
    }
    render(){
        return(
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                {/* Background

                    <Image source={require('../../img/background.jpg')} style={styles.backgroundImage} /> */}

                {/* Avatar */}
                <View style={{justifyContent:'center'}}>
                    <Image
                        style={{width:150,height:150, borderRadius : 100}}
                        source={this.avatarList[this.state.avatar]}/>
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
                        this.state.currentHistory!==null ?
                            this.state.currentHistory.map( (emotions,i) => {
                                return(
                                <View key={emotions.emotion} style={{height:30,width:60,borderRadius:30, backgroundColor:'#ff8888', alignItems:'center', justifyContent:'center', margin:10}}>
                                    <Text style={{color:'white'}}>{emotions.emotion}</Text>
                                </View>
                                )
                            })
                            :
                            <ActivityIndicator size="small" color="#ff8888" />
                    }
                </View>

                {/* Modal */}
                <CommentModal
                    modalVisible = {this.state.modalVisible}
                    closeModal = {()=>this.close_modal()}
                    onClick = {(diary)=>{this.send_data(diary)}}
                />

                {/*  icon reference - http://ionicframework.com/docs/ionicons  */}
                <ActionButton buttonColor="#FF8A8A" verticalOrientation="down" position="right" autoInactive={false}>
                    <ActionButton.Item  buttonColor='#CC92FF' title="쪽지보내기" onPress={()=>this.show_modal()}>
                        <Icon name="ios-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#93CEF9' title="캐릭터 설정" onPress={() => console.log("notes tapped!")}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item> 
                    <ActionButton.Item buttonColor='#3ED6AE' title="친구목록" onPress={() => {}}>
                        <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </View>
        )
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
        let uid = API.get_uid();
        let data = {
            timeStamp : Date.now(),
            comment : letter,
            visible : true,
        };
        let newPostKey = API.getPushKey('diarys');
        let updates={};
        updates['/diarys/'+newPostKey] = data;
        updates[`/users/${uid}/diary/${newPostKey}`] = data;

        return API.updateData(updates)
            .then( ()=>this.resetState() )
            .catch( (err) => Alert.alert("에러발생",JSON.stringify(err)))
    }
}

export default MainTab;

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



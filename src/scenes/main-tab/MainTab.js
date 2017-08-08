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
        }
        this.uid = firebase.auth().currentUser.uid//API.get_uid;
        this.ref = `users/${this.uid}/currentHistory`
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
                {/* Rest of the app comes ABOVE the action button component !*/
                    <Image source={require('../../img/background.jpg')} style={styles.backgroundImage} />
                }
                <View style={{flex:2,alignSelf:'flex-start',marginTop:10,flexDirection:'row',justifyContent:'flex-start'}}>
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
                                    <AnimatedCircularProgress
                                        key={i}
                                        style={{margin:10}}
                                        size={60}
                                        width={6}
                                        rotation={0}
                                        friction={8}
                                        fill={emotions.value * 6.66666667}
                                        tintColor={'#ff8888'}
                                        backgroundColor={'#ff888844'}>
                                        {
                                            (fill) => (
                                                <View style={{width:60,height:60,position:'absolute',right:0,left:0,bottom:0,top:0,justifyContent:'center'}}>
                                                    <View >
                                                        <Text style={{alignSelf:'center', fontSize:13}}>
                                                            {emotions.emotion}
                                                        </Text>
                                                        <Text style={{alignSelf:'center', fontSize:10}}>
                                                            {//Math.round(fill/6.66666667)
                                                                (fill/6.66666667).toFixed(1)
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </AnimatedCircularProgress>
                                )
                            })
                            :
                            <ActivityIndicator size="small" color="#ff8888" />
                    }
                </View>

                {/*  icon reference - http://ionicframework.com/docs/ionicons  */}
                <ActionButton buttonColor="rgba(231,76,60,1)" verticalOrientation="down" position="right" autoInactive={false}>
                    <ActionButton.Item  title="Diary" onPress={()=>this.show_modal()}>
                        <Icon name="ios-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
                        <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>

                <View style={{flex:8,justifyContent:'center'}}>
                    <Image
                        style={{width:150,height:150, borderRadius : 100}}
                        source={require('../../img/example.gif')}/>
                </View>

                <CommentModal
                    modalVisible = {this.state.modalVisible}
                    closeModal = {()=>this.close_modal()}
                    onClick = {(diary)=>{this.send_data(diary)}}
                />
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



import React, {Component} from "react";
import {RefreshControl, ScrollView, Text, TouchableOpacity, View, StyleSheet,Dimensions,Image, ActivityIndicator,TextInput,TouchableNativeFeedback} from "react-native";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import API from '../../services/API'
import firebase from'../../commons/Firebase'
import Modal from 'react-native-modal'
const {width,height} = Dimensions.get('window')

class MainTab extends Component{
    constructor(props){
        super(props);
        this.state={
            newMessage:null,
            currentHistory:null,
            modalVisible:false,
        }
        this.uid = firebase.auth().currentUser.uid//API.get_uid;
        this.ref = `users/${this.uid}/currentHistory`
    }
    componentWillMount(){
        API.getDataOn(this.ref, (snapshot)=>this.setState({currentHistory:snapshot.val()}))
    }

    componentDidMount(){
    }

    componentWillUnmount(){
        //FIXME :: ref.remove() occur an error when exit
        //API.removeDataOn(this.ref)
    }
    show_modal(){
        this.setState({modalVisible:true})
    }
    close_modal(){
        this.setState({modalVisible:false})
    }
    render(){
        return(
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                {/* Rest of the app comes ABOVE the action button component !*/
                    <Image source={require('../../img/background.jpg')} style={styles.backgroundImage} />
                }


                <View style={{flex:2,flexDirection:'row',alignItems:'flex-start'}}>

                    {
                        /* DONE :: currentHistory structure updated
                         * currentHistory = [ {comment, emotions, stamp},{comment,emotions,stamp}, ... ]
                         * changed next
                         * => currentHistory : [ {emotion:'감정',value:'0-5'}, ...]
                         * => this.state.currentHistory.map( (emotions,i) => {...} ) // emotions = {emotion:'감정',value:'0-5'}
                         */
                        this.state.currentHistory!=null ?
                        this.state.currentHistory.map( (emotions,i) => {
                            return(
                                <AnimatedCircularProgress
                                    key={i}
                                    style={{marginRight:60, marginTop:10, margin:-40}}
                                    size={60}
                                    width={10}
                                    rotation={0}
                                    friction={8}
                                    fill={emotions.value * 6.66666667}
                                    tintColor={'#ff8888'}
                                    backgroundColor={'#ff888844'}>
                                    {
                                        (fill) => (
                                            <View style={{width:80,height:80,position:'absolute',right:0,left:0,bottom:0,top:0,justifyContent:'center'}}>
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
                        <View style={{alignItems:'center',justifyContent:'center',height:height,marginTop:-60}}>
                        <ActivityIndicator size="small" color="#ff8888" />
                        </View>
                    }
                </View>
                <ActionButton buttonColor="rgba(231,76,60,1)" verticalOrientation="down" position="right" autoInactive={false}>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
                        <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
                        <Icon name="md-done-all" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item  title="Diary" onPress={() => {this.show_modal()}}>
                        <Icon name="md-done-all" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>

                <View style={{flex:5,justifyContent:'center'}}>
                    <Image
                        style={{width:150,height:150, borderRadius : 100}}
                        source={require('../../img/example.gif')}/>
                </View>

                <CommentModal
                    modalVisible = {this.state.modalVisible}
                    closeModal = {()=>this.close_modal()}
                    onClick = {()=>{}}
                />
            </View>
        )
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

    render(){
        return(
            <Modal
                isVisible={this.props.modalVisible}
                hideOnBack={true}>

                <View style ={{justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                    <Text style={{marginTop:20}}>Diary</Text>
                    <TextInput
                        autoFocus={true}
                        style ={{width:270,height:300,margin:20,}}
                        multiline = {true}
                        underlineColorAndroid='#fff'
                        textAlignVertical='top' />

                    <TouchableNativeFeedback
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



import React, {Component} from "react";
import {Dimensions, Text, View,FlatList, TouchableOpacity, TouchableNativeFeedback} from "react-native";
import API from "../../services/API"
import firebase from '../../commons/Firebase'
const {width,height} = Dimensions.get('window');
import EmotionBar from "../../components/EmotionBar";
import Modal from 'react-native-modal'

const timeConverter = (timeStamp)=>{
    let a = new Date(parseInt(timeStamp));

    let dateObj = {
        year : a.getFullYear(),
        month : a.getMonth()+1,
        date : a.getDate(),
    }

    let timeObj = {
        hour : a.getHours(),
        min : a.getMinutes(),
        sec : a.getSeconds()
    }

    let date = `${dateObj.year}/${dateObj.month}/${dateObj.date}`;
    let time = `${timeObj.hour}:${timeObj.min}:${timeObj.sec}`;
    return {date:date,time:time}
}

class History extends Component {
    constructor(){
        super()
        this.state={
            modalVisible:false,
            emotionData : null
        }
        this.data=null
    }
    componentWillMount(){
        let uid = 'userID'
        let ref = `users/${uid}/history`
        API.getData(ref)
            .then( (data) => {
                let items = []
                for( key in obj = data.val()){
                    obj[key].time = key
                    items.push(obj[key]) // recorded item push to array
                }
                this.setState({emotionData:items})
            })
    }

    emotionList(temp){
        let str = []
        for(var i =0; i<3; i++){
            str[i] = temp[i].emotion
        }
        return(
            <EmotionBar
                emotions={str}
                method={(emotion,check)=>this.toggle_emotion(emotion,check)}
                ref={(refs)=>this.barRef[0]=refs}
            />
        )
    }

    show_modal(){
        this.setState({modalVisible:true})
    }
    close_modal(){
        this.setState({modalVisible:false})
    }


    render(){
        return(
            <View>
                <Text>FLATLIST</Text>
                {
                    this.state.emotionData!=null &&
                    <FlatList
                        data = {this.state.emotionData}
                        renderItem = { ({item,index})=> // renderItem return obj{item,index,sperator}
                        <TouchableOpacity
                        onLongPress = {() => this.show_modal() }>
                            <View style={{flex:1,borderWidth:1}}>
                                <Text>{JSON.stringify(timeConverter(item.time))}</Text>
                                {this.emotionList(item.emotions)}
                            </View>
                        </TouchableOpacity>
                        }
                        keyExtractor={(item => item.time)}
                    />
                }

                <CommentModal
                    modalVisible = {this.state.modalVisible}
                    closeModal = {()=>this.close_modal()}
                    onClick = {(comment)=>this.send_data(comment)}
                />
            </View>

        )

    }
}

export default History;

class CommentModal extends Component{
    constructor(props){
        super(props)
        this.state={
            comment:''
        }
    }
    close(){
        this.setState({modalVisible:false})
    }
    render(){
        return(
            <Modal
                isVisible={this.props.modalVisible}
                onBackButtonPress={this.props.closeModal}
                hideOnBack={true}>

                <View style ={{borderRadius : 30,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                    <TouchableNativeFeedback style={{width:300}}>
                        <View style={{width :350, alignItems : "center"}}>
                            <Text style={{fontSize:16,}}>기록 삭제하기</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Modal>
        )
    }
}
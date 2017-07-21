import React, {Component} from "react";
import {Dimensions, Text, View,FlatList} from "react-native";
import Button from "../../components/EmotionBar";
import SelectedEmotion from "../../components/SelectedEmotion";
import API from "../../services/API"
import firebase from '../../commons/Firebase'
const {width,height} = Dimensions.get('window');

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

    render(){
        return(
            <View>
                <Text>FLATLIST</Text>
                {
                    this.state.emotionData!=null &&
                    <FlatList
                        data = {this.state.emotionData}
                        renderItem = { ({item,index})=> // renderItem return obj{item,index,sperator}
                            <View style={{flex:1,borderWidth:1}}>
                                <Text>{JSON.stringify(timeConverter(item.time))}</Text>
                                <Text>{JSON.stringify(item.emotions)}</Text>
                                <Text>{item.comment}</Text>
                            </View>
                        }
                        keyExtractor={(item => item.time)}
                    />
                }
            </View>

        )
    }
}

export default History;
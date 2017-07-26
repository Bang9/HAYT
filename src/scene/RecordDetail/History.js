import React, {Component} from "react";
import {Dimensions, Text, View,FlatList, TouchableOpacity, TouchableNativeFeedback,
    ListView, StyleSheet, Animated,Image,ScrollView} from "react-native";
import API from "../../services/API"
import firebase from '../../commons/Firebase'
const {width,height} = Dimensions.get('window');
import EmotionBar from "../../components/EmotionBar";
import Modal from 'react-native-modal'
import Accordion from 'react-native-accordion';


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

    if(timeObj.hour<10) timeObj.hour = "0"+timeObj.hour;
    if(timeObj.min<10) timeObj.min = "0"+timeObj.min;

    let date = `${dateObj.year}/${dateObj.month}/${dateObj.date}`;
    let time = `${timeObj.hour}:${timeObj.min}`;
    return {date:date,time:time}
}

class History extends Component {
    constructor(){
        super()
        this.state={
            modalVisible:false,
            emotionData : null,
            removeData : null,
            refreshing : false,
        }
        this.data=null
    }

    componentWillMount(){
        this.onRefresh()
    }

    render(){
        return(
            <View>
                <Text style={{alignSelf: "center", fontSize : 20}}>Emotion History</Text>
                {
                    this.state.emotionData!=null &&
                    <FlatList
                        data = {this.state.emotionData}
                        renderItem = { ({item,index})=> // renderItem return obj{item,index,sperator}
                            //this._renderRow(item)
                            <HistoryRow data={item} selected={(key)=>{this.show_modal(key)}}/>
                        }
                        keyExtractor={(item => item.time)}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                    />
                }
                <CommentModal
                    modalVisible = {this.state.modalVisible}
                    closeModal = {()=>this.close_modal()}
                    onClick = {()=>this.removeData()}
                />
            </View>
        )
    }
    onRefresh(){
        this.setState({refreshing:true})
        let uid = 'userID'
        let ref = `users/${uid}/history`
        API.getData(ref)
            .then( (data) => {
                let items = []
                for( key in obj = data.val()){
                    obj[key].time = key
                    items.push(obj[key]) // recorded item push to array
                }
                console.log("items : ",items)
                console.log("key : ",key)
                items.reverse()
                this.setState({emotionData:items,refreshing:false})
            })
    }

    show_modal(key){
        this.setState({removeData:key})
        this.setState({modalVisible:true})
    }
    close_modal(){
        this.setState({modalVisible:false})
    }

    removeData(){
        let uid = 'userID'
        let ref = `users/${uid}/history`
        API.removeData(ref,this.state.removeData);
        this.setState({modalVisible:false},()=>this.onRefresh())
    }

}

export default History;

class HistoryRow extends Component {

    constructor(props){
        super(props)

        this.state = {
            key : null,
            expanded : false,
            animation : new Animated.Value(),
        }
    }

    static propTypes = {
        data: React.PropTypes.object,
    };

    componentWillMount() {
        this.row = this.props.data;

        this.data = {};
        this.data.date = '00/00/00';
        this.data.time = '00:00';
        this.data.emotions = null;
        this.data.comment = 'null';

        this.getRowData();
        this.state.animation.setValue(80)
    }

    componentWillReceiveProps(){
        this.row = this.props.data;
        this.getRowData();
    }

    getRowData(){
        let dateObj = timeConverter(this.row.time);
        this.setState({key:this.row.time}) // this is row key(ex:1500615431030)
        this.data.date = dateObj.date;
        this.data.time = dateObj.time;
        this.data.emotions = this.row.emotions;
        this.data.comment = this.row.comment;
    }
    emotionList(temp){
        let emotions = []
        for(var i =0; i<temp.length; i++){
            emotions[i] = temp[i].emotion
        }
        return(
            <EmotionBar
                emotions={emotions}
                method={()=>{}}
            />
        )
    }


    toggle(){
        let start,end;

        if(!this.state.expanded) {
            start = ROW_CONTAINER_HEIGHT;
            end = ROW_CONTAINER_HEIGHT + ROW_EXPAND_CONTAINER_HEIGHT;
        } else {
            start = ROW_CONTAINER_HEIGHT + ROW_EXPAND_CONTAINER_HEIGHT;
            end = ROW_CONTAINER_HEIGHT;
        }

        this.setState({
            expanded : !this.state.expanded
        });

        this.state.animation.setValue(start);// init val to final val
        Animated.spring(
            this.state.animation,
            {
                toValue: end
            }
        ).start();
    }
    render(){
        return(
            <Animated.View style={{flex:1,borderBottomWidth:1,borderBottomColor:'#efefef',
                height:this.state.animation}}>

                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={()=>this.toggle()}
                    onLongPress={() => this.props.selected(this.state.key)}
                >
                    <View style={styles.midWrapper}>
                        {this.emotionList(this.data.emotions)}
                    </View>

                    <View style={styles.rightWrapper}>
                        <View style={styles.rightItems}>
                            <Image source={require("../../img/nav_group_on.png")}
                                   style={{width:15,height:15}}
                                   resizeMode={"contain"}/>
                        </View>
                        <Text style={styles.rightText}>{this.data.date}</Text>
                        <Text style={styles.rightText}>{this.data.time}</Text>
                    </View>
                </TouchableOpacity>

                <ScrollView style={[styles.rowExpandContainer]}>
                    <Text style={{justifyContent:'center',alignSelf:'center'}}>{this.data.comment}</Text>
                </ScrollView>
            </Animated.View>
        );
    }
}

class CommentModal extends Component{
    render(){
        return(
            <Modal
                isVisible={this.props.modalVisible}
                onBackButtonPress={this.props.closeModal}
                hideOnBack={true}>
                <View style ={{borderRadius : 30,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                    <TouchableNativeFeedback
                        style={{width:300}}
                        onPress ={this.props.onClick}>
                        <View style={{width :350, alignItems : "center"}}>
                            <Text style={{fontSize:16,}}>기록 삭제하기</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Modal>
        )
    }
}
//row container height -> first shown row size
//row expand container height -> hide view
const ROW_CONTAINER_HEIGHT = 80;
const ROW_EXPAND_CONTAINER_HEIGHT = 60;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    flexRight: {
        alignSelf:'flex-end',
    },
    rowContainer:{
        height:ROW_CONTAINER_HEIGHT,
        flexDirection: 'row',
        paddingLeft:15,
        paddingRight:15,
        alignItems:'center',
    },
    leftWrapper:{
        flex:1,
        flexDirection:'row' ,
    },
    leftText:{
        fontSize:13,
    },
    midWrapper:{
        flex:1,
        alignItems:'flex-start',
    },
    midText:{
        fontSize:22,
        color:'#444444',
    },
    rightWrapper:{
        flex:1,
        alignItems:'flex-end',
    },
    rightItems:{
        alignItems:'center',
    },
    rightText:{
        fontSize:13,
        color:'#444444',
    },
    rowExpandContainer:{
        height:ROW_EXPAND_CONTAINER_HEIGHT,
        backgroundColor:'#f1f1f1',
    },
})
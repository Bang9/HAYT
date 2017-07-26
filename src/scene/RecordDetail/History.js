import React, {Component} from "react";
import {Dimensions, Text, View,FlatList, TouchableOpacity, TouchableNativeFeedback,
    ListView, StyleSheet, Animated,Image,ScrollView} from "react-native";
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
            emotionData : null,
            modalVisible:false,
            selectedData : null,
            refreshing : false,
            index : 0,
            listData : [],
        }
        this.initialState = this.state
    }

    componentWillMount(){
        this.onRefresh()
    }

    handleData(){
        let start = this.state.listData.concat()
        let end = this.state.emotionData.slice(this.state.index,this.state.index+10)
        this.setState({
            listData : [
                ...start,
                ...end
            ],
            index:this.state.index + 10
        },console.log(this.state.listData,this.state.index))
    }

    render(){
        return(
            <View>
                {
                    this.state.emotionData!=null&&
                    <FlatList
                        data = {this.state.listData}
                        renderItem = { ({item,index})=> // renderItem return obj{item,index,sperator}
                            //this._renderRow(item)
                            <HistoryRow data={item} selected={(key)=>{this.show_modal(key)}}/>
                        }
                        keyExtractor={(item => item.time)}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        ListEmptyComponent={ ()=>
                            <View style={{height:height-60,alignItems: "center",justifyContent:'center'}}>
                                <Text style={{fontSize : 20,textAlign:'center'}}>{"Add Your\nEmotion History"}</Text>
                            </View>}
                        onEndReached={()=>this.handleData()}
                        onEndReachedThreshold={0.2}
                    />
                }
                <PressModal
                    modalVisible = {this.state.modalVisible}
                    closeModal = {()=>this.close_modal()}
                    onClick = {()=>this.onRemove()}
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
                this.setState({emotionData:items,refreshing:false,index:0,listData:[...items.splice(0,10)]})
            })
    }

    show_modal(key){
        this.setState({selectedData:key})
        this.setState({modalVisible:true})
    }

    close_modal(){
        this.setState({modalVisible:false})
    }

    onRemove(){
        let uid = 'userID'
        let ref = `users/${uid}/history`
        API.removeData(ref,this.state.selectedData);
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
        this.data.date = '0000/00/00';
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
        this.setState({key:this.row.time}) // this is row key(ex:1500615431030)
        let dateObj = timeConverter(this.row.time);
        this.data.date = dateObj.date;
        this.data.time = dateObj.time;
        this.data.emotions = this.row.emotions;
        this.data.comment = this.row.comment;
    }

    renderStateBar(data){
        // const sad=["후회","무기력","허탈","우울"]    // blue
        // const bad=["화남","불쾌","짜증","초조"]      // gray
        // const normal=["소소","평온","지루함"]         // yellow
        // const good=["만족","행복","설렘","즐거움"]   // pink
        // let emotionValue=[0,0,0,0]
        // let backgroundColor
        // for(i=0; i<data.length; i++) {
        //     if (sad.includes(data[i].emotion)) {
        //         emotionValue[0] = emotionValue[0] + data[i].value;
        //     }
        //     else if (bad.includes(data[i].emotion)) {
        //         emotionValue[1] = emotionValue[1] + data[i].value;
        //     }
        //     else if (normal.includes(data[i].emotion)) {
        //         emotionValue[2] = emotionValue[2] + data[i].value;
        //     }
        //     else {
        //         emotionValue[3] = emotionValue[3] + data[i].value;
        //     }
        // }
        // //0 sad, 1 bad, 2 normal, 3 good
        // let max=2
        // for(i=0;i<4;i++){
        //     if(emotionValue[max]<emotionValue[i]) max=i
        // }
        // console.log(data.emotion,max)
        // if(max==0) backgroundColor='#1199bb44';
        // else if(max==1) backgroundColor='#77664444';
        // else if(max==2) backgroundColor='#ffcc2944';
        // else backgroundColor='#ff888844';
        let backgroundColor='#ff888844'

        return(
            <View style={{width:20,height:6,backgroundColor:backgroundColor}}/>
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
                        <EmotionBar
                            emotions={this.data.emotions}
                            type="graph"
                        />
                    </View>

                    <View style={styles.rightWrapper}>
                        {this.renderStateBar(this.data.emotions)}
                        <Text style={styles.dateText}>{this.data.date}</Text>
                        <Text style={styles.timeText}>{this.data.time}</Text>
                    </View>
                </TouchableOpacity>

                <ScrollView style={[styles.rowExpandContainer]}>
                    <Text style={{margin:7}}>{this.data.comment}</Text>
                </ScrollView>
            </Animated.View>
        );
    }
}

class PressModal extends Component{
    render(){
        return(
            <Modal
                isVisible={this.props.modalVisible}
                onBackButtonPress={this.props.closeModal}
                hideOnBack={true}>
                <View style ={{borderRadius:0,alignSelf:'center',alignItems:'center',backgroundColor:'#fff',width:width*.7}}>
                    <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#44aaff',width:width*.7,height:40}}>
                        <Text style={{color:'#fff'}}>메뉴</Text>
                    </View>
                    <TouchableNativeFeedback
                        onPress ={this.props.onClick}>
                        <View style={{justifyContent:'center',alignItems:'center',width:width*.7,height:40}}>
                            <Text style={{fontSize:16}}>삭제</Text>
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
        paddingRight:0
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
    dateText:{
        fontSize:14,
        color:'#666666',
    },
    timeText:{
        fontSize:13,
        color:'#8f8f8f'
    },
    rowExpandContainer:{
        height:ROW_EXPAND_CONTAINER_HEIGHT,
        backgroundColor:'#ffefef',
    },
})
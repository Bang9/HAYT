import React, {Component} from "react";
import { AppRegistry, StyleSheet, ScrollView , StatusBar, Text, View,Dimensions } from 'react-native';
import Pie from 'react-native-pie'
import Bar from 'react-native-chart'

import DateModal from '../../components/DateModal'
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons'

const {width,height} = Dimensions.get('window')
import API from '../../services/API'
import firebase from'../../commons/Firebase'
import Button from "../../components/Button";


class Chart extends Component {

    constructor(props){
        super(props);
        this.state={
            allData:[],
            sortedData :[],
            scoreData : [],

            startDate:null,
            endDate:null,

            modalVisible : false, //chart modal

            emotionScore : {'행복':0,'설렘':0,'즐거움':0,'소소':0,'평온':0,
                '만족':0,'지루함':0,'무기력':0,'허탈':0,'걱정':0,
                '우울':0,'후회':0,'화남':0,'불쾌':0,'짜증':0,},
            emotionCount : {'행복':0,'설렘':0,'즐거움':0,'소소':0,'평온':0,
                '만족':0,'지루함':0,'무기력':0,'허탈':0,'걱정':0,
                '우울':0,'후회':0,'화남':0,'불쾌':0,'짜증':0,},
            emotions : ['행복','설렘','즐거움','소소','평온',
                '만족','지루함','무기력','허탈','걱정',
                '우울','후회','화남','불쾌','짜증'],
            isLoaded:false,
            isErrored:false,
        }

        this.uid = firebase.auth().currentUser.uid;
        this.ref = `users/${this.uid}/history`;
        this.beforeWeekDate = moment(0,"HH").day(-( 7 - new Date().getDay() ));
    }

    componentWillMount(){
        this.dateSetting(this.beforeWeekDate,moment(0,"HH"))
    }

    sortData(allData){
        this.setState({
                emotionCount:{'행복':0,'설렘':0,'즐거움':0,'소소':0,'평온':0,
                '만족':0,'지루함':0,'무기력':0,'허탈':0,'걱정':0,
                '우울':0,'후회':0,'화남':0,'불쾌':0,'짜증':0,},
                emotionScore:{'행복':0,'설렘':0,'즐거움':0,'소소':0,'평온':0,
                '만족':0,'지루함':0,'무기력':0,'허탈':0,'걱정':0,
                '우울':0,'후회':0,'화남':0,'불쾌':0,'짜증':0,}},
            ()=>{
                let {emotionScore, emotionCount,emotions} = this.state;
                console.log('INIT STATE',this.initialState)
                console.log("sort data",emotionScore,"\n",emotionCount)
                for(var a = 0; a<allData.length; a++) {
                    for (var i = 0; i < allData[a].length; i++) {
                        emotionScore[allData[a][i].emotion]+=allData[a][i].value;
                        emotionCount[allData[a][i].emotion]+=1;
                    }
                }
                this.sortObject();
            });
    }

    sortObject(){
        let sortedEmotion = [];
        let score = [];

        for (key in this.state.emotionScore) {
            score.push([key,this.state.emotionCount[key]])
            sortedEmotion.push([key, this.state.emotionScore[key]]);
        }

        sortedEmotion.sort(function(a, b) {
            return b[1] - a[1];
        })

        score.sort(function(a, b) {
            return b[1] - a[1];
        })
        this.setState({emotionScore: sortedEmotion, emotionCount:score, isLoaded:true})
    }

    show_modal(){
        this.setState({modalVisible:true})
    }
    close_modal(){
        this.setState({modalVisible:false})
    }

    dateSetting(start,end){
        if(start != null && end !=null) {
            this.setState({startDate: start, endDate:end, isLoaded:false})
            this.close_modal();
            console.log("start : ", start + " / " + end)
            return firebase.database().ref(`users/${this.uid}/history`)
                .orderByKey().startAt(`${start}`).endAt(`${end}`).once()
                .then(
                    (snapshot) => {
                        let data = snapshot.val()
                        let keys = Object.keys(data)
                        let allData = []
                        for (i in keys)
                            allData.push(data[keys[i]].emotions)
                        this.setState({allData, isErrored: false},()=>{
                            console.log("all Data : ", allData)
                            this.sortData(this.state.allData)
                        })
                    }
                )
                .catch(error => this.setState({isErrored: true},()=>console.log(error,this.state.startDate)))
        }
    }

    render() {
        const {emotionCount, emotionScore} = this.state;
        let point = 0;
        let data = [[],[],[],[],[]];
        if(this.state.isLoaded) {

            console.log("emotioncount : ", emotionCount)
            data = [
                [emotionCount[0][0], emotionCount[0][1]],
                [emotionCount[1][0], emotionCount[1][1]],
                [emotionCount[2][0], emotionCount[2][1]],
                [emotionCount[3][0], emotionCount[3][1]],
                [emotionCount[4][0], emotionCount[4][1]],
            ];

            point = 100 / (emotionScore[0][1] + emotionScore[1][1] + emotionScore[2][1] + emotionScore[3][1] +
                emotionScore[4][1] + emotionScore[5][1] + emotionScore[6][1] + emotionScore[7][1]);
        }

        return(
            <View style={{flex:1}}>
                {
                    !this.state.isErrored ?
                        <ScrollView >
                            {
                                this.state.isLoaded &&

                                <View style={{marginTop: 30, alignItems: "center"}}>
                                    {
                                        this.state.startDate && this.state.endDate &&
                                        <View>
                                            <Text style ={{textAlign:"center",width:width,fontSize:13,marginBottom:10,}}>{this.state.startDate.format('L') + " ~ " +this.state.endDate.format('L')}</Text>

                                        </View>
                                    }
                                    <Pie
                                        radius={100}
                                        series={[
                                            point * emotionScore[0][1],
                                            point * emotionScore[1][1],
                                            point * emotionScore[2][1],
                                            point * emotionScore[3][1],
                                            point * emotionScore[4][1],
                                            point * emotionScore[5][1],
                                            point * emotionScore[6][1],
                                            point * emotionScore[7][1],
                                        ]}
                                        colors={['#3498DB', '#F1C40F', "#336E7B", '#E74C3C', '#1ABC9C', "#5696D4", "#A260AA", "#D1D5D8"]}/>

                                    <View style={{flexDirection:'row',marginTop:10}}>
                                        <View style={{marginHorizontal:5}}>
                                            <EmotionBox color='#3498DB' emotionScore={emotionScore[0]}/>
                                            <EmotionBox color='#F1C40F' emotionScore={emotionScore[1]}/>
                                        </View>
                                        <View style={{marginHorizontal:5}}>
                                            <EmotionBox color='#336E7B' emotionScore={emotionScore[2]}/>
                                            <EmotionBox color='#E74C3C' emotionScore={emotionScore[3]}/>
                                        </View>
                                        <View style={{marginHorizontal:5}}>
                                            <EmotionBox color='#1ABC9C' emotionScore={emotionScore[4]}/>
                                            <EmotionBox color='#5696D4' emotionScore={emotionScore[5]}/>
                                        </View>
                                        <View style={{marginHorizontal:5}}>
                                            <EmotionBox color='#A260AA' emotionScore={emotionScore[6]}/>
                                            <EmotionBox color='#D1D5D8' emotionScore={emotionScore[7]}/>
                                        </View>
                                    </View>
                                </View>

                            }

                            {
                                this.state.isLoaded &&
                                < View >
                                    < Text style={{textAlign: "center", marginTop: 50}}>
                                        기간 별 감정 선택 횟수
                                    </Text>

                                    <Bar
                                        style={{height: 100, marginTop: 20,marginRight:20}}
                                        data={data}
                                        verticalGridStep={1}
                                        type="bar"
                                    />
                                </View>
                            }
                        </ScrollView>
                        :
                        <View style = {{justifyContent : "center",flex:1}}>
                            <Text style ={{textAlign:"center",}}>기록이 없습니다.</Text>
                        </View>
                }
                <DateModal
                    onClose={()=>this.close_modal()}
                    modalVisible = {this.state.modalVisible}
                    dateSetting = {(start, end)=>this.dateSetting(start, end)}
                />

                <View style={{width:width, position:"absolute", bottom:0}}>
                    <Button
                        color="#ff8888"
                        buttonStyle={{width: width, borderRadius:0,height:50}}
                        title="기간 설정"
                        onClick={()=>this.show_modal()}
                        icon = {<Icon name="md-calendar" style={{fontSize:20,color:'#fff'}}/>}
                    />
                </View>
            </View>

        )
    }
}
class EmotionBox extends Component {
    constructor(props){
        super(props);
    }
    render(){

        const view = (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 10, height: 10, backgroundColor: this.props.color, marginHorizontal: 5}}/>
                <Text> {this.props.emotionScore[0]}</Text>
            </View>
        )
        const renderView = this.props.emotionScore[1]==0 ? null : view
        return (
            renderView
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    gauge: {
        position: 'absolute',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    gaugeText: {
        backgroundColor: 'transparent',
        color: '#000',
        fontSize: 24,
    },
})
export default Chart;

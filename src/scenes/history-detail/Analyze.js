import moment from 'moment';
import React, { Component } from "react";
import { AppRegistry, Dimensions, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import firebase from '../../commons/Firebase'
import Button from "../../components/Button";

import DateModal from '../../components/DateModal'
// Charts
import AreaSpline from '../../components/graph/charts/AreaSpline';
import Pie from '../../components/graph/charts/Pie';
import Theme from '../../components/graph/theme';

const {width,height} = Dimensions.get('window')

const emotions = [
    '행복','설렘','즐거움','소소','평온',
    '만족','지루함','무기력','허탈','걱정',
    '우울','후회','화남','불쾌','짜증'
]

class Analyze extends Component {

    constructor(props){
        super(props);
        // @State
        // start,end date - moment
        // modalVisible - boolean
        // activeIndex - number
        // pieData - [{emotion,value}, ...]
        // splineData -
        this.state={
            startDate:null,
            endDate:null,

            modalVisible : false,
            isLoaded:false,
            isErrored:false,

            pieData:[{emotion:'loading',value:0}],
            splineData:{"emotion":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
            activeIndex:0,
        }
        this.uid = firebase.auth().currentUser.uid;
    }

    componentWillMount(){
        this.getData(this._initStartDate(),this._initEndDate())
    }

    _initStartDate(){
        var a = new Date();
        a.setDate(a.getDate()-6);
        a.setHours(0);
        a.setMinutes(0);
        a.setSeconds(0);
        a.setMilliseconds(0);
        return moment(a);
    }

    _initEndDate(){
        var a = new Date();
        a.setHours(23);
        a.setMinutes(59);
        a.setSeconds(59);
        a.setMilliseconds(999);
        return moment(a);
    }

    getData(start,end){
        if(start != null && end !=null) {
            this.setState({startDate: start, endDate:end, isLoaded:false})
            this.close_modal();

            return firebase.database().ref(`users/${this.uid}/history`)
                .orderByKey().startAt(`${start}`).endAt(`${end}`).once()
                .then((snapshot) => {
                    let data = snapshot.val();
                    if(data){
                        this.setState({
                            isLoaded:true,
                            isErrored:false,
                            pieData:this.getPieData(data),
                            splineData:this.getSplineData()
                        })
                    }
                })
                .catch(error => this.setState({isErrored: true, isLoaded:false},()=>console.log(error)))
        }
    }

    getPieData(data){
        let keys = Object.keys(data).sort();
        let pieData = [];
        let countObj = {};
        emotions.some(emotion => countObj[emotion]=0);

        for (i in keys){
            emotionByDay = data[keys[i]].emotions;
            emotionByDay.some((curr)=>{
                countObj[curr.emotion] += curr.value;
            })
        }

        for(emotion in countObj){
            if(countObj[emotion]!=0)
                pieData.push({emotion:emotion,value:countObj[emotion]})
        }

        pieData.sort((a,b)=>{
            return b.value - a.value;
        })
        console.log('getPieData',pieData.slice(0,8))
        return pieData.slice(0,8);
    }

    async getSplineData(){
        let startUnix= this.state.startDate.valueOf();
        let endUnix = this.state.endDate.valueOf();
        let term = (endUnix-startUnix)/20;

        let splineData = {};
        emotions.some(emotion =>{ splineData[emotion]=[]; });
        for(emotion in splineData){
            splineData[emotion] = Array.apply(null, new Array(20)).map(Number.prototype.valueOf,0);
        }

        for(var i=0; i<20; i++) {
            let start = startUnix+(i*term);
            let end = startUnix+((i+1)*term);
            let snapshot = await firebase.database().ref(`users/${this.uid}/history`)
                .orderByKey().startAt(`${start}`).endAt(`${end}`).once();

            //해당 splineData[index]=0으로 초기화 하고, data 있으면 해당 splineData[index]값 바꿔줌
            let data = snapshot.val();
            if(data){
                console.log('this time data:', data)
                for(index in data){
                    emotionByTerm = data[index].emotions;
                    emotionByTerm.some((curr)=>{
                        if(i-2>=0) splineData[curr.emotion][i-2] += curr.value*2.5;
                        if(i-1>=0) splineData[curr.emotion][i-1] += curr.value*7.5;
                        splineData[curr.emotion][i] += curr.value*15;
                        if(i+1<20) splineData[curr.emotion][i+1] += curr.value*10;
                        if(i+2<20) splineData[curr.emotion][i+2] += curr.value*7.5;
                    })
                }
            }
        }
        console.log(splineData);
        return splineData;
    }

    show_modal(){
        this.setState({modalVisible:true})
    }
    close_modal(){
        this.setState({modalVisible:false})
    }

    _onPieItemSelected(newIndex){
        this.setState({activeIndex: newIndex});
    }

    render() {
        return(
            <View style={{flex:1}}>
                {
                    this.state.isLoaded ?
                        <ScrollView>
                            <View style={{width:width*.5,height:30,justifyContent:'center',alignItems:'center',marginVertical:20,borderRadius:20,alignSelf:'center',backgroundColor:'#cfcfcf'}}>
                                <Text style={{fontSize:14,fontWeight:'bold',color:'#fff'}}>
                                    {this.state.startDate.format("YYYY/MM/DD")} - {this.state.endDate.format("MM/DD")}
                                </Text>
                            </View>
                            <Pie
                                pieWidth={150}
                                pieHeight={150}
                                onItemSelected={(index) => this._onPieItemSelected(index)}
                                colors={Theme.colors}
                                width={200}
                                height={200}
                                data={this.state.pieData}/>
                            <View style={{height:1,backgroundColor:'#ddd',margin:20}}/>
                            <AreaSpline
                                title={this.state.pieData[this.state.activeIndex].emotion}
                                width={width}
                                height={150}
                                data={this.state.splineData}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                color={Theme.colors[this.state.activeIndex]} />
                        </ScrollView>
                        :
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <Text style={{lineHeight:25,textAlign:'center'}}>해당 기간에 기록이 없습니다.{'\n'}기간을 선택해 주세요</Text>
                        </View>
                }

                <View style={{width:width, position:"absolute", bottom:0}}>
                    <Button
                        color="#ff8888"
                        buttonStyle={{width: width, borderRadius:0,height:50}}
                        title="기간 설정"
                        onClick={()=>this.show_modal()}
                        icon = {<Icon name="md-calendar" style={{fontSize:20,color:'#fff'}}/>}
                    />
                </View>

                <DateModal
                    onClose={()=>this.close_modal()}
                    modalVisible = {this.state.modalVisible}
                    dateSetting = {(start, end)=>this.getData(start, end)}
                />
            </View>

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
export default Analyze;

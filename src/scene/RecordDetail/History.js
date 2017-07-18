/**
 * Created by mycom on 2017-07-14.
 */

import React, {Component} from "react";
import Button from "../../components/emotionButton";
import SelectedEmotion from'../../components/SelectedEmotion'
//import firebase from'../Components/Firebase'

import {
    Alert,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Image,
}
    from "react-native";
const {width,height} = Dimensions.get('window');
class History extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cb: null,
            value: 0,
            emotion: [],
            check: 0,
        }
    }

    select_emotion(title) {
        if(this.state.emotion.length>=3)
            return;

        for(i in obj = this.state.emotion){
            if(obj[i] == title) return
        }
        this.state.emotion.push(title)
        this.setState({check: this.state.check + 1})
        console.log("title", this.state.emotion, "  check", this.state.check)
    }

    reset() {
        let temp = []
        this.setState({emotion: temp, check: 0})
        console.log("title", this.state.emotion, "  check", this.state.check)
    }

    remove_emotion(emotion) {
        let emoList = this.state.emotion.concat();
        for(i in emoList ){
            if(emoList[i] == emotion) {
                emoList.splice(i, 1);
            }
        }
        this.setState({emotion:emoList})
    }

    render() {
        return (
            <View>
                <Text style={{alignSelf:'center'}}>{"\n\n"}감정을 세개 선택해주세요{"\n\n"}</Text>
                <Text>{Date()}</Text>
                <View style={{flexDirection: "row"}}>
                    <Button
                        title="행복"
                        color="#488aff"
                        onPress={() => this.select_emotion("행복")}/>
                    <Button
                        title="설렘"
                        color="#488aff"
                        onPress={() => this.select_emotion("설렘")}/>
                    <Button
                        title="즐거움"
                        color="#488aff"
                        onPress={() => this.select_emotion("즐거움")}/>
                    <Button
                        title="소소"
                        color="#488aff"
                        onPress={() => this.select_emotion("소소")}/>
                    <Button
                        title="평온"
                        color="#488aff"
                        onPress={() => this.select_emotion("평온")}/>
                </View>

                <View style={{flexDirection: "row"}}>
                    <Button
                        title="만족"
                        color="#488aff"
                        onPress={() => this.select_emotion("만족")}/>
                    <Button
                        title="지루함"
                        color="#488aff"
                        onPress={() => this.select_emotion("지루함")}/>
                    <Button
                        title="무기력"
                        color="#488aff"
                        onPress={() => this.select_emotion("무기력")}/>
                    <Button
                        title="허탈"
                        color="#488aff"
                        onPress={() => this.select_emotion("허탈")}/>
                    <Button
                        title="초조"
                        color="#488aff"
                        onPress={() => this.select_emotion("초조")}/>
                </View>

                <View style={{flexDirection: "row"}}>
                    <Button
                        title="우울"
                        color="#488aff"
                        onPress={() => this.select_emotion("우울")}/>
                    <Button
                        title="후회"
                        color="#488aff"
                        onPress={() => this.select_emotion("후회")}/>
                    <Button
                        title="화남"
                        color="#488aff"
                        onPress={() => this.select_emotion("화남")}/>
                    <Button
                        title="불쾌"
                        color="#488aff"
                        onPress={() => this.select_emotion("불쾌")}/>
                    <Button
                        title="짜증"
                        color="#488aff"
                        onPress={() => this.select_emotion("짜증")}/>
                </View>
                {
                    this.state.emotion.map( (obj,i)=>{
                        return (
                            <SelectedEmotion
                            emotion={obj}
                            key={i}
                            onRemove={(emotion)=>this.remove_emotion(emotion)} />
                        )
                    })
                }
            </View>
        )
    }
}


export default History;
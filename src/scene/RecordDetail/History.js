/**
 * Created by mycom on 2017-07-14.
 */

import React, {Component} from "react";
import Button from "../../components/Button";
//import firebase from'../Components/Firebase'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
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
            radio_val : [
                { label : 1, value: 1 },
                { label : 2, value: 2 },
                { label : 3, value: 3 },
                { label : 4, value: 4 },
                { label : 5, value: 5 }],
            value : 0,
            emotion : [],
            check :0,

        }
    }

    select_emotion(title){
        this.state.emotion.push(title)
        this.setState({check : this.state.check +1})
        console.log("title", this.state.emotion, "  check" , this.state.check)
    }

    reset(){
        let temp =[]
        this.setState({emotion: temp , check : 0 })
        console.log("title", this.state.emotion, "  check" , this.state.check)
    }
    /*
     saveData(){
     var postData = {
     emotion1 : this.state.emotion[0],
     emotion2 : this.state.emotion[1],
     emotion3 : this.state.emotion[2]
     };

     var newPostKey = firebase.database().ref().child('posts').push().key;
     this.setState({key:newPostKey})
     var updates = {};
     updates['/posts/' + newPostKey] = postData;

     firebase.database().ref('/users-posts/').once('value',
     (ret)=>{
     alert(JSON.stringify(ret.val()))
     if(ret.val() != null){
     let x =ret.val()
     x.push(this.state.key)
     this.setState({temp : x})
     firebase.database().ref('/users-posts/').update(x)
     }else{
     let x = []
     x.push(this.state.key)
     this.setState({temp : x})
     firebase.database().ref('/users-posts/').update(x)
     }
     })
     return firebase.database().ref().update(updates);
     }
     */

    render(){
        return(
            <View>
                <Text>{Date()}</Text>

                <View style = {{flexDirection : "row"}}>
                    <Button
                        title="행복"
                        color="#488aff"
                        onPress={() => this.select_emotion("행복")} />
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

                <View style = {{flexDirection : "row"}}>
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

                <View style = {{flexDirection : "row"}}>
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

                <View style = {{flexDirection :"row"}}>
                    <Button title={this.state.emotion[0]} color="#488aff"/>
                    <RadioForm
                        radio_props={this.state.radio_val}
                        initial={0}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={'#2196f3'}
                        animation={true}
                        onPress={(value) => {this.setState({value:value})}}
                    />
                </View>

                <View style = {{flexDirection :"row"}}>
                    <Button title={this.state.emotion[1]} color="#488aff"/>
                    <RadioForm
                        radio_props={this.state.radio_val}
                        initial={0}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={'#2196f3'}
                        animation={true}
                        onPress={(value) => {this.setState({value:value})}}
                    />
                </View>

                <View style = {{flexDirection :"row"}}>
                    <Button title={this.state.emotion[2]} color="#488aff"/>
                    <RadioForm
                        radio_props={this.state.radio_val}
                        initial={0}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={'#2196f3'}
                        animation={true}
                        onPress={(value) => {this.setState({value:value})}}
                    />
                </View>

                <View style ={{flexDirection:"row" }}>
                    <Button title="재선택" color="#488aff" onPress={()=>this.reset()}/>
                    <Button title="완료" color="#488aff" onPress={()=>{}}/>
                </View>
            </View>
        )
    }
}


export default History;
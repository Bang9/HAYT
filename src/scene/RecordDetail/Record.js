import React, {Component} from "react";
import {Dimensions, Text, View, TouchableNativeFeedback, FlatList, Animated, TextInput} from "react-native";
import Modal from 'react-native-modal'
import EmotionBar from "../../components/EmotionBar";
import SelectedEmotion from "../../components/SelectedEmotion";
import Button from '../../components/Button'
const {width,height} = Dimensions.get('window');

class Record extends Component{
    constructor(props) {
        super(props)
        this.state = {
            selectedEmotions: [], // [{emotion:'',value:0} ...]
            test:null,
            modalVisible:false,
        }
        this.rowRef=[];
        this._animated = new Animated.Value(0);
    }

    timeConverter(timeStamp){
        let a = new Date(timeStamp);
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
        let time = `${timeObj.houor}:${timeObj.min}:${timeObj.sec}`;
        return date+time
    }

    toggle_emotion(emotion,check){
        //이미 선택되어 있는 감정이면 제거
        for(i in row = this.rowRef){
            if(row[i]!=null && row[i].state.emotion == emotion) {
                check(); //버튼 체크 해제
                row[i].onRemove(); //제거
                return;
            }
        }
        //3개 이상이면 return
        if(this.state.selectedEmotions.length>=3) return;

        //같거나 3개 이상이 아니면 새로 추가하고, 버튼 체크
        this.setState({
            selectedEmotions:this.state.selectedEmotions.concat({emotion:emotion,value:0})
        },check())
    }

    remove_emotion(index){
        const start = this.state.selectedEmotions.slice(0, index);
        const end = this.state.selectedEmotions.slice(index + 1);
        this.setState({
            selectedEmotions: start.concat(end),
        });
    }

    onChange(value,index){
        let emoList = this.state.selectedEmotions.concat();
        emoList[index].value = value;
        this.setState({selectedEmotions:emoList})
    }

    componentDidUpdate(){
        if(this.state.selectedEmotions.length==0) this.hide_button();
        else this.show_button();
    }

    render() {
        //console.log("EMOLIST", this.state.selectedEmotions)
        //console.log("REF",this.rowRef)
        return (
            <View style={{flex:1}}>
                <View style={{flex:0.5}}>
                    <Text style={{alignSelf:'center'}}>{"\n\n"}감정을 최대 세개 선택해 주세요{"\n"}</Text>

                    <View style={{margin:10, alignSelf:'center'}}>
                        {/*<Text style={{alignSelf:'flex-end'}}>{this.timeConverter(Date.now())}</Text>*/}
                        <EmotionBar
                            emotions={["행복","설렘","즐거움","소소","평온"]}
                            method={(emotion,check)=>this.toggle_emotion(emotion,check)}
                        />
                        <EmotionBar
                            emotions={["만족","지루함","무기력","허탈","초조"]}
                            method={(emotion,check)=>this.toggle_emotion(emotion,check)}
                        />
                        <EmotionBar
                            emotions={["우울","후회","화남","불쾌","짜증"]}
                            method={(emotion,check)=>this.toggle_emotion(emotion,check)}
                        />
                    </View>
                </View>

                <View style={{flex:0.3, alignSelf:'center'}}>
                    <FlatList
                        data={this.state.selectedEmotions}
                        renderItem={({ item, index }) => (
                            <SelectedEmotion
                                ref={(refs)=>this.rowRef[index] = refs}
                                emotion={item.emotion}
                                value={item.value}
                                onChange={(value) => this.onChange(value,index)}
                                onRemove={()=>this.remove_emotion(index)}/>
                        )}
                        keyExtractor={(item) => item.emotion}
                    />
                </View>

                <Animated.View style={[{flex:0.2, justifyContent:'center',alignItems:'center'},
                    {
                        width: this._animated.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 370],
                            extrapolate: 'timing',
                        }),
                    },
                    { opacity: this._animated }]}>

                    <Button
                        title="다음"
                        onClick={() => this.show_modal()}/>
                </Animated.View>
                <CommentModal
                    modalVisible = {this.state.modalVisible}
                    closeModal = {()=>this.close_modal()}
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

    show_button(){
        Animated.timing(this._animated, {
            toValue: 1,
            duration: 300,
        }).start();
    }

    hide_button(){
        Animated.timing(this._animated, {
            toValue: 0,
            duration: 300,
        }).start();
    };

}

export default Record

class CommentModal extends Component{
    constructor(props){
        super(props)
        this.state={
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

                <View style ={{justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                    <Text style={{marginTop:20}}>COMMENT</Text>
                    <TextInput
                        autoFocus={true}
                        style ={{width:270,height:150,margin:20,}}
                        multiline = {true}
                        underlineColorAndroid='#fff'
                        textAlignVertical='top'
                        returnKeyType='search'/>

                    <TouchableNativeFeedback
                        delayPressIn={5000}
                        background={TouchableNativeFeedback.SelectableBackground()}
                        onPress={this.props.onClick}>
                        <View style={{backgroundColor:'#44aaff',height:50,width:500,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:16,color:'#fff'}}>확 인</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Modal>
        )
    }
}


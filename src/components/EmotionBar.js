import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from "react-native";
import { AnimatedCircularProgress,CircularProgress } from 'react-native-circular-progress';

class EmotionBar extends Component{
    constructor(props){
        super(props);
        this.buttonRef = []
    }

    buttonReset(){
        for(i in ref = this.buttonRef){
            if(ref[i]!=null) ref[i].unCheck()
        }
    }
    render(){
        let view = null;
        if(this.props.type=='button') {
            view = (
                this.props.emotions.map((emotions, i) => {
                    return (
                        <EmotionButton
                            key={i}
                            emotion={emotions}
                            color="#666666"
                            onPress={(check) => this.props.method(emotions, check)}
                            ref={(refs) => this.buttonRef[i] = refs}
                        />
                    )
                })
            )
        } else if(this.props.type=='graph') {
            view = (
                this.props.emotions.map( (emotions,i) => {
                    return(
                        <EmotionGraph
                            key={i}
                            emotion={emotions.emotion}
                            value={emotions.value}
                            color="#666666"
                        />
                    )
                })
            )
        }

        return(
            <View style={{flexDirection: 'row'}}>
                {view}
            </View>
        )
    }
}

class EmotionGraph extends Component{
    static defaultProps = {
        emotion : "감정",
        color : "#666666",
        value : 0
    }

    render(){
        const good=["만족","행복","설렘","즐거움"]   // pink
        const bad=["화남","불쾌","짜증","초조"]      // gray
        const sad=["후회","무기력","허탈","우울"]    // blue
        const normal=["소소","평온","지루함"]         // yellow
        let backgroundColor,tintColor
        if(sad.includes(this.props.emotion)){ backgroundColor='#1199bb44'; tintColor="#1199bb" }
        else if(bad.includes(this.props.emotion)){ backgroundColor='#77664444'; tintColor="#776644" }
        else if(normal.includes(this.props.emotion)){ backgroundColor='#ffcc2944'; tintColor="#ffcc29" }
        else { backgroundColor='#ff888844'; tintColor="#ff8888" }
        // let backgroundColor='#ff888844'
        // let tintColor="#ff8888"
        return(
            <CircularProgress
                style={{margin:10}}
                size={50}
                width={2}
                rotation={0}
                fill={this.props.value * 19.99}
                tintColor={tintColor}
                backgroundColor={backgroundColor}>
                {
                    (fill) => (
                        <View style={{width:50,height:50,position:'absolute',right:0,left:0,bottom:0,top:0,justifyContent:'center'}}>
                            <View >
                                <Text style={{alignSelf:'center', fontSize:13}}>
                                    {this.props.emotion}
                                </Text>
                                <Text style={{alignSelf:'center', fontSize:10}}>
                                    {Math.round(fill/20)}
                                </Text>
                            </View>
                        </View>
                    )
                }
            </CircularProgress>
        )
    }
}

class EmotionButton extends Component{
    constructor(props){
        super(props);
        this.state={
            emotion:'',
            isChecked:false,
        }
    }

    unCheck(){
        this.setState({isChecked:false})
    }

    componentWillMount(){
        this.setState({emotion:this.props.emotion})
    }

    static defaultProps = {
        emotion : "감정",
        color : "#666666",
        onClick : null,
    }

    static propTypes = {
        emotion : React.PropTypes.string,
        color : React.PropTypes.string,
        onClick : React.PropTypes.func,
        onPress : React.PropTypes.func,
    };

    toggle(){
        this.props.onPress(()=>{
            this.setState({isChecked: !this.state.isChecked})
        })
    }

    render(){
        return(
            <TouchableOpacity
                style={[
                    this.state.isChecked? styles.clickedButtonStyle : styles.buttonStyle,
                    {backgroundColor:this.state.isChecked? '#ff8888' : 'white'} ]}
                onPress={()=>this.toggle()}
            >
                <Text style={[{fontSize:13,color:this.state.isChecked?'white':'#777'}]}>{this.state.emotion}</Text>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    buttonStyle: {
        width:50,
        height:50,
        margin:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:100,
        borderColor:'#ff8888',
        borderWidth:1,
    },
    clickedButtonStyle: {
        width:50,
        height:50,
        margin:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:100,
    }
})

export default EmotionBar;

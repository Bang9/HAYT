import React, {Component} from "react";
import {Text, TouchableOpacity, View, Dimensions, StyleSheet, Animated} from "react-native";
const {width,height} = Dimensions.get('window')
import RadioForm from "react-native-simple-radio-button";
import Slider from 'react-native-slider';

class SelectedEmotion extends Component {
    constructor(props) {
        super(props)
        this.state={
            emotion:this.props.emotion,
            value:this.props.value,
        }
        this._animated = new Animated.Value(0);
    }

    componentWillReceiveProps(nextProps){
        if(this.state.emotion!=nextProps.emotion || this.state.value!=nextProps.value)
            this.setState({emotion:nextProps.emotion,value:nextProps.value})
    }

    componentDidMount() {
        Animated.timing(this._animated, {
            toValue: 1,
            duration: 300,
        }).start();
    }

    onRemove(){
        Animated.timing(this._animated, {
            toValue: 0,
            duration: 300,
        }).start(()=>this.props.onRemove());
    };

    _onChange(value){
        this.setState({value:value})
        this.props.onChange(value)
    }

    render(){
        const rowStyles = [
            styles.container,
            {
                height: this._animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 60],
                    extrapolate: 'spring',
                }),
            },
            { opacity: this._animated },
        ];
        return(
            <Animated.View style = {rowStyles}>
                <View style={styles.emotionBox}>
                    <Text style={{alignSelf:'center'}}>{this.state.emotion}</Text>
                </View>
                <View style={styles.emotionLevel}>
                    <Slider
                        value={this.state.value}
                        minimumValue={0}
                        maximumValue={5}
                        step={1}
                        minimumTrackTintColor={global.mainColor}
                        maximumTrackTintColor="#eee"
                        thumbTintColor="#efefef"
                        thumbTouchSize={{width:80,height:60}}
                        thumbStyle={{width:25,height:15,backgroundColor:'white',elevation:3}}
                        style={{width:230}}
                        trackStyle={{height:2}}

                        onValueChange={(val)=>this._onChange(val)}
                        animateTransitions={true}
                        animationType={'spring'}
                        debugTouchArea={false}
                    />
                </View>
                <View style={{marginRight:20}}>
                    <Text>{this.state.value}</Text>
                </View>
            </Animated.View>
        )
    }
}

export default SelectedEmotion;

const styles = StyleSheet.create({
    container : {
        flexDirection: "row",
        alignItems:'center',
        height:60,
        width:width,
    },
    emotionBox : {
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        width:60,
        height:30,
        marginLeft:15,
        marginRight:15,
        borderRadius:25,
        borderWidth:2,
        borderColor:'#aaa'
    },
    emotionLevel : {
        flex:0.6,
        marginRight:20,
    },
})
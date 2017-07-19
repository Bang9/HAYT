import React, {Component} from "react";
import {Dimensions, Text, View} from "react-native";
import Button from "../../components/EmotionBar";
import SelectedEmotion from "../../components/SelectedEmotion";
const {width,height} = Dimensions.get('window');

class History extends Component {
    render(){
        return(
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:30}}>
                    HISTORY PAGE
                </Text>
            </View>
        )
    }
}


export default History;
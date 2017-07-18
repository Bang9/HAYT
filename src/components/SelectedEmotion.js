import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';

import Button from './emotionButton'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

class SelectedEmotion extends Component {
    constructor(props) {
        super(props)
            this.state={
                level:0,
                radio_val: [
                    {label: 1, value: 1},
                    {label: 2, value: 2},
                    {label: 3, value: 3},
                    {label: 4, value: 4},
                    {label: 5, value: 5}
                    ]
                ,
            }
    }
    render(){
        return(
            <View style={{flexDirection: "row"}}>
                <Button title={this.props.emotion} color="#488aff"/>
                <RadioForm
                    radio_props={this.state.radio_val}
                    index={this.state.level}
                    initial={0}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={'#2196f3'}
                    animation={true}
                    onPress={(value) => {
                        this.setState({level: value-1})
                    }}
                />
                <TouchableOpacity onPress={()=>{this.props.onRemove(this.props.emotion)}}><Text style={{fontSize:20}}>X</Text></TouchableOpacity>
            </View>
        )
    }
}

export default SelectedEmotion;
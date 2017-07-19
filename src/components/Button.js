import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableNativeFeedback,
    Alert,
} from 'react-native';

class Button extends Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    static defaultProps = {
        title : "Button",
        color : "#bfbfbf",
        onClick : null,
    }

    static propTypes = {
        title : React.PropTypes.string,
        color : React.PropTypes.string,
        onClick : React.PropTypes.func,
    };

    render(){
        return(
            <TouchableNativeFeedback
                delayPressIn={0}
                background={TouchableNativeFeedback.SelectableBackground()}
                onPress={this.props.onClick}
                >
                <View style={[styles.buttonStyle,this.props.buttonStyle,{backgroundColor:this.props.color}]}>
                    <Text style={[styles.fontStyle,styles.titleStyle]}>{this.props.title}</Text>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

export default Button;

const styles = StyleSheet.create({
    buttonStyle:{
        width:250,
        height:40,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
    },
    fontStyle:{
        color:'white'
    }
})
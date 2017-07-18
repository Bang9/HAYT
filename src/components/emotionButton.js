import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
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
        color : "#666666",
        onClick : null,
    }

    static propTypes = {
        title : React.PropTypes.string,
        color : React.PropTypes.string,
        onClick : React.PropTypes.func,
    };

    render(){
        return(
            <TouchableOpacity
                style={
                    {width:50, margin:10, height:30, alignItems:'center', justifyContent:'center', borderRadius:10, backgroundColor:this.props.color}
                }
                onPress={this.props.onPress}
            >
                <Text style={[{fontSize:17,color:'white'}]}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}

export default Button;
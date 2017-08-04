import React, {Component} from "react";
import {Dimensions, Modal, StyleSheet, Text, TouchableHighlight, View} from "react-native";

const { width, height } = Dimensions.get('window');

export default class PressModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={()=>this.props.onClose()}>

                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            underlayColor={'#efefef'}
                            activeOpacity={0.2}
                            style={styles.button}
                            onPress={()=> this.props.onClick()}>
                            <Text style={styles.buttonText}>{this.props.label}</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            underlayColor={'#efefef'}
                            activeOpacity={0.2}
                            style={styles.button}
                            onPress={()=> this.props.onClose()}>
                            <Text style={styles.buttonText}>취소</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position:'absolute', left:0, right:0, top:0, bottom:0,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor:'#000000aa'
    },
    buttonContainer: {
        position:'absolute',bottom:0,
        width: width,
        backgroundColor:'white',
        borderTopLeftRadius:10,borderTopRightRadius:10,
    },
    button:{
        alignItems:'center',justifyContent:'center',height:50,borderRadius:10
    },
    buttonText:{
        fontSize:17,
        color:'#555'
    },
})
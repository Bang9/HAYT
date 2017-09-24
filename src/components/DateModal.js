import React, {Component} from "react";
import {Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Dates from 'react-native-dates';
import moment from 'moment';
const { width, height } = Dimensions.get('window');
import Button from "./Button";


export default class DateModal extends Component {
    constructor(props) {
        super(props);
        this.state ={
            //dates
            date: null,
            focus: 'startDate',
            startDate: null,
            endDate: null,
        }
    }

    dateCheck(start, end){

    }

    render() {
        const isDateBlocked = (date) =>
            date.isAfter(moment(), 'day');

        const onDatesChange = ({ startDate, endDate, focusedInput }) =>
            this.setState({ ...this.state, focus: focusedInput }, () =>
                this.setState({ ...this.state, startDate, endDate })
            );

        const onDateChange = ({ date }) =>
            this.setState({ ...this.state, date });

        return (

            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={()=>this.props.onClose()}
            >

                <TouchableOpacity activeOpacity={1} style={styles.container} onPress={()=>this.props.onClose()}>
                    <View>
                        <View style ={{marginTop:60, width :width-50}}>
                            <Dates
                                onDatesChange={onDatesChange}
                                isDateBlocked={isDateBlocked}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                focusedInput={this.state.focus}
                                range
                            />
                        </View>

                        <View style = {{alignItems:'center',width:width-50}}>
                            <Button
                                color ={this.state.startDate && this.state.endDate ?
                                    this.state.startDate._d.getTime()!=this.state.endDate._d.getTime() ? '#44aaff' : '#cccccc'
                                    :
                                    '#cccccc'
                                }
                                title ="설정"
                                buttonStyle={{width:width-50,borderRadius:0}}
                                onClick={
                                    ()=> {
                                        if(this.state.endDate&&this.state.startDate)
                                            if(this.state.startDate._d.getTime() == this.state.endDate._d.getTime()){
                                                alert("기간은 2일이상 설정해주세요.")
                                            }else {
                                                this.props.dateSetting(this.state.startDate, this.state.endDate)
                                            }
                                    }
                                }/>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        position:'absolute', left:0, right:0, top:0, bottom:0,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor:'#000000aa',
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
        textAlign:"center",
        fontSize:17,
        color:'#fff'
    },
})
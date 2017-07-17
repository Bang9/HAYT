import React, {Component} from "react";
import {RefreshControl, ScrollView, Text, TouchableOpacity, View, StyleSheet,Dimensions,Image} from "react-native";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
const {width,height} = Dimensions.get('window')

class MainTab extends Component{
    constructor(props){
        super(props);
        this.state={
            newMessage:null,
        }
    }
    render(){
        return(
            <View style={{flex:1, backgroundColor: "green"}}>
                {/* Rest of the app comes ABOVE the action button component !*/
                    <Image source={require('../../img/background.png')} style={styles.backgroundImage} />
                }
                <ActionButton buttonColor="rgba(231,76,60,1)" verticalOrientation="down" position="right" autoInactive={false}>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
                        <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
                        <Icon name="md-done-all" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </View>
        )
    }
}

export default MainTab;

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    backgroundImage: {
        flex:1,
        width:width,
        height:height,
    },
});




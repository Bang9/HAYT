import React, {Component} from "react";
import {RefreshControl, ScrollView, Text, TouchableOpacity, View, StyleSheet,Dimensions,Image} from "react-native";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import API from '../../services/API'
import firebase from'../../commons/Firebase'
const {width,height} = Dimensions.get('window')

class MainTab extends Component{
    constructor(props){
        super(props);
        this.state={
            newMessage:null,
            currentHistory:[{emotions:[{emotion:'',value:0},{emotion:'',value:0},{emotion:'',value:0}]}]
        }
        this.uid = firebase.auth().currentUser.uid//API.get_uid;
        this.ref = `users/${this.uid}/currentHistory`
    }
    componentWillMount(){
        API.getDataOn(this.ref, (snapshot)=>this.setState({currentHistory:snapshot.val()}))
    }
    // getCurrentHIstory(){
    //     // let uid = API.get_uid()
    //     // let ref = `users/${uid}/currentHistory`
    //     API.getDataOn(this.ref, (snapshot)=>this.setState({currentHistory:snapshot.val()}))
    // }
    componentWillUnmount(){
        API.removeDataOn(this.ref, (snapshot)=>this.setState({currentHistory:snapshot.val()}))
    }
    render(){
        return(

            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                {/* Rest of the app comes ABOVE the action button component !*/
                    //  <Image source={require('../../img/background.png')} style={styles.backgroundImage} />
                }
                <View style={{flex:8,justifyContent:'center'}}>
                    <Image
                        style={{width:200,height:200}}
                        source={{uri:'http://blogfiles.naver.net/MjAxNzAxMTZfMjU5/MDAxNDg0NTM4MTc1NDgw.NlXyGGYUuFv5aDbmJKyvVBCS7PkvAQlJjqwr5b7C6okg.ZowzZ8L-Ft_al1OXO9BDfFIUspwVFCUQCxrP-KBrajEg.GIF.gak05/%EB%8B%B9%ED%99%A9%ED%95%98%EB%8A%94_%EB%9D%BC%EC%9D%B4%EC%96%B8.gif'}}/>
                </View>
                <View style={{flex:2,flexDirection:'row',alignItems:'flex-start'}}>
                    {
                        this.state.currentHistory!=null &&
                        this.state.currentHistory[0].emotions.map( (emotions,i) => {
                            return(
                                <AnimatedCircularProgress
                                    key={i}
                                    style={{margin:10}}
                                    size={80}
                                    width={10}
                                    rotation={0}
                                    friction={8}
                                    fill={emotions.value * 19.999}
                                    tintColor={'#ff8888'}
                                    backgroundColor={'#ff888844'}>
                                    {
                                        (fill) => (
                                            <View style={{width:80,height:80,position:'absolute',right:0,left:0,bottom:0,top:0,justifyContent:'center'}}>
                                                <View >
                                                    <Text style={{alignSelf:'center', fontSize:13}}>
                                                        {emotions.emotion}
                                                    </Text>
                                                    <Text style={{alignSelf:'center', fontSize:10}}>
                                                        {Math.round(fill/20)}
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    }
                                </AnimatedCircularProgress>
                            )
                        })
                    }
                </View>
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
        position:'absolute'
    },
});




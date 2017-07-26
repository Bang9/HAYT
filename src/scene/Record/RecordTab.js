import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';

import ScrollableTabView from "react-native-scrollable-tab-view";
import ImageTabBar from "../../components/ImageTabBar";
import styles from "../../commons/mainStyle";
const {width,height} = Dimensions.get('window')

import History from '../RecordDetail/History'
import Record from '../RecordDetail/Record'
import Setting from '../RecordDetail/Setting'

class RecordTab extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
    }

    render(){
        return(
                <View style={{flex:1,justifyContent:'center', alignItems:'center', backgroundColor:global.backgroundColor}}>
                    <ScrollableTabView
                        //style={{flexDirection: "column"}}
                        locked={false}
                        tabBarPosition="top"
                        renderTabBar={() => <ImageTabBar tabStyle={{width:width*.3}} badgeNum={0} textStyle={{fontSize:12}}/>}
                        tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                        tabBarActiveTextColor={'#ff8888'}
                        tabBarInactiveTextColor='#bdbdbd'
                        initialPage={0}>

                        <Record tabLabel="기록하기"></Record>
                        <History tabLabel="히스토리"></History>
                        <Setting tabLabel="설정"></Setting>
                    </ScrollableTabView>
                </View>
        )
    }
}
export default RecordTab;

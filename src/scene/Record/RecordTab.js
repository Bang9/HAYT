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

    render(){

        return(
                <View style={{flex:1,justifyContent:'center', alignItems:'center', backgroundColor:global.backgroundColor}}>
                    <ScrollableTabView
                        //style={{flexDirection: "column"}}
                        locked={false}
                        tabBarPosition="top"
                        renderTabBar={() => <ImageTabBar tabStyle={{width:width*.3}} badgeNum={0} textStyle={{fontSize:12}}/>}
                        ref={(tabView) => { this.tabView = tabView; }}
                        tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                        tabBarActiveTextColor={global.mainColor}
                        tabBarInactiveTextColor='#bdbdbd'
                        onChangeTab={()=>{}}
                        initialPage={0}>

                        <History tabLabel="히스토리"></History>
                        <Record tabLabel="기록하기"></Record>
                        <Setting tabLabel="설정"></Setting>
                    </ScrollableTabView>
                </View>
        )
    }
}
export default RecordTab;

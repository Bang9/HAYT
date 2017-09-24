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

import History from '../emotion-tab/History'
import Record from '../emotion-tab/Record'
import Setting from '../emotion-tab/Setting'

class EmotionTab extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
    }

    render(){
        return(
                <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
                    <ScrollableTabView
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
export default EmotionTab;

import React, {Component} from "react";
import {View,Text,Dimensions,TouchableOpacity,Image} from "react-native";

import {Actions} from "react-native-router-flux";
import ScrollableTabView from "react-native-scrollable-tab-view";
import DefaultTabBar from "../../components/DefaultTabBar";
import MainTab from "../index-tab/MainTab";
import EmotionTab from "../index-tab/EmotionTab";
import styles from "../../commons/mainStyle";
import TabBar from 'react-native-underline-tabbar'
const {width,height} = Dimensions.get('window');

import History from '../emotion-tab/History'
import Record from '../emotion-tab/Record'
import Setting from '../emotion-tab/Setting'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab:'main',
        };
    }
    componentWillMount(){
    }

    componentDidMount(){
    }

    tabBar(){
        return(
            <TabBar
                tabBarStyle={{justifyContent:'center',backgroundColor:'green'}}
                tabMargin={0}
                tabStyles={{tab:{width:width*.333}}}
                underlineColor="#f88"  />
        )
    }
    render(){
        return(
            <View style={{flexDirection: "column", flex:1}}>
                <ScrollableTabView
                    locked={false}
                    tabBarPosition="bottom"
                    renderTabBar={() =><DefaultTabBar tabsContainerStyle={{borderTopWidth:1}} backgroundColor='#fff' tabStyle={{width:width*.333}} textStyle={{fontSize:10}}/>}
                    tabBarActiveTextColor="#f88"
                    tabBarInactiveTextColor='#ccc'
                    initialPage={1}
                    ref={(tabView)=>this.tabView = tabView}>

                    <History tabLabel={"히스토리"}></History>
                    <MainTab tabLabel={"메인"} parent={this}/>
                    <Setting tabLabel={"설정"}></Setting>
                    {/*<EmotionTab tabLabel="기록"/>*/}
                </ScrollableTabView>
            </View>
        )
    }

    goToPage(index){
        this.tabView.goToPage(index);
    }

    componentDidMount(){
        //Actions.refresh({title:this.getCurrentLabel(this.tabView)})
    }

}

export default Main;

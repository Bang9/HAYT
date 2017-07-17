import React, {Component} from "react";
import {View,Text,Dimensions} from "react-native";

import {Actions} from "react-native-router-flux";
import ScrollableTabView from "react-native-scrollable-tab-view";
import ImageTabBar from "../../components/ImageTabBar";
import MainTab from "./MainTab";
import RecordTab from "../Record/RecordTab";
import styles from "../../common/mainStyle";
const {width,height} = Dimensions.get('window')

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount(){
        //Session.getSession();
    }

    render(){
        return(
            <View style={{flexDirection: "column", flex:1,}}>
                <ScrollableTabView
                    //style={{flexDirection: "column"}}
                    locked={false}
                    tabBarPosition="bottom"
                    renderTabBar={() =><View></View>}
                    tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                    tabBarActiveTextColor={global.mainColor}
                    tabBarInactiveTextColor='#bdbdbd'
                    initialPage={0}>

                    <MainTab tabLabel="메인"></MainTab>
                    <RecordTab tabLabel="더보기"></RecordTab>
                </ScrollableTabView>
            </View>
        )
    }

    componentDidMount(){
        //Actions.refresh({title:this.getCurrentLabel(this.tabView)})
    }

}

export default Main;

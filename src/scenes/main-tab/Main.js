import React, {Component} from "react";
import {View,Text,Dimensions,TouchableOpacity,Image} from "react-native";

import {Actions} from "react-native-router-flux";
import ScrollableTabView from "react-native-scrollable-tab-view";
import ImageTabBar from "../../components/ImageTabBar";
import MainTab from "./MainTab";
import EmotionTab from "./EmotionTab";
import styles from "../../commons/mainStyle";
const {width,height} = Dimensions.get('window')

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount(){
    }

    componentDidMount(){
    }

    render(){
        return(
            <View style={{flexDirection: "column", flex:1,}}>
                <ScrollableTabView
                    //style={{flexDirection: "column"}}
                    locked={false}
                    tabBarPosition="bottom"
                    renderTabBar={() =><View/>}
                    tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                    tabBarActiveTextColor={global.mainColor}
                    tabBarInactiveTextColor='#bdbdbd'
                    initialPage={0}
                    ref={(tabView)=>this.tabView = tabView}>

                    <MainTab tabLabel="메인" parent={this}/>
                    <EmotionTab tabLabel="기록"/>
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

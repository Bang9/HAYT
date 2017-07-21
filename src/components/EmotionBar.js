import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from "react-native";

class EmotionBar extends Component{
    constructor(props){
        super(props);
        this.buttonRef = []
    }

    buttonReset(){
        for(i in ref = this.buttonRef){
            if(ref[i]!=null) ref[i].unCheck()
        }
    }
    render(){
        return(
            <View style={{flexDirection: 'row'}}>
                {
                    this.props.emotions.map( (emotions,i) => {
                        return(
                            <EmotionButton
                                key={i}
                                emotion={emotions}
                                color="#666666"
                                onPress={(check)=>this.props.method(emotions,check)}
                                ref={(refs)=>this.buttonRef[i]=refs}
                            />
                        )
                    })
                }
            </View>
        )
    }
}

class EmotionButton extends Component{
    constructor(props){
        super(props);
        this.state={
            emotion:'',
            isChecked:false,
        }
    }

    unCheck(){
        this.setState({isChecked:false})
    }

    componentWillMount(){
        this.setState({emotion:this.props.emotion})
    }

    static defaultProps = {
        emotion : "감정",
        color : "#666666",
        onClick : null,
        onPress : ()=>alert("Hi")
    }

    static propTypes = {
        emotion : React.PropTypes.string,
        color : React.PropTypes.string,
        onClick : React.PropTypes.func,
        onPress : React.PropTypes.func,
    };

    toggle(){
        this.props.onPress(()=>{
            this.setState({isChecked: !this.state.isChecked})
        })
    }

    render(){
        return(
            <TouchableOpacity
                style={[
                    this.state.isChecked? styles.clickedButtonStyle : styles.buttonStyle,
                    {backgroundColor:this.state.isChecked? global.mainColor : 'white'} ]}
                onPress={()=>this.toggle()}
            >
                <Text style={[{fontSize:13,color:this.state.isChecked?'white':'#777'}]}>{this.state.emotion}</Text>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    buttonStyle: {
        width:50,
        height:50,
        margin:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:100,
        borderColor:'#ff8888',
        borderWidth:1,
    },
    clickedButtonStyle: {
        width:50,
        height:50,
        margin:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:100,
    }
})

export default EmotionBar;

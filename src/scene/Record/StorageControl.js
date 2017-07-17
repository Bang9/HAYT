import React, {Component} from "react";
import {Alert, AsyncStorage, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import Button from "../../components/Button";

class StorageControl extends Component{
    constructor(props){
        super(props);
        this.state={
            items:null,
            key:null,
            value:null,
            item:null,
            allKey:null,
        }
    }
    async componentWillMount(){
        await this.getAllItems()
    }
    render(){
        return(
            <ScrollView>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <View style={{alignItems:'center'}}>
                        <TextInput placeholder="key" style={{width:200}} onChangeText={(val)=>this.setState({key:val})}></TextInput>
                        <TextInput placeholder="value" style={{width:200}} onChangeText={(val)=>this.setState({value:val})}></TextInput>
                        <Button title="저장" color="red" onClick={()=>this.storeItem(this.state.key,this.state.value)}/>
                        <Text>{"KEY : "+this.state.key}</Text>
                        <Text>{"VALUE : "+this.state.value}</Text>
                    </View>
                    <View  style={{flex:1}}>
                        <FlatList
                            data={this.state.items}
                            renderItem={ ({item}) => <Item head={item.key} value={item.val} cb={(pr)=>this.remove(pr)}/> }
                            keyExtractor={item=>item.key} // keyExtractor -> inform each of items primary key
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
    async getItem(key){
        try {
            return await AsyncStorage.getItem(key).then(
                (result)=>{return result}
            );
        } catch(err){
            console.log("get failed::",err)
        }
    }
    async getAllKey(){
        try{
            return await AsyncStorage.getAllKeys().then(
                (result)=>{return result}
            )
        }catch(err){
            console.log(err)
        }
    }
    async storeItem(key,item){
        try {
            await AsyncStorage.setItem(key, item).then(
                ()=> {
                    let arr = this.state.items.slice()
                    arr.push({key:key,val:item})
                    this.setState({items:arr})
                }
            )
        } catch(err){
            console.log("store failed::",err)
        }
    }

    async getAllItems(){
        let allKey = await this.getAllKey();
        let objArr = []
        if(allKey){
            for(var i in allKey){
                let item = await this.getItem(allKey[i]) //get item
                objArr.push({key:allKey[i],val:item})
            }
            this.setState({items:objArr})
        }
        else alert("못가져옴")
    }
    async remove(pr){
        //items : [{key,val}, ...]
        let arr = this.state.items.slice()

        AsyncStorage.removeItem(pr).then(
            ()=> {
                for (key in arr) if (arr[key].key == pr) arr.splice(key, 1)
                this.setState({items: arr})
            }
        )
    }
}
class Item extends Component{
    render(){
        return(
            <TouchableOpacity onPress={()=>this.remove()}>
                <View style={{borderWidth:1,marginTop:5,padding:15}}>
                    <Text>{"KEY:\n"+this.props.head}</Text>
                    <Text>{"\nVALUE:\n"+this.props.value}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    async remove(){
        Alert.alert(
            "알림",
            "삭제하십니까?",
            [{
                text:'네',
                onPress:()=>this.props.cb(this.props.head)
                    .then(alert("삭제 완료"))
            },
                {
                    text:'아니오'
                }]
        )
    }
}
export default StorageControl;

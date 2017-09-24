import React, {Component} from "react";
import {Alert, Dimensions, FlatList, StyleSheet, Image, Text, View, TouchableOpacity, AsyncStorage} from "react-native";

import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from "react-native-loading-spinner-overlay";

import API from '../../services/API'
const {width,height} = Dimensions.get('window');

class FriendsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            friends:[],
            showSpinner: false,
        }
    }

    componentWillMount(){
        this.getFriends();
    }

    componentDidMount(){
        Actions.refresh({renderRightButton:()=>this.syncButton()})
    }

    syncButton(){
        return (
            <TouchableOpacity
                onPress={()=>this.syncFriendsByPhone()}
                style={{width:30}}>
                <Icon name="md-refresh" style={{
                    fontSize: 25,
                    height: 22,
                    color: 'white'}}/>
                <Text style={{color:'white', fontSize:16, textAlign:'right'}}></Text>
            </TouchableOpacity>
        );
    }

    async syncFriendsByPhone(){
        const contacts = JSON.parse(await AsyncStorage.getItem('@Setting:contacts')).contacts
        let uid = API.getUid();
        const snapshot = await API.getDataOnce('userLookUpByPhone');
        const friendsRef = `users/${uid}/friends`;
        if(snapshot){
            const users = snapshot.val();
            let friends = []
            contacts.some((contact,index) => {
                if(users[contact.phone]){
                    contact.uid = users[contact.phone]
                    friends.push(contact)
                }
            });
            API.writeData(friendsRef,friends)
        }
    }

    getFriends(){
        this.setState({showSpinner:true})
        let uid = API.getUid();
        let ref = `users/${uid}/friends`;
        API.getDataOn(ref,(snapshot)=>{
            this.setState({friends:snapshot.val(), showSpinner:false})
        });
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.friends}
                    renderItem={ ({item,index}) =>
                        <FriendRow
                            name={item.name} phone={item.phone} uid={item.uid}
                        />  }
                    keyExtractor={item => item.uid} // keyExtractor -> inform each of items primary key
                />
                <Spinner visible={this.state.showSpinner}/>
            </View>
        );
    }
}

class FriendRow extends Component {
    constructor(props){
        super(props);
        this.state={
            photoURL:'none'
        }
    }
    componentWillMount(){
        this.getProfileURL();
    }
    render(){
        const profile_photo = this.state.photoURL=='none' ? require('../../img/default_profile.png') : {uri:this.state.photoURL}
        return(
            <View>
                <TouchableOpacity onPress={()=>Actions.visit({friendsUid:this.props.uid, title:this.props.name})}>
                    <View style={styles.profileContainer}>
                        <Image
                            style={styles.profilePhoto}
                            source={profile_photo}
                        />
                        <View style={styles.profileUserConfig}>
                            <Text style={{fontSize:15,color:'#222'}}>{this.props.name}</Text>
                            <Text style={{fontSize:15,color:'#999'}}>{this.props.phone}</Text>
                        </View>
                        <View style={styles.profileButtonWrapper}>
                            <Image
                                style={styles.profileButton}
                                source={require('../../img/goButton.png')}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{height:1, marginHorizontal:15, backgroundColor:'#eee'}}/>
            </View>
        )
    }

    getProfileURL(){
        let ref = `users/${this.props.uid}/userConfig`
        API.getDataOnce(ref)
            .then( (ret) => {
                let photoURL = ret.val().photoURL;
                if(photoURL) this.setState({photoURL});
            })
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },
    selectedContainer:{
        flex:1,
        height:60,
        borderColor:'#dddf',
        borderWidth:0.3,alignItems:'center',
        flexDirection:'row'
    },

    profileContainer:{
        flexDirection:'row',
        paddingHorizontal:20,
        height:70,
        //backgroundColor:'#f9f9f9'
    },
    profilePhoto:{
        width:50,
        height:50,
        borderRadius:50,
        alignSelf:'center',
        borderWidth:0.5,
        borderColor:'#ccc'
    },
    profileUserConfig:{
        paddingHorizontal:20,
        alignSelf:'center'
    },
    profileButtonWrapper:{
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        right:15,
        width:30,height:30,
        alignSelf:'center',
    },
    profileButton:{
        width:20,
        height:20,
        tintColor:'#bbb',
    }
});


export default FriendsList;
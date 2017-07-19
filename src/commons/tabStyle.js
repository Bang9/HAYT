//@flow
'use strict';
import React, {
  StyleSheet,
  Dimensions,
} from 'react-native';

var Color = {
  darkBlack: '#1c1d1f',
  black : '#242528',
  green : '#00c878',
  orange: '#ff5000',
  white : '#ffffff',
  lightGray: '#dddddd',
  red   : '#ff5000',
  chatOtherText : '#46505a',
  chatActionText: '#46505acc',
  chatActionBG  : '#a0aab41f',
  chatAuxText   : '#000000cc',
  chatBG : '#e9ecf1',
  chatInputBG : '#f7f7f7',
  //textInputBG: '#36373a',
  textInputBG: '#ffffff',
  //textInputPlaceHolder: '#ffffff33',
  textInputPlaceHolder: '#d0cecd',
  chatListHeader    : '#1f2023',
  chatListSeperator : '#141414',
  modalBG : '#000000b2',
  splitColor: 'rgb(20,20,20)',
  chatMenuItem: '#1c1d1f',
  btnGray: '#47484b',
  bar: '#cccccc',
  gray: '#808080',
}

const { width, height } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = 22;
const ELEMENT_WIDTH = width - 40;

const BADGE_SIZE = 20;


module.exports = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 9,
    alignItems: 'center',
    backgroundColor: Color.black,
  },
  transparent_button: {
    marginTop: 10,
    padding: 15
  },
  transparent_button_text: {
    color: '#0485A9',
    fontSize: 16
  },
  primary_button: {
    margin: 10,
    padding: 15,
    backgroundColor: '#529ecc'
  },
  primary_button_text: {
    color: '#FFF',
    fontSize: 18
  },
  image: {
    width: 100,
    height: 100
  },
  button: {
    backgroundColor: Color.green,
    width: ELEMENT_WIDTH,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  textInput: {
    backgroundColor: Color.textInputBG,
    borderWidth: 0,
  },
  separator: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#dcdcdc',
  },
  //custom
  badgePos: {
    position: 'absolute',
    left: 14,
    top: -7,
  },
  badgeCircle: {
    width:  BADGE_SIZE,
    height: BADGE_SIZE,
    borderColor: Color.red,
    borderRadius: BADGE_SIZE/2,
    borderWidth: 1.1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'transparent',
  },
  badgeColorAtTab : {
    backgroundColor: '#ff5000',
    borderColor: '#ff5000',
  },
  badgeTextAtTab: {
    color:'white',
  },
  badgeText: {
    fontSize: 12,
    fontWeight:"700",
    //color: 'white',
    color: Color.red,
    //backgroundColor: Color.black,
    textAlign: 'center',
  },
  //util
  centering: {
    justifyContent:'center', alignItems:'center',
  },
  fullScreen: {
    position:'absolute', left:0, top:0, right:0, bottom:0,
    //backgroundColor:'white',
  },
  bg: {
    //backgroundColor:Color.darkBlack,
    backgroundColor:'black',
  },
  textBold: {
    fontWeight: "700",
  },
  textlargeWhite: {
    fontSize:16,
    lineHeight:16,
    color:'white',
    fontWeight:"700",
    marginVertical:15,
  },
});



module.exports.Color = Color;

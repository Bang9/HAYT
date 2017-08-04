// @flow

import React from 'react';
import {StyleSheet,Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  bottomButtonArea: {
    flex: 1,
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 120,
    borderColor: "#D1D1D1",
    backgroundColor: "#FFFFFF",
  },
  bottomButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSplitter: {
    borderLeftWidth: 1,
    borderColor: "#D1D1D1",
  },
  wrapper: {
    marginTop: 0,
  },
  slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
  },
  text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold',
  },
  slideButton: {
      fontSize: 50, fontFamily: "Arial",
      fontWeight: "100",
      color: "white", textShadowColor:"#CCCCCC",
      textShadowOffset:{width: 1, height: 1},
      textShadowRadius:7
  },
  dotStyle: {
      backgroundColor: '#FFFFFF',
      width: 10, height: 10,
      borderRadius: 10, marginLeft: 3,
      marginRight: 3, marginTop: 3,
      marginBottom: 3,
      shadowOffset:{ width: 1, height: 1 },
      shadowColor: '#CCCCCC',
      shadowOpacity: 1.0,
  },
  balloonWrapper: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  balloon: {
    padding: 5,
    width: 130,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ff8888',
    backgroundColor: "#fff",
    zIndex: 1,
  },
  balloonText: {
    color: '#ff8888',
  },
  tabBarUnderlineStyle: {
    backgroundColor:'#ff8888',
    height:2,
  },
});

export default styles;

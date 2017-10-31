// @flow
'use strict';

import * as axis from 'd3-axis';
import * as format from 'd3-format';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import React,{Component} from 'react';
import { ActivityIndicator, ART, StyleSheet, Text, View } from 'react-native';
import AnimShape from '../art/AnimShape';

const {
          Surface,
          Group,
      } = ART;

const d3 = {
    scale,
    shape,
    format,
    axis,
};

const margin = 20;

class AreaSpline extends Component {
    constructor(props) {
        super(props);
        this.data={
            "걱정":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "만족":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "무기력":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "불쾌":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "설렘":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "소소":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "우울":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "즐거움":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "지루함":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "짜증":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "평온":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "행복":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "허탈":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "화남":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "후회":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
        this.state={
            isLoaded:false,
        }
    }

    async componentWillMount(){
        this.data = await this.props.data;
        console.log('will mount item',this.data);
        this.setState({isLoaded:true})
    }

    componentWillReceiveProps(nextProps){
        console.log('prop update',nextProps)
    }

    //TODO: expose this methods as part of the AreaSpline interface.
    _Yvalue(item, index) {
        return -item; }

    //TODO: expose this methods as part of the AreaSpline interface.
    _Xvalue(item, index) { return index*15; }

    // method that transforms data into a svg path (should be exposed as part of the AreaSpline interface)
    _createArea() {
        var that = this;
        var area = d3.shape.area()
            .x(function(d, index) { return that._Xvalue(d, index); })
            .y1(function(d, index) { return that._Yvalue(d, index); })
            .curve(d3.shape.curveNatural)
            (this.data[this.props.title])

        // console.debug(`area: ${JSON.stringify(area)}`);
        return { path : area };
    }

    render() {
        const x = margin;
        const y = this.props.height - margin;

        return (
            this.state.isLoaded ?
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'row'}}>
                        <Text>기간별 </Text>
                        <Text style={{color:this.props.color,fontWeight:'bold'}}>{this.props.title}</Text>
                        <Text> 분포</Text>
                    </View>
                    <Surface width={this.props.width-75} height={this.props.height}>
                        <Group x={0} y={this.props.height}>
                            <AnimShape
                                color={this.props.color}
                                d={() => this._createArea()}
                            />
                        </Group>
                    </Surface>
                    <View style={{flexDirection:'row', width:this.props.width, alignSelf:'center', paddingHorizontal:30}}>
                        <View style={{flex:1}}><Text>{this.props.startDate.format('MM/DD')}</Text></View>
                        <View style={{flex:1,alignItems:'flex-end'}}><Text>{this.props.endDate.format('MM/DD')}</Text></View>
                    </View>
                </View>
                :
                <View style={{marginTop:100,alignItems:'center',justifyContent:'center'}}>
                    <ActivityIndicator size="small" color="#ff8888" />
                </View>
        );
    }
}

export default AreaSpline;

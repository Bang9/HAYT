// @flow
'use strict';

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ART,
} from 'react-native';

const {
          Surface,
          Group,
          Rectangle,
          ClippingRectangle,
          LinearGradient,
          Shape,
      } = ART;

import AnimShape from '../art/AnimShape';

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as format from 'd3-format';
import * as axis from 'd3-axis';

const d3 = {
    scale,
    shape,
    format,
    axis,
};

import {
    scaleBand,
    scaleLinear
} from 'd3-scale';

type Props = {
    height: number,
    width: number,
    color: any,
    data: any
};

const margin = 20;
const AnimationDurationMs = 250;

class AreaSpline extends React.Component {

    constructor(props: Props) {
        super(props);
        this._createArea = this._createArea.bind(this);
        this._Xvalue = this._Xvalue.bind(this);
        this._Yvalue = this._Yvalue.bind(this);
        this._label = this._label.bind(this);
    }

    //TODO: expose this methods as part of the AreaSpline interface.
    _Yvalue(item, index) { return -item.value; }

    //TODO: expose this methods as part of the AreaSpline interface.
    _Xvalue(item, index) { return index*15; }

    //TODO: expose this methods as part of the AreaSpline interface.
    _label(item, index) { return item.name; }

    // method that transforms data into a svg path (should be exposed as part of the AreaSpline interface)
    _createArea() {
        var that = this;
        var area = d3.shape.area()
            .x(function(d, index) { return that._Xvalue(d, index); })
            .y1(function(d, index) { return that._Yvalue(d, index); })
            .curve(d3.shape.curveNatural)
            (this.props.data)

        // console.debug(`area: ${JSON.stringify(area)}`);

        return { path : area };
    }

    render() {
        const x = margin;
        const y = this.props.height - margin;


        return (
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
                <View style={{flex:1}}><Text>{this.props.data[0].date.format('MM/DD')}</Text></View>
                <View style={{flex:1,alignItems:'flex-end'}}><Text>{this.props.data[this.props.data.length-1].date.format('MM/DD')}</Text></View>
              </View>
            </View>
        );
    }
}

export default AreaSpline;

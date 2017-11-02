const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const {
    View,
    Animated,
    StyleSheet,
    ScrollView,
    Text,
    Platform,
    Dimensions,
    Image,
    TouchableNativeFeedback
} = ReactNative;

import Common from "../commons/tabStyle";

const Button = (props) => {
    return <TouchableNativeFeedback
        delayPressIn={0}
        background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
        {...props}
    >
        {props.children}
    </TouchableNativeFeedback>;
};

const WINDOW_WIDTH = Dimensions.get('window').width;

const DefaultTabBar = React.createClass({
    propTypes: {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
        backgroundColor: React.PropTypes.string,
        activeTextColor: React.PropTypes.string,
        inactiveTextColor: React.PropTypes.string,
        scrollOffset: React.PropTypes.number,
        style: ViewPropTypes.style,
        tabStyle: ViewPropTypes.style,
        tabsContainerStyle: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        renderTab: React.PropTypes.func,
        underlineStyle: ViewPropTypes.style,
        onScroll:React.PropTypes.func,
    },

    getDefaultProps() {
        return {
            scrollOffset: 52,
            activeTextColor: 'navy',
            inactiveTextColor: 'black',
            backgroundColor: null,
            style: {},
            tabStyle: {},
            tabsContainerStyle: {},
            underlineStyle: {},
        };
    },

    getInitialState() {
        this._tabsMeasurements = [];
        return {
            _leftTabUnderline: new Animated.Value(0),
            _widthTabUnderline: new Animated.Value(0),
            _containerWidth: null,
        };
    },

    componentDidMount() {
        this.props.scrollValue.addListener(this.updateView);
    },

    updateView(offset) {
        const position = Math.floor(offset.value);
        const pageOffset = offset.value % 1;
        const tabCount = this.props.tabs.length;
        const lastTabPosition = tabCount - 1;

        if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
            return;
        }

        if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
            this.updateTabUnderline(position, pageOffset, tabCount);
        }
    },

    necessarilyMeasurementsCompleted(position, isLastTab) {
        return this._tabsMeasurements[position] &&
            (isLastTab || this._tabsMeasurements[position + 1]) &&
            this._tabContainerMeasurements &&
            this._containerMeasurements;
    },

    updateTabUnderline(position, pageOffset, tabCount) {
        const lineLeft = this._tabsMeasurements[position].left;
        const lineRight = this._tabsMeasurements[position].right;
        if (position < tabCount - 1) {
            const nextTabLeft = this._tabsMeasurements[position + 1].left;
            const nextTabRight = this._tabsMeasurements[position + 1].right;

            const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
            const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

            this.state._leftTabUnderline.setValue(newLineLeft);
            this.state._widthTabUnderline.setValue(newLineRight - newLineLeft);
        } else {
            this.state._leftTabUnderline.setValue(lineLeft);
            this.state._widthTabUnderline.setValue(lineRight - lineLeft);
        }
    },

    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
        const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        return <Button
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View style={[styles.tab, this.props.tabStyle, ]}>
                <View >
                </View>
                <Text style={[{paddingBottom:3,color: textColor, fontWeight, }, textStyle, ]}>
                    {name}
                </Text>
            </View>
        </Button>;
    },
    renderMainTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
        const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        return <Button
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View style={[styles.tab, this.props.tabStyle, ]}>
                <Text style={[{paddingBottom:3,color: textColor, fontWeight, }, textStyle, ]}>
                    {name}
                </Text>
            </View>
        </Button>;
    },

    measureTab(page, event) {
        const { x, width, height, } = event.nativeEvent.layout;
        this._tabsMeasurements[page] = {left: x, right: x + width, width, height, };
        this.updateView({value: this.props.scrollValue._value, });
    },

    render() {
        const tabUnderlineStyle = {
            position: 'absolute',
            height: 2,
            backgroundColor: '#f88',
            bottom: 0,
        };

        const dynamicTabUnderline = {
            left: this.state._leftTabUnderline,
            width: this.state._widthTabUnderline,
        };

        return(
            <View
                style={[{flexDirection:'row'},styles.container, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}
                onLayout={this.onContainerLayout}
            >
                <View
                    style={[styles.tabs, {width: this.state._containerWidth, }, this.props.tabsContainerStyle, ]}
                    ref={'tabContainer'}
                    onLayout={this.onTabContainerLayout}
                >
                    {this.renderTab(this.props.tabs[0],0, this.props.activeTab===0, this.props.goToPage,this.measureTab.bind(this,0))}
                    {this.renderMainTab(this.props.tabs[1],1, this.props.activeTab===1, this.props.goToPage,this.measureTab.bind(this,1))}
                    {this.renderTab(this.props.tabs[2],2, this.props.activeTab===2, this.props.goToPage,this.measureTab.bind(this,2))}
                    {/*{this.props.tabs.map((name, page) => {*/}
                    {/*const isTabActive = this.props.activeTab === page;*/}
                    {/*const renderTab = this.props.renderTab || this.renderTab;*/}
                    {/*return renderTab(name, page, isTabActive, this.props.goToPage, this.measureTab.bind(this, page));*/}
                    {/*})}*/}
                    <Animated.View style={[tabUnderlineStyle, dynamicTabUnderline, this.props.underlineStyle ]}/>
                </View>
            </View>
        )
    },

    componentWillReceiveProps(nextProps) {
        // If the tabs change, force the width of the tabs container to be recalculated
        if (JSON.stringify(this.props.tabs) !== JSON.stringify(nextProps.tabs) && this.state._containerWidth) {
            this.setState({ _containerWidth: null, });
        }
    },

    onTabContainerLayout(e) {
        this._tabContainerMeasurements = e.nativeEvent.layout;
        let width = this._tabContainerMeasurements.width;
        if (width < WINDOW_WIDTH) {
            width = WINDOW_WIDTH;
        }
        this.setState({ _containerWidth: width, });
        this.updateView({value: this.props.scrollValue._value, });
    },

    onContainerLayout(e) {
        this._containerMeasurements = e.nativeEvent.layout;
        this.updateView({value: this.props.scrollValue._value, });
    },
});

module.exports = DefaultTabBar;

const styles = StyleSheet.create({
    tab: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    container: {
        height: 50,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#ccc',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

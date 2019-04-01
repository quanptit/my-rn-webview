import React from 'react';
import { View } from 'react-native';
import Orientation from 'react-native-orientation';
import { HeaderBar } from "my-rn-header-bar";
import { Button, ButtonModel, ComponentNoUpdate, StyleUtils } from "my-rn-base-component";
import { WebViewCustom } from "./WebViewCustom";
import { CommonUtils } from "my-rn-base-utils";
const s = StyleUtils.getAllStyle();
export class HtmlScreen extends ComponentNoUpdate {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (this.props.isLockLanscape) {
            Orientation.getOrientation((err, orientation) => {
                if (orientation === "PORTRAIT") {
                    this.lastIsPORTRAIT = true;
                }
            });
            Orientation.lockToLandscape();
        }
    }
    componentWillUnmount() {
        if (this.lastIsPORTRAIT) {
            Orientation.lockToPortrait();
        }
        if (this.props.isLockLanscape)
            Orientation.unlockAllOrientations();
        if (this.props.callbackUpdateScore != null && this.props.rightButton == null)
            this.props.callbackUpdateScore({ noTotal: 1, noCorrect: 1 });
    }
    renderChild() {
        return (<View style={s.flex_i}>
                <WebViewCustom dirCacheImage={this.props.dirCacheImage} ROOT_RESOURCE={this.props.ROOT_RESOURCE} javaScriptEnabled={true} dataDetectorTypes="none" htmlSource={{ baseUrl: '', html: this.props.html }}/>
            </View>);
    }
    render() {
        return (<View style={[s.flex_i, this.props.style]}>
                {this._renderHeader()}
                {this.renderChild()}
            </View>);
    }
    //region header ====
    _renderHeader() {
        return (<HeaderBar leftButton={{ iconName: "md-arrow-back", onPress: CommonUtils.onBackPress }} colors={this.props.headerColors} title={this.props.title} renderRightAction={this._renderButtonLuyenTap.bind(this)}/>);
    }
    _renderButtonLuyenTap() {
        if (this.props.rightButton == null)
            return;
        return <Button title={this.props.rightButton.title} model={ButtonModel.transparent} onPress={this.props.rightButton.onPress} textStyle={{ color: "white" }}/>;
    }
}

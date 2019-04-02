import React, {Component} from 'react'
import {DataDetectorTypes, StyleProp, ViewProps, ViewStyle, WebView, WebViewHtmlSource, WebViewProps, WebViewPropsAndroid, WebViewPropsIOS} from "react-native"
// @ts-ignore
import AutoHeightWebView from 'react-native-autoheight-webview';
import Orientation from "react-native-orientation";
import {CommonUtils, FileUtils, isIOS} from "my-rn-base-utils";
import {VContainerLoad} from 'my-rn-base-component'
import {isEqual} from "lodash";

//region process html before
const BODY_TAG_PATTERN = /\<\/ *body\>/

const style = `
<style>
body, html, #height-wrapper {
    padding: 0;
    margin: 3px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}
h1 { font-size: 28px }
h2 { font-size: 26px }
h3 { font-size: 25px }
h4 { font-size: 23px }
h5 { font-size: 22px }
p,span,a,div,b,tr,td,em,font,i,u,label,li,q,strike,strong,sub,sup,title,th { font-size: 21px }

</style>
`

const codeInject = (html) => html.replace(BODY_TAG_PATTERN, style + "</body>");

/**
 * Thay thế [resource_server] bằng image base64 nếu nó đã được cache. Còn không thay thế bằng url online
 */
export async function webProcessHtml(html: string, ROOT_RESOURCE: string, dirCacheImage: string): Promise<string> {
    if (html == null)
        return null;
    if (html.includes("[resource_server]")) {
        let startIndex = 0;
        let listSrc: string[] = [];
        while (true) {
            startIndex = html.indexOf("[resource_server]", startIndex);
            if (startIndex < 0) break;
            let endIndex0 = html.indexOf(".jpg", startIndex);
            let endIndex1 = html.indexOf(".png", startIndex);

            let endIndex;
            if (endIndex1 > 0 && endIndex0 > 0)
                endIndex = Math.min(endIndex0, endIndex1);
            else if (endIndex1 < 0 && endIndex0 < 0)
                break;
            else if (endIndex0 > 0)
                endIndex = endIndex0;
            else
                endIndex = endIndex1;

            endIndex += 4;
            let src = html.substring(startIndex, endIndex);
            listSrc.push(src);
            startIndex = endIndex;
        }
        for (let src of listSrc) {
            let subPath = src.replace("[resource_server]", "");
            subPath += ".base64";
            if (await isCache(subPath, dirCacheImage)) {
                let newSrc = "data:image/png;base64, ";
                newSrc += await FileUtils.readFileFromDocumentDir(subPath);
                html = html.replace(src, newSrc)
            }
        }

        html = html.replaceAll("[resource_server]", ROOT_RESOURCE)
    }
    if (!BODY_TAG_PATTERN.test(html))
        html = "<body> " + html + "</body> ";
    html = codeInject(html);
    return html;
}

function isCache(subPath: string, dirCache: string) {
    if (dirCache==null) return false;
    return FileUtils.exists(dirCache + subPath);
}

//endregion

interface Props {
    htmlSource: WebViewHtmlSource
    ROOT_RESOURCE: string
    dirCacheImage: string // thường là RNFetchBlob.fs.dirs.DocumentDir + "/download/"
    style?: StyleProp<ViewStyle>;
    isAutoHeightWebView?: boolean
    isFullWidth?: boolean
    javaScriptEnabled?: boolean
    dataDetectorTypes?: DataDetectorTypes | DataDetectorTypes[];
}

export class WebViewCustom extends Component<Props> {
    static defaultProps = {
        javaScriptEnabled: true
    };
    private id = 0;
    private width: number;
    private html: string;
    private vContainer: VContainerLoad;

    constructor(props) {
        super(props);
        if (this.props.isFullWidth) {
            this.width = CommonUtils.getScreenW();
            this._orientationDidChange = this._orientationDidChange.bind(this);
        }
    }

    //region orientation manager if full width
    private _orientationDidChange(orientation) {
        let dimension = CommonUtils.getScreenDimension();
        let screenW;
        let {widthS, heightS} = dimension;
        if (orientation == "LANDSCAPE") {
            screenW = Math.max(widthS, heightS);
        } else
            screenW = Math.min(widthS, heightS);
        if (screenW != this.width) {
            this.width = screenW;
            this.vContainer && this.vContainer.forceUpdate();
        }
    }

    componentDidMount() {
        if (this.props.isFullWidth && this.props.isAutoHeightWebView) {
            Orientation.addOrientationListener(this._orientationDidChange);
        }
    }

    componentWillUnmount() {
        if (this.props.isFullWidth && this.props.isAutoHeightWebView) {
            Orientation.removeOrientationListener(this._orientationDidChange);
        }
    }

    //endregion

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props.htmlSource, nextProps.htmlSource);
    }

    private async loadDataAsync(): Promise<boolean> {
        this.html = await webProcessHtml(this.props.htmlSource.html, this.props.ROOT_RESOURCE, this.props.dirCacheImage);
        return true;
    }

    private renderContent() {
        let style = [];
        if (this.width) {
            style.push({width: this.width});
        }
        if (this.props.style)
            style.push(this.props.style);

        let webProps: any = {
            style: style, scalesPageToFit: !isIOS(),
            source: {html: this.html, baseUrl: this.props.htmlSource.baseUrl || ""}
        };

        if (this.props.isAutoHeightWebView) {
            return (
                <AutoHeightWebView
                    {...webProps}
                    onHeightUpdated={(hight) => {console.log("onHeightUpdated: ", hight)}}
                    enableAnimation={false}
                />
            );
        } else
            return (
                <WebView
                    {...webProps}
                />
            );
    }

    render() {
        this.id++;
        return (
            <VContainerLoad
                ref={(ref) => {this.vContainer = ref}}
                id={this.id}
                loadDataAsync={this.loadDataAsync.bind(this)}
                onRender={this.renderContent.bind(this)}/>
        )
    }
}

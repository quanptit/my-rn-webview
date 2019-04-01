import { Component } from 'react';
import { DataDetectorTypes, StyleProp, ViewStyle, WebViewHtmlSource } from "react-native";
/**
 * Thay thế [resource_server] bằng image base64 nếu nó đã được cache. Còn không thay thế bằng url online
 */
export declare function webProcessHtml(html: string, ROOT_RESOURCE: string, dirCacheImage: string): Promise<string>;
interface Props {
    htmlSource: WebViewHtmlSource;
    ROOT_RESOURCE: string;
    dirCacheImage: string;
    style?: StyleProp<ViewStyle>;
    isAutoHeightWebView?: boolean;
    isFullWidth?: boolean;
    javaScriptEnabled?: boolean;
    dataDetectorTypes?: DataDetectorTypes | DataDetectorTypes[];
}
export declare class WebViewCustom extends Component<Props> {
    static defaultProps: {
        javaScriptEnabled: boolean;
    };
    private id;
    private width;
    private html;
    private vContainer;
    constructor(props: any);
    private _orientationDidChange;
    componentDidMount(): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: any, nextState: any): boolean;
    private loadDataAsync;
    private renderContent;
    render(): JSX.Element;
}
export {};

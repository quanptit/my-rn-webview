/// <reference types="react" />
import { StyleProp, ViewStyle } from 'react-native';
import { HeaderColors } from "my-rn-header-bar";
import { ComponentNoUpdate } from "my-rn-base-component";
interface Props {
    ROOT_RESOURCE: string;
    dirCacheImage: string;
    html: string;
    headerColors: HeaderColors;
    title: string;
    rightButton?: {
        onPress: VoidFunction;
        title: string;
    };
    isLockLanscape?: boolean;
    callbackUpdateScore?: (score: {
        noTotal: number;
        noCorrect: number;
    }) => void;
    style?: StyleProp<ViewStyle>;
}
export declare class HtmlScreen extends ComponentNoUpdate<Props> {
    private lastIsPORTRAIT;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    renderChild(): JSX.Element;
    render(): JSX.Element;
    _renderHeader(): JSX.Element;
    _renderButtonLuyenTap(): any;
}
export {};

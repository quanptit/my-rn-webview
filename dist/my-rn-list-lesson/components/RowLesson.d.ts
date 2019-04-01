import { Component } from 'react';
import { PartSummary, ScorePoint, SubMenuSettingObj } from "../../my-rn-commons/Objs";
export interface RowLessonState {
    noCorrect: number;
    noTotal: number;
}
interface Props {
    rowData: PartSummary;
    index: number;
    onPress: (rowData: PartSummary, rowUI: RowLesson, data?: any) => void;
    onRender: (state: RowLessonState, rowData: PartSummary, index: number, rowUI: RowLesson, hideDownloadBtn?: boolean, subMeuSetting?: SubMenuSettingObj[], onPress?: VoidFunction) => any;
    hideDownloadBtn?: boolean;
    subMeuSetting?: SubMenuSettingObj[];
    saveObjectFirebaseRef?: (key: string, valueSave: string | object) => any;
}
export declare class RowLesson extends Component<Props, RowLessonState> {
    private _isMounted;
    constructor(props: any);
    shouldComponentUpdate(nextProps: Props, nextState: any): boolean;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    updateDownloadState(partSummary: PartSummary): void;
    private updateScoreHasSaved;
    callbackUpdateScore(params: ScorePoint): Promise<any>;
    onPressRowLesson(data?: any): void;
    render(): any;
}
export {};

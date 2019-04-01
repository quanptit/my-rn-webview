import { Component } from 'react';
import { AppUserDataUtils } from "../../my-rn-commons/utils/data/AppUserDataUtils";
import { DownloadPartSummaryUtils } from "../../my-rn-commons/utils/data/download/DownloadPartSummaryUtils";
import { isEqual, sendError } from "../../my-rn-commons/utils/CommonUtils";
export class RowLesson extends Component {
    constructor(props) {
        super(props);
        this.state = { noCorrect: 0, noTotal: 0 };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props.rowData, nextProps.rowData) || !isEqual(this.props.index, nextProps.index)
            || !isEqual(this.props.hideDownloadBtn, nextProps.hideDownloadBtn) || !isEqual(this.props.subMeuSetting, nextProps.subMeuSetting)
            || !isEqual(this.state, nextState);
    }
    async componentDidMount() {
        this._isMounted = true;
        DownloadPartSummaryUtils.registerCallBackWhenDownloadComplete(this);
        await this.updateScoreHasSaved();
    }
    componentWillUnmount() {
        this._isMounted = false;
        DownloadPartSummaryUtils.unregisterCallBackWhenDownloadComplete(this);
    }
    updateDownloadState(partSummary) {
        if (partSummary != null && partSummary.childId === this.props.rowData.childId) {
            this.props.rowData.isDownloadError = partSummary.isDownloadError;
            this.props.rowData.isDownloading = partSummary.isDownloading;
            this.props.rowData.isDownloaded = partSummary.isDownloaded;
            this.forceUpdate();
        }
    }
    async updateScoreHasSaved() {
        let pathBaiHoc = this.props.rowData.pathBaiHoc;
        if (pathBaiHoc) {
            let result = await AppUserDataUtils.getTwoScore(pathBaiHoc);
            if (result && this._isMounted)
                this.setState({ noCorrect: result.noCorrect, noTotal: result.noTotal });
        }
        else
            sendError("updateScoreHasSaved: pathBaiHoc nil");
    }
    async callbackUpdateScore(params) {
        if (params.noCorrect < this.state.noCorrect && params.noTotal === this.state.noTotal)
            return null;
        if (params.noCorrect == undefined)
            params.noCorrect = 0;
        await AppUserDataUtils.saveTwoScore(this.props.rowData.pathBaiHoc, params.noCorrect, params.noTotal, this.props.saveObjectFirebaseRef);
        if (this._isMounted)
            this.setState({ noCorrect: params.noCorrect, noTotal: params.noTotal });
    }
    onPressRowLesson(data) {
        this.props.onPress(this.props.rowData, this, data);
    }
    render() {
        return this.props.onRender(this.state, this.props.rowData, this.props.index, this, this.props.hideDownloadBtn, this.props.subMeuSetting, this.onPressRowLesson.bind(this));
    }
}

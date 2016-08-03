import * as React from "react";
import {IconListState} from "../../Icon/iconListReducer";
import {Dispatch} from "redux/index";
import IconList from "../../Icon/components/IconList";
import {connect} from "react-redux";
import {MainState} from "../../../app/appReducer";
import {windowContentTypes} from "../index";
import "../styles/folder.less";


interface FolderPropsFromParent {
    container: String;
    backgroundType?: String;
    backgroundArgs?: any;
}
interface FolderPropsFromRedux {
    iconList: IconListState;
    dispatch: Dispatch<any>;
}
type FolderProps = FolderPropsFromParent & FolderPropsFromRedux;

let FolderComponent = (props: FolderProps) => {
    let {container, backgroundType, backgroundArgs, iconList, dispatch} = props;
    let Background = backgroundType && windowContentTypes[backgroundType as string];
    return <div className="wm-folder" data-container-name={container}>
        {Background && <div className="wm-folder-background">
            <Background {...backgroundArgs} />
        </div>}
        <IconList container={container} iconList={iconList} dispatch={dispatch} />
    </div>
};

function mapStateToProps({iconList}: MainState, ownProps: FolderPropsFromParent) {
    return {iconList};
}

export default connect(mapStateToProps, null)(FolderComponent);
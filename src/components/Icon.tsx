import {IconState} from "../reducers/IconListReducer";
import * as React from "react";
import 'styles/Icon.less'
import {Action} from "redux/index";
import {moveIcon} from "../actions/Icon";
import {createWindow} from "../actions/Window";

interface IconProps {
    icon: IconState,
    dispatch: (a:Action) => Action; //Workaround for WebStorm error highlighting bug https://youtrack.jetbrains.com/issue/WEB-22374
}

export class Icon extends React.Component<IconProps, {}> {
    constructor(props:IconProps) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }
    onMouseDown(event: __React.MouseEvent) {
        let {iconId, pos} = this.props.icon;
        this.props.dispatch(moveIcon(iconId, pos, event));
    }
    onDoubleClick() {
        let {title, componentType} = this.props.icon;
        this.props.dispatch(createWindow(componentType, title));
    }
    render() {
        let {pos, title, imageClass} = this.props.icon;

        return <div className="wm-icon"
                    style={{left: pos[0], top: pos[1]}}
                    onMouseDown={this.onMouseDown}
                    onDoubleClick={this.onDoubleClick}
                    tabIndex="-1">
            <div className={"wm-icon-image " + imageClass} />
            <div className="wm-icon-title">
                <span className="wm-icon-title-text">{title}</span>
            </div>
        </div>;
    }
}
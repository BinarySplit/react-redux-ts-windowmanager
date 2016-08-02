import 'normalize.css/normalize.css';
import './appStyle.less';
import * as React from 'react';
import {connect} from "react-redux";
import {Dispatch} from "redux/index";
import {memoizeMethodWithKey} from "../utils/memoize";
import {DragParams} from "../modules/Drag/dragReducer";
import {MainState} from "../app/appReducer";
import {drag, dragEnd} from "../modules/Drag/dragActions";
import {IconState, IconListState} from "../modules/Icon/iconListReducer";
import {Icon} from "../modules/Icon/Icon";
import {WindowListState} from "../modules/Window/windowListReducer";
import {WindowList} from "../modules/Window/components/WindowList";


interface AppProps {
    windowList: WindowListState;
    iconList: IconListState;
    dragParams: DragParams;
    dispatch: Dispatch<any>; //Workaround for WebStorm error highlighting bug https://youtrack.jetbrains.com/issue/WEB-22374
}

export class AppComponent extends React.Component<AppProps, {}> {
    static displayName: "AppComponent";
    constructor(props:AppProps) {
        super(props);
        this.onMouseEvent = this.onMouseEvent.bind(this);
    }
    onMouseEvent(event:__React.MouseEvent) {
        let {dragParams, dispatch} = this.props;
        //An event with the coordinates of the top of the browser's UI window ([0, -30]) is created
        // right before dragend if drag events haven't had their default prevented, or the browser is lagging
        if(event.pageY < 0) return;
        if(typeof event.button === "number" && event.button > 0) return;
        if(dragParams != null) {
            dispatch(event.type == "mousemove"
                     ? drag(event, dragParams)
                     : dragEnd(event, dragParams));
            event.preventDefault();
        }
    }
    @memoizeMethodWithKey
    renderIcon(key: string, icon: IconState) {
        return <Icon key={key} icon={icon} dispatch={this.props.dispatch} />
    }
    render() {
        let {windowList, iconList} = this.props;
        return (
            <div className="wm-window-manager"
                 onMouseMove={this.onMouseEvent}
                 onMouseUp={this.onMouseEvent}>
                <div id="icons">
                    {iconList.icons
                        .filter(i => i.container == "desktop")
                        .map(i => this.renderIcon(i.iconId.toString(), i))}
                </div>
                <WindowList windowList={windowList} dispatch={this.props.dispatch} />
                <div id="ghostIcon">
                    {iconList.ghostIcon && this.renderIcon("ghost", iconList.ghostIcon)}
                </div>
            </div>
        );
    }
}

function mapStateToProps ({windowList, iconList, dragParams}:MainState, ownProps:{}):{} {
    return {windowList, iconList, dragParams};
}
export default connect(mapStateToProps, null)(AppComponent);



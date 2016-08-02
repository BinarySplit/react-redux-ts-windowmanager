import * as shallowCompare from "react-addons-shallow-compare";
import * as React from "react";
import {IconState} from "../iconListReducer";
import Icon from "./Icon";

interface GhostIconProps {
    icon: IconState;
    visible: Boolean;
}

export default class GhostIcon extends React.Component<GhostIconProps, void> {
    shouldComponentUpdate(nextProps:GhostIconProps, nextState:void) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        let {icon, visible} = this.props;
        return <div id="ghostIcon">
            {icon && visible && <Icon icon={this.props.icon} dispatch={null} />}
        </div>;
    }
}
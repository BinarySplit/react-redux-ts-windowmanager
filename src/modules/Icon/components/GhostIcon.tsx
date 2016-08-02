import * as shallowCompare from "react-addons-shallow-compare";
import * as React from "react";
import {IconState} from "../iconListReducer";
import Icon from "./Icon";

interface GhostIconProps {
    icon: IconState;
}

export default class GhostIcon extends React.Component<GhostIconProps, void> {
    shouldComponentUpdate(nextProps:GhostIconProps, nextState:void) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        return <div id="ghostIcon">
            {this.props.icon && <Icon icon={this.props.icon} dispatch={null} />}
        </div>;
    }
}
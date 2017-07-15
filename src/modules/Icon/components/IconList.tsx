import * as React from "react";
import {Dispatch} from "redux/index";
import {memoizeMethodWithKey} from "../../../utils/memoize";
import {IconListState, IconState} from "../iconListReducer";
import Icon from "./Icon";

interface IconListProps {
    iconList: IconListState;
    container: String;
    dispatch: Dispatch<any>;
}

export default class IconList extends React.PureComponent<IconListProps, {}> {
    @memoizeMethodWithKey
    renderIcon(key: string, icon: IconState, isSelected: Boolean) {
        return <Icon key={key} icon={icon} dispatch={this.props.dispatch} />
    }
    render() {
        let {container, iconList:{icons, selectedId}} = this.props;
        return <div className="wm-icons-list">
            {icons
                .filter(i => i && i.container == container)
                .map(icon => this.renderIcon(icon.iconId.toString(), icon, icon.iconId == selectedId))}
        </div>;
    }
}

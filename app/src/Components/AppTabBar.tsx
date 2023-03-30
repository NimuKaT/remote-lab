import React from "react";
import AppTab from "./AppTab";

interface AppTabBarProp {
    tabList: Array<string>;
    activeTab: string;
}

export default class AppTabBar extends React.Component<AppTabBarProp, {}> {



    render(): React.ReactNode {
        return (
            <div className="AppTabBar">
                {this.props.tabList.map((tabName: string) => {
                    return (
                        <AppTab key={tabName} ref={"AppTab-"+tabName} Name={tabName}>{tabName}</AppTab>
                    )
                })}
            </div>
        )
    }
}
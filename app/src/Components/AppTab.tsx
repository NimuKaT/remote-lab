import React from "react";

interface AppTabProp extends React.PropsWithChildren {
    Name?: String;
}

export default class AppTab extends React.Component<AppTabProp, {}> {


    render() {
        return (
            <>
                {this.props.children}
            </>
        )
    }
}
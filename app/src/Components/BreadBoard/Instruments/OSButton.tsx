import React from "react";
import { Group, Rect } from "react-konva";

type OSButtonP = {
    x: number,
    y: number,
    width?: number,
    height?: number,
    fill?: string,
    children?: string | JSX.Element | Array<JSX.Element>
}
type OSButtonS = {}

export default class OSButton extends React.Component<OSButtonP, OSButtonS> {
    render(): React.ReactNode {
        return <Group x={this.props.x} y={this.props.y}>
            <Rect x={0} y={0}
                width={this.props.width? this.props.width : 24} 
                height={this.props.height? this.props.height : 10}
                fill={this.props.fill? this.props.fill: "#888888"}
                cornerRadius={2}
            />
            {this.props.children}
        </Group>
    }
}
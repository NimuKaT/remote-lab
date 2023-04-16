import React from "react";
import { Group, Line } from "react-konva";
import BBWire from "./BBWire";

interface BBWireObjP {
    wire: BBWire
}

interface BBWireObjS {}

export default class BBWireObj extends React.Component<BBWireObjP, BBWireObjS> {
    
    componentDidMount(): void {
        this.props.wire.getRef(this);
    }

    render(): React.ReactNode {
        return <Group> 
            <Line
                x={0}
                y={0}
                points={this.props.wire.getPoints()}
                stroke={this.props.wire.color}
                strokeWidth={10}
                opacity={0.5}
            />
        </Group>
    }

}
import React from "react";
import { Circle, Group, Line } from "react-konva";
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
        let points = this.props.wire.getPoints()
        return <Group> 
            {this.props.wire.deleted? '': 
            <>
            <Circle x={points[0]} y={points[1]} radius={4} fill="grey"/>
            <Circle x={points[2]} y={points[3]} radius={4} fill="grey"/>
            <Line
                x={0}
                y={0}
                points={this.props.wire.getPoints()}
                stroke={this.props.wire.color}
                strokeWidth={10}
                opacity={1}
            /></>}
        </Group>
    }

}
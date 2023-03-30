import React from "react";
import { Group, Line, Rect } from "react-konva";
import SPNode from "./Node";
import NodeObject from "./NodeObject";
import SpiceWire from "./SpiceWire";

interface SCWireObjectP {
    wire: SpiceWire;
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    isPlaced: boolean,
    nodes: Array<SPNode>
    deleted: boolean
}

interface SCWireObjectS {

}

export default class SCWireObject extends React.Component<SCWireObjectP, SCWireObjectS> {


    componentDidMount(): void {
        this.props.wire.setUpdate(this.forceUpdate.bind(this))
    }


    render(): React.ReactNode {
        return (<Group
            x={this.props.x1}
            y={this.props.y1}
            visible={!this.props.deleted}>

                <Line
                    x={0}
                    y={0}
                    stroke={'black'}
                    strokeWidth={0.5}
                    points={[0, 0, this.props.x2 - this.props.x1, this.props.y2 - this.props.y1]}
                    opacity={this.props.isPlaced ? 1 : 0.5}
                />
                {this.props.nodes.map((node: SPNode, index: number) => {
                    return (<NodeObject key={index} node={node} initialCoord={node.getInitPos()} isSelected={false}/>)
                    // return <Rect x={0} y={0} width={4} height={4} stroke={'black'} strokeWidth={0.5}/>
                })}

        </Group>)
    }
}
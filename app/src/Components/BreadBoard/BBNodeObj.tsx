import React from "react";
import { Rect } from "react-konva";
import BBNode from "./BBNode";

interface BBNodeObjP {
    node: BBNode
    valid?: boolean
    shift?: boolean
}

interface BBNodeObjS {

}

export default class BBNodeObj extends React.Component<BBNodeObjP, BBNodeObjS> {
    length: number = 16;
    render(): React.ReactNode {
        return <Rect
            x={ this.props.shift ? 
                this.props.node.getShiftX() - this.length/2:
                this.props.node.getLocalX() - this.length/2}
            y={ this.props.shift ? 
                this.props.node.getShiftY() - this.length/2:
                this.props.node.getLocalY() - this.length/2}
            width={this.length}
            height={this.length}
            stroke={this.props.valid ? 'green' : (this.props.valid === false ? 'red' : 'grey')}
            strokeWidth={0.1}
            fill={this.props.valid ? 'green' : (this.props.valid === false ? 'red' : 'grey')}
            opacity={0.4}
            
        />
    }
}
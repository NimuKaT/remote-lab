import React from "react";
import { Rect } from "react-konva";
import BBNode from "./BBNode";

interface BBNodeObjP {
    node: BBNode
    valid?: boolean
    shift?: boolean
}

interface BBNodeObjS {
    isMouseOver: boolean
}

export default class BBNodeObj extends React.Component<BBNodeObjP, BBNodeObjS> {
    length: number = 12;

    constructor(P: BBNodeObjP, S: BBNodeObjS) {
        super(P, S)
        this.state = {
            isMouseOver: false
        }
    }

    onMouseOver() {
        this.setState({
            isMouseOver: true
        })
    }

    onMouseOut() {
        this.setState({
            isMouseOver: false
        })
    }


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
            fill={this.props.node.color? this.props.node.color: (this.props.valid ? 'green' : (this.props.valid === false ? 'red' : 'grey'))}
            opacity={this.props.node.opacity? this.props.node.opacity: 0.4}
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            
        />
    }
}
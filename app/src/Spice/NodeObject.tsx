import { Vector2d } from "konva/lib/types";
import React from "react";
import { Rect } from "react-konva";
import SPNode from "./Node";
import {Rect as rect} from "konva/lib/shapes/Rect"

interface NodeObjectP {
    node: SPNode;
    initialCoord: Vector2d;
    isSelected: boolean;
}

interface NodeObjectS {

}


export default class NodeObject extends React.Component<NodeObjectP, NodeObjectS> {
    ref: React.RefObject<rect>;
    public static defaultProps = {
        isSelected: false
    }

    constructor(prop: any, state: any) {
        super(prop, state);
        this.ref = React.createRef<rect>();
        this.props.node.setRef(this);
    }

    componentDidMount(): void {
        if (this.ref.current) {
            // console.log("Updating node position")
            // console.log(this.ref.current.absolutePosition())
            this.props.node.setPos(this.ref.current.absolutePosition());
        }
        this.forceUpdate();
    }

    componentDidUpdate(prevProps: Readonly<NodeObjectP>, prevState: Readonly<NodeObjectS>, snapshot?: any): void {
       this.updatePos(); 
    }

    updatePos() {
        if (this.ref.current) {
            this.props.node.setPos(this.ref.current.absolutePosition());
        }
    }

    render() {
        // console.log(this.props.initialCoord)
        return (<>
        {
            // this.props.isSelected  || this.props.node.deleted ?
            // '' : 
        <Rect
            ref={this.ref}
            x={this.props.initialCoord.x}
            y={this.props.initialCoord.y}
            width={8}
            height={8}
            offset={{x:4, y:4}}
            stroke='blue'
            strokeWidth={this.props.node.isConnected() ? 0 : 0.5}
            listening={true}
            />
        }
       </>)
    }
}
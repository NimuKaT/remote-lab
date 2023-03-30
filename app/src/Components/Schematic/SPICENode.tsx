import React from "react";
import { Rect } from "react-konva";
import { SCCoordinate } from "./SCCoordinate";

interface SpiceNodeProps {
    Parent: any;
    SCNetName: string;
    Coordinate: SCCoordinate;
    attachedNodes: Array<SpiceNode>;
}

export default class SpiceNode extends React.Component<SpiceNodeProps, {}> {


    isAttached(): boolean {
        return this.props.attachedNodes.length > 0;
    }

    render(): JSX.Element {
        return (
            <>
                <Rect
                    x={this.props.Coordinate.x}
                    y={this.props.Coordinate.y}
                    width={8}
                    height={8}
                    offset={{x:4, y:4}}
                    stroke='blue'
                    strokeWidth={0.5}
                >

                </Rect>

            </>
        )

    }
}
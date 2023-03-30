import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import { Layer, Line, Shape } from "react-konva";
import NodeManager from "../../Spice/NodeManager";
import { SCCoordinate } from "./SCCoordinate";
import SPNode from "../../Spice/Node";
import NodeObject from "../../Spice/NodeObject";

interface SCResistorProp extends SCCoordinate {
    Value: String;
    NumbericalValue: number;
    Label: String;
    Orientation: number;
    nodeMan: NodeManager;
}

interface SCResistorState extends SCCoordinate{
    test?: any;
    nodes: Array<SPNode>;
}

export default class SCResistor extends React.Component<SCResistorProp, SCResistorState> {

    componentDidMount() {
        let nodes: Array<SPNode>  = [];
        nodes.push(this.props.nodeMan.newNode(this));
        nodes.push(this.props.nodeMan.newNode(this));
        // nodes[0].updateRelPos({x: 0, y: 16})
        // nodes[1].updateRelPos({x: 80, y: 16})
        this.setState({x: this.props.x, y: this.props.y, test: 2, nodes: nodes});

    }

    render() {
        return (
            <Layer
                x={this.props.x}
                y={this.props.y}
                  onMouseOver={(evt: KonvaEventObject<MouseEvent>) => {
                        evt.currentTarget.opacity(0.5);
                    }}
                    onMouseOut={(evt: KonvaEventObject<MouseEvent>) => {
                        evt.currentTarget.opacity(1);
                        this.setState(Object.assign({}, this.state, evt.currentTarget.getPosition()));  
                    }}
                    draggable={true}
                    // onDragEnd={() => {
                    //     this.state.nodes.map((nodes: SPNode) => {
                    //         nodes.ateAbsPos();
                    //     })
                    // }}
            >
                <Shape
                sceneFunc={(context: Konva.Context, shape: Konva.Shape) => {
                    context.beginPath();
                    context.moveTo(16, 0);
                    context.lineTo(64, 0);
                    context.lineTo(64, 32);
                    context.lineTo(16, 32);
                    context.closePath()
                    context.fillStrokeShape(shape);

                }}
                fill="#ffffff"
                stroke="black"
                strokeWidth={2}/>
                <Line 
                    x={0}
                    y={0}
                    points={[0,16,16,16]}
                    stroke="black"
                    strokeWidth={0.5}
              
                />
                {(this.state &&
                    this.state.nodes &&
                        this.state.nodes[0]) ? <NodeObject node={this.state.nodes[0]} initialCoord={{x: 0, y: 16}}/> : ''
                }
                <Line 
                    x={0}
                    y={0}
                    points={[64,16,80,16]}
                    stroke="black"
                    strokeWidth={0.5}
                />
                {(this.state &&
                    this.state.nodes &&
                        this.state.nodes[1]) ? <NodeObject node={this.state.nodes[1]} initialCoord={{x: 80, y: 16}}/> : ''
                }
            </Layer>
        )
    }
}
import { Vector2d } from 'konva/lib/types'
import {Text as text} from 'konva/lib/shapes/Text'
import React from 'react'
import { Group, Text } from 'react-konva'

interface SpiceTextP {
    // coord: Vector2d
    x: number
    y: number
    orientation?: string;
    justification: string
    text: string;
    fontSize?: number
    color?: string
    font?: string,
    width?: number
}

interface SpiceTextS {
    relPos: Vector2d
    width: number;
    height: number;
    rotation: number;
}


export default class SpiceText extends React.Component<SpiceTextP, SpiceTextS> {
    textRef: React.RefObject<text> = React.createRef<text>();

    constructor(P: SpiceTextP, S: SpiceTextS) {
        super(P, S);
        this.state = {
            relPos: {x: 0, y:0},
            width: 0,
            height: 0,
            rotation: 90
        };

    }

    componentDidMount() {
        let x: number = 0, y: number = 0;
        let width: number = 0, height: number = 0;
        let rot: number = 0;
        // console.log("Text Mounted: " + this.props.justification);
        
        if (this.textRef.current) {
            width = this.textRef.current.getTextWidth();
            height = this.textRef.current.height();
            if (this.props.justification === 'Left') {
                x = 0;
                y = - Math.round(height/2)
                rot = 0;
            } else if (this.props.justification === 'Right') {
                x = - width;
                y = - Math.round(height/2)
                rot = 0;
            } else if (this.props.justification === "Center") {
                x = - Math.round(width/2);
                y = - Math.round(height/2)
                rot = 0;
            } else if (this.props.justification === "Top" ) {
                x = - Math.round(width/2);
                y = 0;
                rot = 0;
            } else if (this.props.justification === "Bottom" ) {
                x = - Math.round(width/2);
                y = - height
                rot = 0;
            } else if (this.props.justification === "VLeft" ) {
                x = - Math.round(height/2);
                y = 0 ;
                rot = -90;
            } else if (this.props.justification === "VRight" ) {
                x = - Math.round(height/2);
                y =  width;
                rot = -90;
            } else if (this.props.justification === "VCenter" ) {
                x = - Math.round(height/2);
                y =  Math.round(width/2);
                rot = -90;
            } else if (this.props.justification === "VTop" ) {
                x = 0;
                y =  Math.round(width/2);
                rot = -90;
            } else if (this.props.justification === "VBottom" ) {
                x = - height;
                y =  Math.round(width/2);
                rot = -90;
            }
            this.setState({
                relPos: {
                    x: x,
                    y: y
                },
                rotation: rot
            })
        }
    }


    render(): JSX.Element {
        let x: number = 0, y: number = 0;
        let width: number = 0, height: number = 0;
        let rot: number = 0;
        if (this.textRef.current) {
            width = this.textRef.current.getTextWidth();
            height = this.textRef.current.height();
            if (this.props.justification === 'Left') {
                x = 0;
                y = - Math.round(height/2)
                rot = 0;
            } else if (this.props.justification === 'Right') {
                x = - width;
                y = - Math.round(height/2)
                rot = 0;
            } else if (this.props.justification === "Center") {
                x = - Math.round(width/2);
                y = - Math.round(height/2)
                rot = 0;
            } else if (this.props.justification === "Top" ) {
                x = - Math.round(width/2);
                y = 0;
                rot = 0;
            } else if (this.props.justification === "Bottom" ) {
                x = - Math.round(width/2);
                y = - height
                rot = 0;
            } else if (this.props.justification === "VLeft" ) {
                x = - Math.round(height/2);
                y = 0 ;
                rot = -90;
            } else if (this.props.justification === "VRight" ) {
                x = - Math.round(height/2);
                y =  width;
                rot = -90;
            } else if (this.props.justification === "VCenter" ) {
                x = - Math.round(height/2);
                y =  Math.round(width/2);
                rot = -90;
            } else if (this.props.justification === "VTop" ) {
                x = 0;
                y =  Math.round(width/2);
                rot = -90;
            } else if (this.props.justification === "VBottom" ) {
                x = - height;
                y =  Math.round(width/2);
                rot = -90;
            }
        }

        return (
        <Group
            x={this.props.x}
            y={this.props.y}
        >
            <Text
                ref={this.textRef}
                x={x}
                y={y}
                text={this.props.text}
                fontFamily={this.props.font ? this.props.font: 'Calibri'}
                fontSize={this.props.fontSize? this.props.fontSize:28}
                rotation={rot}
                fill={this.props.color ? this.props.color : 'black'}
                width={this.props.width? this.props.width: undefined}
                align='center'
            />
        </Group>
        )
    }
}
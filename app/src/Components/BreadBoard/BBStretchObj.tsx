import React from "react";
import BBStretchComp from "./BBStretchComp";
import { Group, Line } from "react-konva";
import { log } from "console";
import BBNodeObj from "./BBNodeObj";
import { Vector2d } from "konva/lib/types";
import SpiceText from "../../Spice/SpiceText";

interface BBStretchObjP {
    comp: BBStretchComp
}

interface BBStretchObjS {

}
export default class BBStretchObj extends React.Component<BBStretchObjP, BBStretchObjS> {
    rotateX(pos: Vector2d, rot: number) {
        return pos.x * Math.cos(rot) + pos.y * Math.sin(rot)
    }
    rotateY(pos: Vector2d, rot: number) {
        return pos.y * Math.cos(rot) - pos.x * Math.sin(rot)
    }
    rotateLine(refPos: Vector2d, points: [number, number, number, number], rot: number, strokeWidth?: number, color?: string) {
        return <Line
            x={0}
            y={0}
            points={[
                refPos.x + this.rotateX({x:points[0], y: points[1]}, rot),
                refPos.y - this.rotateY({x:points[0], y: points[1]}, rot),
                refPos.x + this.rotateX({x:points[2], y: points[3]}, rot),
                refPos.y - this.rotateY({x:points[2], y: points[3]}, rot),
            ]}
            stroke={color ? color :'black'}
            strokeWidth={strokeWidth ? strokeWidth : 1}
        />
    }


    render(): React.ReactNode {
        let rot: number = this.props.comp.getRot() / 180 * Math.PI;
        let nodes = this.props.comp.getNodes()
        let anchors = this.props.comp.getAnchors()
        let refPos = this.props.comp.getRefPos()
        let symbol = this.props.comp.getMainBody()
        let color = this.props.comp.isSelected? '#3324a5' : 'black'
        let strokeWidth = this.props.comp.isSelected? 2 : 1
        
        return <Group
            x={0}
            y={0}
            visible={!this.props.comp.isDeleted}
        >
            <Line
                x={0}
                y={0}
                points={[
                    nodes[0].getShiftX(),
                    nodes[0].getShiftY(),
                    refPos.x + this.rotateX(anchors[0], rot),
                    refPos.y - this.rotateY(anchors[0], rot)
                ]}
                stroke={color}
                strokeWidth={strokeWidth}

            />
            <Line
                x={0}
                y={0}
                points={[
                    nodes[1].getShiftX(),
                    nodes[1].getShiftY(),
                    refPos.x + this.rotateX(anchors[1], rot),
                    refPos.y - this.rotateY(anchors[1], rot)
                ]}
                stroke={color}
                strokeWidth={strokeWidth}
            />
            {symbol.lines.map((line) => {
                if (line.strokeWidth) {
                    if (line.color) {
                        return this.rotateLine(refPos, line.points, rot, line.strokeWidth, line.color )
                    }
                    return this.rotateLine(refPos, line.points, rot, line.strokeWidth, color)
                } else {
                    return this.rotateLine(refPos, line.points, rot, strokeWidth, color)
                }
            })}
            {symbol.rects.map((rect) => {
                return <>
                    {this.rotateLine(refPos, [rect.x, rect.y, rect.x+rect.w,rect.y],rot, strokeWidth, color)}
                    {this.rotateLine(refPos, [rect.x, rect.y, rect.x,rect.y+rect.h],rot, strokeWidth, color)}
                    {this.rotateLine(refPos, [rect.x+rect.w, rect.y, rect.x+rect.w,rect.y+rect.h],rot, strokeWidth, color)}
                    {this.rotateLine(refPos, [rect.x, rect.y+rect.h, rect.x+rect.w,rect.y+rect.h],rot, strokeWidth, color)}
                </>
            })}
            {this.props.comp.resLines.map((line) => {
                return this.rotateLine(refPos, line.points, rot, line.strokeWidth, line.color)
            })}
            {this.props.comp.type === 'cap' ? <SpiceText x={refPos.x+15} y={refPos.y} orientation="R0" justification="Left" text={this.props.comp.value} fontSize={14} color={color}/>: ""}
            {nodes.map((node) => {
                return <BBNodeObj node={node} valid={false} shift={true}/>
            })}
        </Group>
    }
}
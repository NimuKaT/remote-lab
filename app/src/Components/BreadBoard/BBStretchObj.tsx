import React from "react";
import BBStretchComp from "./BBStretchComp";
import { Group, Line } from "react-konva";
import { log } from "console";
import BBNodeObj from "./BBNodeObj";
import { Vector2d } from "konva/lib/types";

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
    rotateLine(refPos: Vector2d, points: [number, number, number, number], rot: number) {
        return <Line
            x={0}
            y={0}
            points={[
                refPos.x + this.rotateX({x:points[0], y: points[1]}, rot),
                refPos.y - this.rotateY({x:points[0], y: points[1]}, rot),
                refPos.x + this.rotateX({x:points[2], y: points[3]}, rot),
                refPos.y - this.rotateY({x:points[2], y: points[3]}, rot),
            ]}
            stroke={'black'}
            strokeWidth={1}
        />
    }


    render(): React.ReactNode {
        let rot: number = this.props.comp.getRot() / 180 * Math.PI;
        let nodes = this.props.comp.getNodes()
        let anchors = this.props.comp.getAnchors()
        let refPos = this.props.comp.getRefPos()
        let symbol = this.props.comp.getMainBody()
        
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
                stroke={'black'}
                strokeWidth={1}

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
                stroke={'black'}
                strokeWidth={1}
            />
            {symbol.lines.map((line) => {
                return this.rotateLine(refPos, line.points, rot)
            })}
            {symbol.rects.map((rect) => {
                return <>
                    {this.rotateLine(refPos, [rect.x, rect.y, rect.x+rect.w,rect.y],rot)}
                    {this.rotateLine(refPos, [rect.x, rect.y, rect.x,rect.y+rect.h],rot)}
                    {this.rotateLine(refPos, [rect.x+rect.w, rect.y, rect.x+rect.w,rect.y+rect.h],rot)}
                    {this.rotateLine(refPos, [rect.x, rect.y+rect.h, rect.x+rect.w,rect.y+rect.h],rot)}
                </>
            })}
            {nodes.map((node) => {
                return <BBNodeObj node={node} valid={false} shift={true}/>
            })}
        </Group>
    }
}
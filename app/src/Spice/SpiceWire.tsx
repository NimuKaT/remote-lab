import {Line as lines} from "konva/lib/shapes/Line";
import { Vector2d } from "konva/lib/types";
import React from "react";
import { Group, Line } from "react-konva";
import SPNode from "./Node";
import NodeManager from "./NodeManager";
import NodeObject from "./NodeObject";

export default class SpiceWire {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    shiftOffset: Vector2d = {x:0, y:0};
    label: string;
    isPlaced: boolean;
    refs: React.RefObject<lines>;
    nodes: Array<SPNode> = [];
    deleted: boolean = false;
    forceUpdate?: () => void;

    constructor(pos: Vector2d, label: string, nodeMan: NodeManager) {
        this.x1 = pos.x;
        this.x2 = pos.x;
        this.y1 = pos.y;
        this.y2 = pos.y;
        this.isPlaced = false;
        this.label = label;
        this.refs = React.createRef<lines>();
        this.nodes.push(nodeMan.newNode(this));
        this.nodes.push(nodeMan.newNode(this));
        this.nodes[0].setInitPos(0, 0);
        this.nodes[1].setInitPos(0, 0);
        this.nodes[0].setParent(this)
        this.nodes[1].setParent(this)
    }

    getX1() {
        return this.x1 + this.shiftOffset.x;
    }
    getX2() {
        return this.x2 + this.shiftOffset.x;
    }

    getY1() {
        return this.y1 + this.shiftOffset.y;
    }
    getY2() {
        return this.y2 + this.shiftOffset.y;
    }

    updateEndPoint(pos: Vector2d) {
        if (Math.abs(pos.x) > Math.abs(pos.y)) {

            this.x2 = pos.x + this.x1;
            this.y2 = this.y1;
        } else {
            this.y2 = pos.y + this.y1;
            this.x2 = this.x1;
        }
        if (Math.abs(pos.x) > 0 || Math.abs(pos.y) > 0) {

        this.nodes[1].setInitPos(this.x2-this.x1, this.y2-this.y1);
        this.nodes.forEach((node) => {
            node.updateConnection();
        })
        // if (this.forceUpdate) {
            // this.forceUpdate();
        // }
        }
    }

    setUpdate(forceUpdate: () => void) {
        this.forceUpdate = forceUpdate;
    }

    shift(shift: Vector2d) {
        if (this.shiftOffset.x != shift.x || this.shiftOffset.y != shift.y) {
            this.isPlaced = false;
            this.shiftOffset = shift;
            if (this.forceUpdate) {
                this.forceUpdate();
            }
        }
    }

    placeWire() {
        this.isPlaced = true;
        this.x1 = this.x1 + this.shiftOffset.x;
        this.x2 = this.x2 + this.shiftOffset.x;
        this.y1 = this.y1 + this.shiftOffset.y;
        this.y2 = this.y2 + this.shiftOffset.y;
        this.shiftOffset = {x:0, y:0}
    }

    cancelMove() {
        this.isPlaced = true;
        this.shiftOffset = {x:0, y:0}
    }

    getKonvaLayer(): JSX.Element {

        return (<>
            <Group x={this.x1 + this.shiftOffset.x}
                y={this.y1 + this.shiftOffset.y}
                ref={"layer-wire-" + this.label}>
                <Line
                    ref={this.refs}
                    x={0}
                    y={0}
                    stroke={'black'}
                    strokeWidth={0.5}
                    points={[0,0, this.x2-this.x1, this.y2-this.y1]}
                    opacity={this.isPlaced ? 1 : 0.5}
                />
                {this.nodes.map((node: SPNode, index: number) => {
                    return (<NodeObject key={index} node={node} initialCoord={node.getPos()} isSelected={false}/>)
                })}
            </Group>
        </>

        )

    }

    getPoints() {
        if (this.refs){
            if (this.refs.current) {
                this.refs.current.absolutePosition();
            }
        }
    }

    getSpice(): string {
        return "WIRE {this.x1}"
    }

    delete() {
        this.deleted = true;
        this.nodes.forEach(node => {
            node.delete();
        });
    }

    getSchematic(): Array<string> {
        return this.deleted ? [] : ['WIRE ' + this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2]
    }

    getOtherNode(node: SPNode) {
        let retNode: SPNode | undefined;
        this.nodes.forEach((n) => {
            if (node.id !== n.id) {
                retNode = n
            }
        })
        return retNode;
    }
}
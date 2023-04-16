import { Vector2d } from "konva/lib/types";
import React from "react";
import { CollisionBox } from "../../Spice/CollisionBox";
import BBNode from "./BBNode"
import BBWireObj from "./BBWireObj";

export default class BBWire {
    deleted: boolean = false
    nodes: Array<BBNode> = [];
    nodePos: [Vector2d, Vector2d] = [{x:0,y:0}, {x:0, y:0}];
    anchors: Array<Vector2d> = [];
    color: string = 'red'
    shiftVector: Vector2d = {x: 0, y:0}
    ref?: BBWireObj;


    placeNode(pos: Vector2d, index: number) {
        if (0 <= index && index <= 1) {
            this.nodePos[index].x = pos.x;
            this.nodePos[index].y = pos.y;
        }
        this.ref?.forceUpdate();
    }

    addAnchor(pos: Vector2d) {
        // Add checks to see if its a vaild anchor?
        this.anchors.push(pos);
    }

    removeAnchor() {
        this.anchors.pop();
    }

    insertAnchor() {

    }
    
    getPoints() {
        let points: Array<number> = [];
        this.nodePos.forEach((node) => {
            points.push(node.x)
            points.push(node.y)
        })
        return points;
    }

    moveAnchor(oldPos: Vector2d, newPos: Vector2d) {
        let index = this.anchors.findIndex((pos) => {
            return pos.x === oldPos.x && pos.y === oldPos.y
        })
        if (index >= 0) {
            this.anchors[index].x = newPos.x;
            this.anchors[index].y = newPos.y;
        }
    }

    shift(shift: Vector2d) {
        this.shiftVector = shift;
    }

    place(){}

    cancel(){}

    delete(){}

    checkSelection(box: CollisionBox): boolean {
        let flag: boolean = false;
        return flag

    }

    deselect(){}

    changeColor(newColor: string) {}

    getRef(ref: BBWireObj) {
        this.ref = ref;
    }
}
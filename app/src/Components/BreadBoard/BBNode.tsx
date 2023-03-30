import { Vector2d } from "konva/lib/types";

export default class BBNode {
    localPos: Vector2d;
    absPos?: Vector2d;
    shiftVec: Vector2d = {x: 0, y:0};
    nodeNet?: string;

    constructor(localPos: Vector2d, nodeNet?: string) {
        this.localPos = localPos;
        if (nodeNet) {
            this.nodeNet = nodeNet;
        }
    }

    getLocalX() {
        return this.localPos.x;
    }
    getLocalY() {
        return this.localPos.y;
    }

    setAbsPos(pos: Vector2d) {
        this.absPos = pos;
    }

    shift(shift: Vector2d) {
        this.shiftVec = shift;
    }

    place() {
        if (this.absPos) {
            this.absPos.x = this.absPos.x + this.shiftVec.x;
            this.absPos.y = this.absPos.y + this.shiftVec.y;
        }
        this.shiftVec = {x:0,y:0};
    }

    cancel() {
        this.shiftVec = {x:0,y:0};
    }


    isConnected(node: BBNode) {
        if (this === node) {
            return false
        } else {
            if (Math.abs(this.getLocalX() - node.getLocalX()) < 0.5 &&
                Math.abs(this.getLocalY() - node.getLocalY()) < 0.5) {
                
                return true
            }
            return false
        }
    }





}
import { Vector2d } from "konva/lib/types";

export default class BBNode {
    localPos: Vector2d;
    absPos?: Vector2d;
    shiftVec: Vector2d = {x: 0, y:0};
    nodeNet?: string;
    color?: string
    opacity?: number

    constructor(localPos: Vector2d, nodeNet?: string, color?: string, opacity?: number) {
        this.localPos = localPos;
        if (nodeNet) {
            this.nodeNet = nodeNet;
        }
        if (color) {
            this.color = color;
        }
        if (opacity) {
            this.opacity = opacity
        }
    }

    setLocalPos(pos: Vector2d) {
        this.localPos.x = pos.x;
        this.localPos.y = pos.y;
    }

    getLocalX() {
        return this.localPos.x;
    }
    getLocalY() {
        return this.localPos.y;
    }
    
    getPos() {
        return this.localPos;
    }

    getShiftX() {
        return this.localPos.x + this.shiftVec.x
    }
    getShiftY() {
        return this.localPos.y + this.shiftVec.y
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

    // pos: position relative to breadboard
    isHover(pos: Vector2d) {
        let flag: boolean = false;
        if (Math.abs(pos.x - this.getLocalX()) <= 4) {
            if (Math.abs(pos.y - this.getLocalY()) <= 4) {
                flag = true;
                // return {x: this.getLocalX(), y: this.getLocalY()}
            }
        }
        // return undefined;
        return flag;

    }




}
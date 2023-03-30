import { Vector2d } from "konva/lib/types";
import BBNode from "./BBNode";
import { ICSymbol } from "./ICSymbol";

export default class BBIC {
    pinCount: number = 6;
    modelName: string = "";
    orientation: string = 'R0';
    deleted: boolean = false
    localPos: Vector2d;
    absPos: Vector2d = {x:0,y:0};
    shiftVec: Vector2d = {x:0,y:0};
    nodes: Array<BBNode> = [];

    constructor(modelName: string, pos: Vector2d) {
        this.modelName = modelName;
        this.localPos = pos;
        // Temp nodes
        this.nodes.push(new BBNode({x:0,y:48}))
        this.nodes.push(new BBNode({x:24,y:48}))
        this.nodes.push(new BBNode({x:48,y:48}))
        this.nodes.push(new BBNode({x:48,y:0}))
        this.nodes.push(new BBNode({x:24,y:0}))
        this.nodes.push(new BBNode({x:0,y:0}))
    }

    getLocalX() {
        return this.localPos.x + this.shiftVec.x;
    }
    getLocalY() {
        return this.localPos.y + this.shiftVec.y;
    }

    shift(shift: Vector2d) {
        this.shiftVec = shift;
    }

    place() {
        this.localPos.x = this.localPos.x + this.shiftVec.x;
        this.localPos.y = this.localPos.y + this.shiftVec.y;
        this.shiftVec.x = 0;
        this.shiftVec.y = 0;
    }

    cancel() {
        this.shiftVec.x = 0;
        this.shiftVec.y = 0;
    }

    rotate() {
        if (this.orientation === 'R0') {
            this.orientation = 'R180'
        }
        else if (this.orientation === 'R180') {
            this.orientation = 'R0'
        }
    }

    getSymbol() {
        return ICSymbol;
    }

    getNodes() {
        return this.nodes;
    }
    delete() {
        this.deleted = true;
    }
    isDeleted() {
        return this.deleted;
    }
}
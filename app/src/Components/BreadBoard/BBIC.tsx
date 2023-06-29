import { Vector2d } from "konva/lib/types";
import BBNode from "./BBNode";
import { ICSymbol } from "./ICSymbol";
import { BBSymbol } from "./BBSymbol";

export default class BBIC {
    pinCount: number = 6;
    modelName: string = "";
    orientation: string = 'R0';
    deleted: boolean = false
    localPos: Vector2d;
    absPos: Vector2d = {x:0,y:0};
    shiftVec: Vector2d = {x:0,y:0};
    nodes: Array<BBNode> = [];
    isSelected: boolean = false;

    constructor(modelName: string, pos: Vector2d, pin: number) {
        this.modelName = modelName;
        this.localPos = pos;
        this.pinCount = pin;

        for (let i = 0; i < pin/2; i++) {
            this.nodes.push(new BBNode({x:24*i,y:48}));
        }
        for (let i = 0; i < pin/2; i++) {
            this.nodes.push(new BBNode({x:(pin/2-1)*24 -24*i,y:0}));
        }
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
        let sym: BBSymbol = {
            lines: [],
            rects: [],
            arcs: [],
            circles: []
        }
        for (let i = 0; i < this.pinCount/2; i++) {
            sym.rects.push({x:i*24 - 4, y: 0, w: 8, h: 12})
        }
        for (let i = 0; i < this.pinCount/2; i++) {
            sym.rects.push({x:i*24 - 4, y: 36, w: 8, h: 12})
        }
        sym.rects.push({x: -8, y: 12, w: this.pinCount/2*24 -8, h: 24})
        sym.arcs.push({x:-8, y:24, r: 5, startAng: 90, endAng: -90, clockwise:true})
        return sym
        // return ICSymbol;
    }

    select(x: number, y: number, w: number, h:number): boolean {
        let lx = this.localPos.x -8;
        let ly = this.localPos.y;
        let lw = this.pinCount/2*24 - 8;
        let lh = 48;
        let flag = false

        // console.log("%d <= %d && %d <= %d", x, lx, lx + lw, x + w);
        // console.log("%d <= %d && %d <= %d", y, ly, ly + lh, y + h);
        
        if (x <= lx && lx + lw <= x + w) {
            if (y <= ly && ly + lh <= y + h) {
                flag = true
            }
        } 
        this.isSelected = flag

        return flag
    }

    isHover(pos: Vector2d) {
        let flag = false
        let lx = this.localPos.x -8;
        let ly = this.localPos.y;
        let lw = this.pinCount/2*24 - 8;
        let lh = 48;
        if (lx <= pos.x && pos.x <= lx + lw) {
            if (ly <= pos.y && pos.y <= ly + lh) {
                flag = true
                this.isSelected = true
            }
        }
        return flag
    }

    deselect() {
        this.isSelected = false
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

    getNetList(): {prefix: string, nodes: Array<Vector2d>, value: string} {
        let lx = this.getLocalX(), ly = this.getLocalY();
        let nodes: Array<Vector2d> = []
        this.nodes.forEach((n) => {
            nodes.push({x: n.getLocalX() + lx, y: n.getLocalY() + ly})
        })
        return {prefix: "U", nodes: nodes, value: this.modelName}
    }

    getRep() {
        return {
            "modelName": this.modelName,
            "orientation": this.orientation,
            "localPos": this.localPos,
            "pinCount": this.pinCount
        }
    }
}
import { Vector2d } from 'konva/lib/types'
import {BBSymbol} from './BBSymbol'
import BBNode from './BBNode'
import BBStretchCompRef from './BBStrechCompRef'
import { LineCMD } from './Shapes/LineCMD'
import { ResColorMap } from './BBResColorMap'

export default class BBStretchComp {
    mainBody: BBSymbol
    anchorPoints: Array<Vector2d>
    nodes: Array<BBNode>
    rot: number = 0;
    mainBodyPos: Vector2d
    shiftVec: Vector2d = {x:0, y:0}
    isDeleted: boolean = false
    value: string = ''
    type: string
    resLines: Array<LineCMD> = []
    relRect: {lx:number,ly:number,hx:number,hy:number} = {lx:0,ly:0,hx:0,hy:0}

    constructor(name: string, pos: Vector2d, value: string) {
        this.type = name
        let refs = new BBStretchCompRef()
        this.value = value
        this.mainBody = refs.getSymbol(name);
        this.anchorPoints = refs.getAnchor(name);
        this.nodes = [];
        this.nodes.push(new BBNode({x:pos.x, y:pos.y}))
        this.nodes.push(new BBNode({x:pos.x, y:pos.y + 48}))
        this.mainBodyPos = {x: 0, y:0}
        this.mainBodyPos.x = (this.nodes[0].getLocalX() + this.nodes[1].getLocalX())/2;
        this.mainBodyPos.y = (this.nodes[0].getLocalY() + this.nodes[1].getLocalY())/2;
        let deltaX = this.nodes[1].getLocalX() - this.nodes[0].getLocalX();
        let deltaY = this.nodes[1].getLocalY() - this.nodes[0].getLocalY();
        let grad = deltaY / deltaX;
        let rot = Math.atan(grad)* 180 / Math.PI;
                if (deltaX >= 0) {
                    rot = 180+rot;
                }
        this.rot = rot -90
        this.decodeRes()
        this.getMainBodyRect()
    }

    placeNode(index: number, pos: Vector2d) {
        if (index < this.nodes.length) {
            let node = this.nodes[index];
            if (node.getLocalX() !== pos.x || node.getLocalY() !== pos.y) {
                this.nodes[index].setLocalPos(pos);
                // Recalculate rotation and move mainbody
                let deltaX = this.nodes[1].getLocalX() - this.nodes[0].getLocalX();
                let deltaY = this.nodes[1].getLocalY() - this.nodes[0].getLocalY();
                let grad = deltaY / deltaX;
                let rot = Math.atan(grad)* 180 / Math.PI;
                if (deltaX >= 0) {
                    rot = 180+rot;
                }
                this.mainBodyPos.x = this.nodes[0].getLocalX() + deltaX/2;
                this.mainBodyPos.y = this.nodes[0].getLocalY() + deltaY/2;
                this.rot = rot -90
            }
        }
    }

    shift(pos: Vector2d) {
        // if (this.shiftVec.x !== pos.x || this.shiftVec.y !== pos.y) {
            this.shiftVec.x = pos.x;
            this.shiftVec.y = pos.y;
            this.nodes.forEach((node) => {
                node.shift(pos);
            })
            let deltaX = this.nodes[1].getShiftX() - this.nodes[0].getShiftX();
            let deltaY = this.nodes[1].getShiftY() - this.nodes[0].getShiftY();
            let grad = deltaY / deltaX;
            let rot = Math.atan(grad)* 180 / Math.PI;
                if (deltaX >= 0) {
                    rot = 180 + rot;
                }
            this.mainBodyPos.x = this.nodes[0].getShiftX() + deltaX/2;
            this.mainBodyPos.y = this.nodes[0].getShiftY() + deltaY/2;
            this.rot = rot -90
        // }
    }

    getMainBodyRect() {
        let lx = 0, ly = 0, hx = 0, hy = 0;
        this.mainBody.lines.forEach((line) => {
            for (let i = 0; i < 2; i++) {
                let x = line.points[2*i];
                let y = line.points[2*i+1];
                if (x < lx) {
                    lx = x;
                }
                if (x > hx) {
                    hx =x
                }
                if (y < ly) {
                    ly = y
                }
                if (y > hy) {
                    hy = y
                }
            }
        })
        this.mainBody.rects.forEach((rect) => {
            if (rect.x < lx) {
                lx = rect.x;
            }
            if (rect.x + rect.w > hx) {
                hx = rect.x + rect.w
            }
            if (rect.y < ly) {
                ly = rect.y
            }
            if (rect.y + rect.h > hy) {
                hy = rect.y + rect.h
            }
        })
        this.mainBody.circles.forEach((circle) => {
            if (circle.x - circle.radius < lx) {
                lx = circle.x - circle.radius
            }
            if (circle.x + circle.radius > hx) {
                hx = circle.x + circle.radius
            }
            if (circle.y - circle.radius < ly) {
                ly = circle.y - circle.radius
            }
            if (circle.y + circle.radius > hy) {
                hy = circle.y + circle.radius
            }
        })
        this.mainBody.arcs.forEach((arc) => {
            if (arc.x - arc.r < lx) {
                lx = arc.x - arc.r
            }
            if (arc.x + arc.r > hx) {
                hx = arc.x + arc.r
            }
            if (arc.y - arc.r < ly) {
                ly = arc.y - arc.r
            }
            if (arc.y + arc.r > hy) {
                hy = arc.y + arc.r
            }
        })
        this.relRect.lx = lx;
        this.relRect.ly = ly;
        this.relRect.hx = hx;
        this.relRect.hy = hy;
    }

    select(x: number, y: number, w: number, h: number): boolean {
        let flag = false;
        let mx = this.mainBodyPos.x, my = this.mainBodyPos.y;

        // console.log("x: %d, y: %d, w: %d, h: %d", x, y, w, h);
        // console.log("lx: %d, ly: %d, hx: %d, hy: %d", mx+this.relRect.lx, 
            // my + this.relRect.ly, mx + this.relRect.hx, my + this.relRect.hy);
        

        if (x <= mx + this.relRect.lx && mx + this.relRect.hx <= x + w) {
            if (y <= my + this.relRect.ly && my + this.relRect.hy <= y + h) {
                flag = true
            }
        }

        return flag
    }

    place() {

            this.nodes.forEach((node) => {
                node.shift({x:0, y: 0});
            })
    }

    delete() {
        this.isDeleted = true
    }

    getMainBody() {
        return this.mainBody
    }

    getAnchors() {
        return this.anchorPoints
    }

    getNodes() {
        return this.nodes
    }

    getRot() {
        return this.rot
    }

    getRefPos() {
        return this.mainBodyPos
    }

    getNetlist(): {prefix: string, nodes: Array<Vector2d>, value: string} {
        // Fix later
        return {prefix: this.type === 'res' ? "R" : "C", nodes: [{x:this.nodes[0].getLocalX(), y:this.nodes[0].getLocalY()},
            {x:this.nodes[1].getLocalX(), y:this.nodes[1].getLocalY()}], value: this.value}
    }

    decodeRes() {
        if (this.type === 'res') {
            let n1:number = 0, n2:number =0, mul:number = 0, tol: number = 11;
            n1 = Number(this.value.charAt(0))
            if (this.value.charAt(1) === '.') {
                mul = mul -1;
                n2 = Number(this.value.charAt(2))
            } else {
                n2 = Number(this.value.charAt(1))
                if (Number.isNaN(n2)) {
                    n2 = 0;
                    mul = mul -1;
                }
            }
            if (this.value.charAt(this.value.length-1) === 'k') {
                mul = mul + 3
            }
            if (this.value.length >= 3 && this.value.charAt(2) === '0') {
                mul = mul+1;
            }
            console.log("Res n1: " + n1 + " n2: " + n2 + " mul: " + mul);
            this.resLines.push({points:[-10,-10,10,-10], strokeWidth:2, color:ResColorMap[n1]})
            this.resLines.push({points:[-10,-5,10,-5], strokeWidth:2, color:ResColorMap[n2]})
            this.resLines.push({points:[-10,0,10,0], strokeWidth:2, color:ResColorMap[mul]})
            this.resLines.push({points:[-10,10,10,10], strokeWidth:2, color:ResColorMap[tol]})
            return [n1, n2, mul, tol]    
        }
    }

    getRep(){
        return {
            "type": this.type,
            "value": this.value,
            "nodes": [this.nodes[0].getPos(), this.nodes[1].getPos()],
            "mainBodyPos": this.mainBodyPos
        }
    }
}

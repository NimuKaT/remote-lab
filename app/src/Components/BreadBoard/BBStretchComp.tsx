import { Vector2d } from 'konva/lib/types'
import {BBSymbol} from './BBSymbol'
import BBNode from './BBNode'
import BBStretchCompRef from './BBStrechCompRef'

export default class BBStretchComp {
    mainBody: BBSymbol
    anchorPoints: Array<Vector2d>
    nodes: Array<BBNode>
    rot: number = 0;
    mainBodyPos: Vector2d
    shiftVec: Vector2d = {x:0, y:0}
    isDeleted: boolean = false

    constructor(name: string, pos: Vector2d) {
        let refs = new BBStretchCompRef()
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
}

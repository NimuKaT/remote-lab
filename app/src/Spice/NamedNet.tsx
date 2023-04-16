import { Group } from "konva/lib/Group"
import { Vector2d } from "konva/lib/types"
import React from "react"
import { CollisionBox } from "./CollisionBox"
import SPNode from "./Node"
import NodeManager from "./NodeManager"

export default class NamedNet {
    namedNet: string
    node: SPNode
    nodeManager: NodeManager
    pos: Vector2d
    shiftVec: Vector2d = {x:0,y:0};
    deleted: boolean = false;
    update?: () => void;
    ref?: React.RefObject<Group>;

    constructor(name: string, nodeMan: NodeManager, x: number, y: number) {
        this.namedNet = name;
        if (this.namedNet.toLocaleLowerCase() === 'gnd') {
            this.namedNet = '0'
        }
        this.nodeManager = nodeMan;
        this.pos = {
            x: x,
            y: y
        }
        this.node = this.nodeManager.newNode(this);
        this.node.setParent(this);
    }

    setName(name: string) {
        this.namedNet = name;
    }
    
    getname() {
        return this.namedNet;
    }

    getX() {
        return this.pos.x + this.shiftVec.x;
    }

    getY() {
        return this.pos.y + this.shiftVec.y;
    }

    getNode() {
        return this.node;
    }

    setUpdate(update: () => void) {
        this.update = update;
    }

    setRef(ref: React.RefObject<Group>) {
        this.ref = ref;
    }

    getCollisionBox() {
        let box: CollisionBox;
        if (this.namedNet === '0') {
            box = {
                x1: this.getX() - 16,
                y1: this.getY(),
                x2: this.getX() + 16,
                y2: this.getY() + 16
            }
        }
        else {
            if (this.ref && this.ref.current) {
                let rect = this.ref.current.getClientRect();
                let pos = this.ref.current.getPosition();
                box = {
                    x1: pos.x - Math.floor(rect.width/4),
                    y1: pos.y - Math.floor(rect.height/3),
                    x2: pos.x + Math.floor(rect.width/4),
                    y2: pos.y,
                }
    
            }
            else {
                box = {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0
                }
            }
       }
       return box
    }

    shift(shift: Vector2d){
        this.shiftVec = shift;
        if (this.update) {
            this.update();
        }
    }

    place() {
        this.pos.x = this.pos.x + this.shiftVec.x;
        this.pos.y = this.pos.y + this.shiftVec.y;
        this.shiftVec.x = 0;
        this.shiftVec.y = 0;
        this.cancel();
        if (this.update) {
            this.update();
        }
    }

    cancel() {
        this.shiftVec.x = 0;
        this.shiftVec.y = 0;

    }

    delete(){
        this.node.delete()
        this.deleted = true;
    }
    
    getSchematic() {
        let data: Array<string> = [];
        data.push("FLAG " + this.pos.x + " " + this.pos.y + " " + this.namedNet);
        return data;
    }
    
}
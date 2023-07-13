import { Vector2d } from "konva/lib/types";
import React from "react";
import { CollisionBox } from "../../Spice/CollisionBox";
import BBNode from "./BBNode"
import BBWireObj from "./BBWireObj";
import { log } from "console";

export default class BBWire {
    deleted: boolean = false
    nodes: Array<BBNode> = [];
    nodePos: [Vector2d, Vector2d] = [{x:0,y:0}, {x:0, y:0}];
    anchors: Array<Vector2d> = [];
    color: string = 'red'
    shiftVector: Vector2d = {x: 0, y:0}
    ref?: BBWireObj;
    isSelected: boolean = false;

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

    select(x: number, y: number, w: number, h: number): boolean {
        let flag: boolean = false;
        let lx = this.nodePos[0].x;
        let ly = this.nodePos[0].y;
        let hx = this.nodePos[1].x;
        let hy = this.nodePos[1].y;

        if (lx > hx) {
            lx = hx;
            hx = this.nodePos[0].x;
        }
        if (ly > hy) {
            ly = hy;
            hy = this.nodePos[0].y;
        }
        if (x <= lx && hx <= x + w) {
            if (y <= ly && hy <= y + h) {
                flag = true
            }
        }
        
        this.isSelected = flag
        return flag
    }

    place(){}

    cancel(){}

    delete(){
        this.deleted = true
    }

    checkSelection(box: CollisionBox): boolean {
        let flag: boolean = false;
        return flag

    }

    deselect(){
        // if (this.isSelected) {
        //     this.isSelected = false
        //     this.ref?.forceUpdate()
        // }
        this.isSelected = false
    }

    changeColor(newColor: string) {
        this.color = newColor
    }

    getRef(ref: BBWireObj) {
        this.ref = ref;
    }

    getRep() {
        return {
            "nodePos": this.nodePos,
            "anchors": this.anchors,
            "color": this.color
        }
    }

    isHover(pos: Vector2d) {
        let flag = false;
        let x1 = this.nodePos[0].x
        let y1 = -this.nodePos[0].y
        let x2 = this.nodePos[1].x
        let y2 = -this.nodePos[1].y
        let lx = x1
        let ly = -y1;
        let hx = x2;
        let hy = -y2;
        // console.log(lx, hx, ly, hy)
        // console.log(pos)
        if (lx > hx) {
            lx = hx;
            hx = x1;
        }
        if (ly > hy) {
            ly = hy;
            hy = -y1;
        }
        if (lx <= pos.x && pos.x <= hx) {
            if (ly <= pos.y && pos.y <= hy) {
        //         let dx = hx - lx;
        //         let dy = -(hy - ly);
        //         let c = dy*lx + dx*ly;
        //         d = Math.abs(dy*pos.x - dx*pos.y + c) / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                let dx = x2 - x1;
                let dy = -(y2 - y1);
                let c = - dy*x1 - dx*y1;
                let d = Math.abs(dy*pos.x - dx*pos.y + c) / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                let mx = (x2+x1)/2
                let my = (y2+y1)/2;
                let mc = - dx*mx + dy*my;
                let md = Math.abs(dx*pos.x + dy*pos.y + mc) / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                // console.log("Distance: " + d + " Distance: " + md);
                if (d <= 5 && md <= Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))) {
                    // console.log("Select");
                    
                    flag = true
                    this.isSelected = true
                }
            } else if (ly === hy) {
            // console.log("Same y");
            // console.log(ly - 8, pos.y, hy + 8)
            if (ly - 8 <= pos.y && pos.y <= hy + 8) {
                // console.log("in y range")
                // console.log(lx, pos.x , hx);
                
                if (lx <= pos.x && pos.x <= hx) {
                // console.log("in x range")
                    flag = true
                    this.isSelected = true
                }
            }
        }
        } else if (lx === hx) {
            // console.log("Same x");
            
            if (lx - 8 <= pos.x && pos.x <= hx +8) {
                // console.log("in x range")
                if (ly <= pos.y && pos.y <= hy) {
                // console.log("in y range")
                    flag = true
                    this.isSelected = true
                }
            }
        } 
        return flag
        
    }
}
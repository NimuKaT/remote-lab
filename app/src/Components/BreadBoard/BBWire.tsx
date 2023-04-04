import { CollisionBox } from "../../Spice/CollisionBox";
import {BBNode} from "./BBNode"

export default class BBWire {
    deleted: boolean = false
    nodes: Array<BBNode> = [];
    nodePos: [Vector2d, Vector2d];
    anchors: Array<BBNode> = [];
    color: string = 'red'
    shiftVector: Vector2d = {x: 0, y:0}


    placeNode(pos: Vector2d) {

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
}
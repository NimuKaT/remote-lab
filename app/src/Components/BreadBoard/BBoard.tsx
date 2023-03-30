import { Vector2d } from "konva/lib/types";
import BreadBoardWindow from "../BreadBoardWindow";
import BBIC from "./BBIC";
import BBNode from "./BBNode";

interface BBlabels {
    text: string,
    pos: Vector2d
}

export default class BBoard {
    ref: BreadBoardWindow
    mjCol: number
    mjRow: number
    mnCol: number
    nodes: Array<BBNode> = [];
    labels: Array<BBlabels> = [];
    nodeDist: number = 24;
    spacerSize: number = 1;
    ic: Array<BBIC> = [];

    selectedIC: Array<BBIC> = [];

    constructor(mjCol: number, mjRow: number, mnCol: number, ref: BreadBoardWindow) {
        this.ref = ref;
        this.mjCol = mjCol;
        this.mjRow = mjRow;
        this.mnCol = mnCol;
        let prefix = 'A';
        let labelLetter = 'A';
        for (let i = 0; i < this.mjCol; i++) {
           for (let j = 0; j < this.mjRow; j++) {
                for (let k = 0; k < this.mnCol; k++) {
                    this.nodes.push(new BBNode({x: j*this.nodeDist, y: k * this.nodeDist + i * (this.spacerSize + this.mnCol) * this.nodeDist},
                    prefix + j));
                    if (j === 0) {
                        this.labels.push({text: labelLetter,pos:{ x: - 1.5 *this.nodeDist, y:k * this.nodeDist + i * (this.spacerSize + this.mnCol) * this.nodeDist - 16/2}})
                        labelLetter = String.fromCharCode(labelLetter.charCodeAt(0) + 1)
                        
    
                    }
                    if (k === 0 && i === 0) {
                        this.labels.push({
                            text: (j+1).toString(),
                            pos: {x: (j-0.5)*this.nodeDist, y:  - 1.5 * this.nodeDist}
                        })
                    }
               }
           } 
           prefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
        }
    }

    foreceUpdate() {
        this.ref.forceUpdate();
    }

    createNewStaticComp(modelName: string, pos: Vector2d, isPlaced?: boolean) {
        let ic = new BBIC(modelName, pos)
        this.ic.push(ic);
        if (!isPlaced) {
            this.selectedIC.push(ic);
        }
    }

    moveComponents(shift: Vector2d) {
        this.selectedIC.forEach((ic) => {
            ic.shift(shift);
        })
    }

    placeComponents() {
        this.selectedIC.forEach((ic) => {
            ic.place();
        })
        this.selectedIC = [];
    }

    cancelMovement() {
        this.selectedIC.forEach((ic) => {
            ic.cancel();
        })
        this.selectedIC = [];
    }

    deleteComponents() {
        this.selectedIC.forEach((ic) => {
            ic.delete();
        })
        this.selectedIC = []
    }

    getNodes() {
        return this.nodes;
    }

    getLabels() {
        return this.labels;
    }
    getIC() {
        return this.ic;
    }
}
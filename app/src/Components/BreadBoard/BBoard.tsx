import { Vector2d } from "konva/lib/types";
import BreadBoardWindow from "../BreadBoardWindow";
import BBIC from "./BBIC";
import BBNode from "./BBNode";
import BBWire from "./BBWire";
import BBStretchComp from "./BBStretchComp";

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
    wires: Array<BBWire> = [];
    stretchComp: Array<BBStretchComp> = []

    selectedIC: Array<BBIC> = [];
    selectedWire: Array<BBWire> = [];
    selectedStretch: Array<BBStretchComp> = []

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

    createNewStretchComp(modelName: string, pos: Vector2d) {
        let stretch = new BBStretchComp(modelName, pos)
        this.stretchComp.push(stretch);
        this.selectedStretch.push(stretch);
    }

    createNewWire(pos: Vector2d, color: string = 'red') {
        let wire = new BBWire();
        wire.placeNode(pos, 0);
        this.wires.push(wire);
        this.selectedWire.push(wire);
    }

    placeWireEnd(pos: Vector2d, index: 0|1) {
        this.selectedWire.forEach((wire) => {
            wire.placeNode(pos, index);
        })
    }

    placeStretchEnd(pos:Vector2d, index: number) {
        this.selectedStretch.forEach((comp) => {
            comp.placeNode(index, pos);
        })
    }

    moveComponents(shift: Vector2d) {
        this.selectedIC.forEach((ic) => {
            ic.shift(shift);
        })
        this.selectedStretch.forEach((comp) => {
            comp.shift(shift)
        })
    }

    placeComponents() {
        this.selectedIC.forEach((ic) => {
            ic.place();
        })
        this.selectedStretch.forEach((comp) => {
            comp.place()
        })
        this.selectedIC = [];
        this.selectedWire = [];
        this.selectedStretch = []
    }

    cancelMovement() {
        this.selectedIC.forEach((ic) => {
            ic.cancel();
        })
        this.selectedIC = [];
        this.selectedWire.forEach((wire) => {

        })
        this.selectedWire = [];
        this.selectedStretch.forEach((comp) => {

        })
        this.selectedStretch = []
    }

    deleteComponents() {
        this.selectedIC.forEach((ic) => {
            ic.delete();
        })
        this.selectedIC = []
        this.selectedStretch.forEach((comp) => {
            comp.delete();
        })
    }

    // onBBNode(pos: Vector2d): Vector2d | undefined {
    onBBNode(pos: Vector2d)  {
        let flag: boolean = false;
        let retPos = undefined
        this.nodes.forEach((node) => {
            let n = node.isHover(pos);
            if (n) {
                flag = true;
                retPos = pos
                // return n;
            }
        })
        // return undefined;
        return retPos

    }

    getNodes() {
        return this.nodes;
    }

    getWires() {
        return this.wires;
    }

    getLabels() {
        return this.labels;
    }
    getIC() {
        return this.ic;
    }

    getStretch() {
        return this.stretchComp;
    }
}